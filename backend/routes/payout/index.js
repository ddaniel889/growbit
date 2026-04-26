const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require("../../utils/logger");
const { authorizeUser } = require("../../middleware/auth");
const User = require("../../database/models/User");
const Withdraw = require("../../database/models/Withdraw");
const { getVerificationCode } = require('../../services/mailService');


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
                .populate('user', 'username email'); // Traer info del usuario si la necesitas

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

        // --- NUEVA VALIDACIÓN DE RED ---
        const tronRegex = /^T[a-zA-Z0-9]{33,34}$/;
        if (!address || !tronRegex.test(address)) {
            return res.status(400).json({ error: "Invalid TRC20 address format. It must start with 'T'." });
        }
        //

        // 1. Validar el mínimo de 100 SC (Requisito del cliente)
        if (amount < 10) { //amount < 100 validacion real
            return res.status(400).json({ error: "Minimum withdrawal is 100 SC" });
        }

        // 2. Buscar al usuario y verificar saldo real
        user = await User.findById(userId);
        if (!user || user.wallet.sc < amount) {
            return res.status(400).json({ error: "Insufficient SC balance" });
        }

        // 3. (Opcional pero recomendado) Restar el saldo o marcarlo como "congelado"
        user.wallet.sc -= amount;
        await user.save();


        // 3. Obtener Token de Autenticación (Requerido para Payouts)
       const authResponse = await axios.post(`${API_URL}/auth`, {
                email: process.env.NOWPAYMENTS_EMAIL,
                password: process.env.NOWPAYMENTS_APP_PASSWORD
            });
        const token = authResponse.data.token;
        console.log('token AUTH',token)

        // 4. Llamada de servidor a servidor a NowPayments
        const response = await axios.post(`${API_URL}/payout`, {
            withdrawals: [
                {
                    address: address,
                    //currency: "usdttrc20", // Ejemplo de moneda de retiro
                    currency: targetCurrency, // Ahora es dinámico
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

        // --- AUTOMATIZACIÓN INVISIBLE ---
            // Extraemos el ID del lote (batch_id) para verificarlo después
            console.log(response.data)
            //const batchId = response.data.id; 
            const batchId = response?.data?.id || response?.data?.batch_id;

            const newWithdraw = new Withdraw({
                user: userId,
                amount,
                address,
                currency: targetCurrency,
                batch_id: batchId,
                status: "CREATED"
            });
            await newWithdraw.save();
            
            // Disparamos la búsqueda del correo en segundo plano (sin await para no bloquear)
            intentarVerificacionAutomatica(batchId);

            logger.info("Payout initiated, awaiting email verification:", batchId);
            
            res.json({ 
                message: "Withdrawal initiated. Verification is being processed automatically.", 
                data: response.data 
            });
        logger.info("Payout success:",response.data);
        //res.json({ message: "Withdrawal processed", data: response.data });

    } catch (error) {
        // 5. ¡IMPORTANTE! Revertir saldo si la API falla
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

    // /routes/payout/index.js

   router.post('/verify-payout', async (req, res) => {
    // Los datos que recibiste en el correo
    //const { batch_id, verification_code } = req.body; 

    const batch_id = String(req.body.batch_id);
    const verification_code = String(req.body.verification_code);

    try {
        // PASO 1: Login para obtener el Bearer Token (JWT)
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
                    'x-api-key': process.env.NOWPAYMENTS_API_KEY, // Tu API KEY
                    'Authorization': `Bearer ${jwtToken}`, // jwt token
                    'Content-Type': 'application/json'
                }
            }
        );

        // 5. ACTUALIZAR EN MONGO COMO COMPLETADO
            await Withdraw.findOneAndUpdate(
                { batch_id: String(batch_id) },
                { verified: true, status: "PAID" }
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

   // Función auxiliar para esperar el correo y verificar
// 3. FUNCIÓN AUXILIAR: El "Robot" que lee tu Gmail
    async function intentarVerificacionAutomatica(batchId) {
        console.log(`[Auto-Verify] Esperando 20s para buscar el correo del batch: ${batchId}...`);
        
        setTimeout(async () => {
            // Llama a tu mailService para buscar el código
            const code = await getVerificationCode();
            
            if (code) {
                console.log("[Auto-Verify] Código encontrado en Gmail:", code);
                try {
                    // Llama al endpoint de verificación que definimos arriba
                    await axios.post(`http://localhost:${process.env.PORT || 4444}/api/payout/verify-payout`, {
                        batch_id: batchId,
                        verification_code: code
                    });
                    logger.info(`[AUTO-SUCCESS] Batch ${batchId} verificado y liberado.`);
                } catch (err) {
                    console.error("[Auto-Verify] Error al auto-verificar:", err.message);
                }
            } else {
                console.log("[Auto-Verify] No se encontró el código. Verificación manual requerida.");
            }
        }, 30000); // Subí a 25s para mayor seguridad de recepción
    }

    return router;
};