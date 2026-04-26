const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require("../../utils/logger");
const { authorizeUser } = require("../../middleware/auth");


const API_URL = 'https://api.nowpayments.io/v1';

module.exports = () => {
    router.get('/', [authorizeUser(true)], async (req, res) => { 
    try {
        const response = await axios.get(`${API_URL}/balance`, {
            headers: {
                'x-api-key': process.env.NOWPAYMENTS_API_KEY,
                // Si usas autenticación por token Bearer, inclúyela aquí también
            }
        });

        res.json(response.data);
    } catch (error) {
        logger.error("Error al consultar balance de custodia:", error.message);
        res.status(500).json({ error: "No se pudo verificar el balance de custodia" });
    }
    });
    return router;
};