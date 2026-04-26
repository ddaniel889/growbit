const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require("../../utils/logger");
const { authorizeUser } = require("../../middleware/auth");


const API_URL = 'https://api.nowpayments.io/v1';

module.exports = () => {
    router.get('/', [authorizeUser(true)], async (req, res) => { 
  try {
    // Obtenemos la moneda del query o usamos usdttrc20 por defecto
        //const currency = req.query.currency || 'usdttrc20';
       const { currency, amount } = req.query; // Recibimos ambos de la URL

        const response = await axios.get(`${API_URL}/payout/fee`, {
            params: { 
                currency: currency || 'usdttrc20',
                amount: amount || 15 // NOWPayments exige el monto para ser preciso
            },
            headers: {
                'x-api-key': process.env.NOWPAYMENTS_API_KEY
                //'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            fee: response.data.fee
        });
        console.log('fee',response.data)
    } catch (error) {
        console.error("Error getting rates:", error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.message || "The commission could not be calculated"
        });
    }
    });
    return router;
};