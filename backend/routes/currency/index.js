const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

module.exports = () => {
  router.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://api.nowpayments.io/v1/full-currencies', {
        headers: { 'x-api-key': NOWPAYMENTS_API_KEY }
      });

      // 1. DEFINIR la base URL (esto era lo que faltaba)
      const baseUrl = 'https://nowpayments.io';

      // 2. Mapear los resultados
      const currenciesWithFullLogos = response.data.currencies.map(coin => ({
        ...coin,
        // Concatenamos la base URL con la ruta relativa del logo
        logo_url: coin.logo_url ? `${baseUrl}${coin.logo_url}` : null
      }));

      res.json(currenciesWithFullLogos);
    } catch (error) {
      // Es buena idea loguear el error real en la consola de la terminal
      console.error("Error detallado:", error.message);
      res.status(500).json({ error: 'Error al obtener monedas' });
    }
  });
  
  return router;
};