const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require("../../utils/logger");
const { authorizeUser } = require("../../middleware/auth");
const User = require("../../database/models/User");
const Withdraw = require("../../database/models/Withdraw");
const { getVerificationCode } = require('../../services/mailService');
const BalanceTransaction = require("../../database/models/BalanceTransaction");


const API_URL = 'https://api.nowpayments.io/v1';

module.exports = () => {


    router.get('/admin/list', [authorizeUser(true)], async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 12;
            const skip = (page - 1) * limit;

            const data = await Withdraw.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'username email'); 

            const count = await Withdraw.countDocuments();

            res.json({ data, count, page });
        } catch (error) {
            res.status(500).json({ error: "Error fetching withdraws" });
        }
    });

    router.post('/', [authorizeUser(true)], async (req, res) => { 
    try {
        let user;
        const currencyMapping = {
             trc20: "usdttrc20",
             erc20: "usdterc20",
             bep20: "usdtbep20"
        };

        const { amount, address, network } = req.body;
        const targetCurrency = currencyMapping[network];
        const userId = req.user._id;

        // --- Network validation ---
       /* const tronRegex = /^T[a-zA-Z0-9]{33,34}$/;
        if (!address || !tronRegex.test(address)) {
            return res.status(400).json({ error: "Invalid TRC20 address format. It must start with 'T'." });
        }*/


        // 1. Validar el mínimo de 100 SC (Requisito del cliente)
        if (amount < 10) { //amount < 100 validacion real
            return res.status(400).json({ error: "Minimum withdrawal is 100 SC" });
        }

        user = await User.findById(userId);
        if (!user || user.wallet.sc < amount) {
            return res.status(400).json({ error: "Insufficient SC balance" });
        }

        user.wallet.sc -= amount;
        await user.save();

        const authResponse = await axios.post(`${API_URL}/auth`, {
                email: process.env.NOWPAYMENTS_EMAIL,
                password: process.env.NOWPAYMENTS_APP_PASSWORD
            });
        const token = authResponse.data.token;
        console.log('token AUTH',token)

        // call NowPayments
        const response = await axios.post(`${API_URL}/payout`, {
            withdrawals: [
                {
                    address: address,
                    currency: targetCurrency,
                    amount: amount,
                    //ipn_id: "tu_id_de_payouts" // Configurado en NowPayments
                }
            ]
        }, {
            headers: {
                'x-api-key': process.env.NOWPAYMENTS_API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // -- AUTOMATION --
            console.log(response.data)
            //const batchId = response.data.id; 
            const batchId = response?.data?.id || response?.data?.batch_id;

            await BalanceTransaction.create({
                user: userId,
                type: "withdraw",
                state: "created",
                providerId: batchId, 
                amount: amount, 
                createdAt: new Date()
               });

            const newWithdraw = new Withdraw({
                user: userId,
                amount,
                address,
                currency: targetCurrency,
                batch_id: batchId,
                status: "CREATED"
            });
            await newWithdraw.save();
            
            attemptAutomaticVerification(batchId);

            console.log("Payout initiated, awaiting email verification:", batchId);
            
            res.json({ 
                message: "Withdrawal initiated. Verification is being processed automatically.", 
                data: response.data 
            });
            console.log("Payout success:",response.data);
    

        } catch (error) {
          //  Revert
            if (user) {
                user.wallet.sc += amount;
                await user.save();
                logger.error("Saldo revertido al usuario por error en API");
            }

            const errorData = error.response?.data || error.message;
            console.error("Error en Payout:", errorData);
            res.status(500).json({ error: "Failed to process withdrawal", details: errorData });
       }
    });

   router.post('/verify-payout', async (req, res) => {

    //const { batch_id, verification_code } = req.body; 

    const batch_id = String(req.body.batch_id);
    const verification_code = String(req.body.verification_code);
    const userId = req.user._id;

    try {
       
        const loginResponse = await axios.post('https://api.nowpayments.io/v1/auth', {
            email: process.env.NOWPAYMENTS_EMAIL,
            password: process.env.NOWPAYMENTS_PASSWORD
        });

        const jwtToken = loginResponse.data.token;

        const response = await axios.post(
            `https://api.nowpayments.io/v1/payout/${batch_id}/verify`,
            { verification_code },
            {
                headers: {
                    'x-api-key': process.env.NOWPAYMENTS_API_KEY, 
                    'Authorization': `Bearer ${jwtToken}`, 
                    'Content-Type': 'application/json'
                }
            }
          );

   
            await Withdraw.findOneAndUpdate(
                { batch_id: String(batch_id) },
                { verified: true, status: "PAID" }
            );

            await BalanceTransaction.findOneAndUpdate(
                { user: String(userId) },
                { state: "paid" }
            );

           res.json({
            success: true,
            message: "¡Código aceptado! El dinero va en camino.",
            data: response.data
        });
        console.log(response.data);
    } catch (error) {
        console.error("Error en la verificación:", error.response?.data || error.message);
        console.error("Detalle del error:", error);
        res.status(400).json({
            success: false,
            error: error.response?.data || "Error al verificar"
        });
    }
   });

  
   //  Gmail
    async function attemptAutomaticVerification(batchId) {
        console.log(`[Auto-Verify] waiting 20s for looking for batch: ${batchId}...`);
        
        setTimeout(async () => {
            // call mailService code
            const code = await getVerificationCode();
            
            if (code) {
                console.log("[Auto-Verify] Code found in Gmail:", code);
                try {
                    
                    await axios.post(`http://localhost:${process.env.PORT || 4444}/api/payout/verify-payout`, {
                        batch_id: batchId,
                        verification_code: code
                    });
                    console.log(`[AUTO-SUCCESS] Batch ${batchId} verified and released.`);
                } catch (err) {
                    console.error("[Auto-Verify] Error  auto-verified:", err.message);
                }
            } else {
                console.log("[Auto-Verify] No code found. Verification required.");
            }
        }, 30000); 
    }

    return router;
};