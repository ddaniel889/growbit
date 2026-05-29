const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { logger } = require("../../utils/logger");
const User = require("../../database/models/User");
const BalanceTransaction = require("../../database/models/BalanceTransaction");

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET; 

module.exports = (io) => {
    router.post('/callback', async (req, res) => {
        logger.info("--- NUEVO WEBHOOK RECIBIDO ---");
        console.log("--- NUEVO WEBHOOK RECIBIDO ---")
        logger.info(JSON.stringify(req.body, null, 2));
        console.log('Log req.body req.body')
        console.log(JSON.stringify(req.body, null, 2));
        try {
            const paymentData = req.body;
            const hmac = req.headers['x-nowpayments-sig'];

            // 1. VALIDACIÓN DE SEGURIDAD RECOMENDADA POR NOWPAYMENTS
           const checkHmac = crypto
                .createHmac('sha512', IPN_SECRET)
                .update(JSON.stringify(paymentData, Object.keys(paymentData).sort()))
                .digest('hex');
           console.log('checkHmac',checkHmac)
            if (hmac !== checkHmac) {
                console.error("⚠️ Invalid signature detected Webhook");
                return res.status(401).send('Invalid signature');
            }
          const successStates = ['finished', 'partially_paid'];  
    if (successStates.includes(paymentData.payment_status)) {
    
    const paymentId = paymentData.payment_id;
    const userId = paymentData.order_id.split('_')[1];
    logger.info(`[WEBHOOK] Procesando depósito para el usuario ID: ${userId}`);
    console.log(`[WEBHOOK] Procesando depósito para el usuario ID: ${userId}`);
    const amountReceived = parseFloat(paymentData.actually_paid);

    const scAmount = amountReceived;          
    const gcAmount =  amountReceived * 100;

    try {
        // 1. VERIFICAR SI YA EXISTE (Protección contra duplicados)
        const existingTx = await BalanceTransaction.findOne({ providerId: paymentId });
        if (existingTx) {
            console.log(`[SKIP] Payment ${paymentId} already processed previously.`);
            return res.status(200).send('OK'); 
        }

      
    const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
        $inc: { 
            "wallet.sc": scAmount, 
            "wallet.gc": gcAmount,
            "stats.deposit": amountReceived, 
            "stats.depositCount": 1          
        },
        $set: { updatedAt: new Date() }      
    },
    { new: true }
    ).lean();

    if (!updatedUser) return res.status(404).send('User not found');

   await BalanceTransaction.create({
    user: userId,
    type: "deposit",
    state: "completed",
    providerId: paymentId, 
    amount: amountReceived, 
    details: {
        sc_added: amountReceived * 1,   
        gc_added: amountReceived * 100  
    },
    createdAt: new Date()
   });

        // 4. EMITIR AL SOCKET (Namespace Cashier)
        // Usamos el evento que espera el frontend con el objeto user completo

    const targetRoom = userId.toString();
    if (userId !='') {
       // 1. ACTUALIZACIÓN GLOBAL (Para que el Header suba el saldo)
    // Usamos el namespace /general porque LayoutHeader.vue escucha ahí el evento "user"
    io.of("/general").to(targetRoom).emit("user", {//
        user: updatedUser
    });

    // 2. CIERRE DE MODAL Y NOTIFICACIÓN (Para la vista Deposit.vue)
    // Usamos el namespace /cashier porque Deposit.vue escucha ahí "PAYMENT_SUCCESS"
    io.of("/cashier").to(targetRoom).emit("PAYMENT_SUCCESS", {
        user: updatedUser,
        added: {
        sc: scAmount,
        gc: gcAmount
    }
    });

    console.log(`✅ Sockets emitidos a /general y /cashier para el usuario ${userId}`);
    console.log(`✅ Successful deposit for ${updatedUser.username}`);


         

        }    
     
      return res.status(200).send('OK');
    } catch (dbError) {
        console.error("Error updating balances SC/GC:", dbError);
        return res.status(500).send('Error');
    }
    }

    } catch (error) {
            console.error("❌ Error Webhook:", error.message);
            res.status(500).send('Internal Error');
        }
    });

    return router;
};