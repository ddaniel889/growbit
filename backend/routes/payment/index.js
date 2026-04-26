const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require("../../utils/logger");
const { authorizeUser } = require("../../middleware/auth");
const Deposit = require("../../database/models/Deposit");

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const API_URL = 'https://api.nowpayments.io/v1';

module.exports = () => {
    router.post('/create', [authorizeUser(true)], async (req, res) => { 
        try {
            const { amount, currency } = req.body;
            const userId = req.user._id;

            if (!amount || !currency) {
                return res.status(400).json({ error: "Amount and currency are required" });
            }

            const response = await axios.post(`${API_URL}/payment`, {  
                price_amount: Number(amount),
                price_currency: 'usd', 
                pay_currency: currency, 
                order_id: `USER_${userId}_${Date.now()}`,
                ipn_callback_url: process.env.WEBHOOK_URL, 
                //success_url: "http://localhost:8080", //using Qr
                //cancel_url: "http://localhost:8080" //using Qr
            }, {
                headers: { 
                    'x-api-key': NOWPAYMENTS_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            logger.info(`[WEBHOOK] Processing /payment: ${response}`);
            console.log(`[WEBHOOK] Processing /payment: ${response}`);
           
            await Deposit.create({
                user: userId,
                amount: Number(amount), 
                pay_amount: response.data.pay_amount, 
                pay_currency: currency,
                payment_id: String(response.data.payment_id),
                pay_address: response.data.pay_address,
                status: 'waiting'
             });
            res.json(response.data); 
            logger.info(response.data);
            
        } catch (error) {
            const errorData = error.response ? error.response.data : error.message;
            console.error("Error NOWPayments:", errorData);
            res.status(error.response?.status || 500).json({ error: errorData });
        }
    });
    return router;
};