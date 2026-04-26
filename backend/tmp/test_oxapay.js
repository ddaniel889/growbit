const axios = require("axios");
require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});

async function testConnectivity() {
  const urls = [
    "https://api.oxapay.com/api/prices",
    "https://api.oxapay.net/api/prices",
    "https://oxapay.com/api/prices",
    "https://oxapay.net/api/prices",
    "https://api.coingecko.com/api/v3/ping",
  ];

  for (const url of urls) {
    console.log(`Testing ${url}...`);
    try {
      const start = Date.now();
      const response = await axios.post(
        url,
        {},
        {
          headers: { merchant_api_key: process.env.OXAPAY_MERCHANT_API_KEY },
          timeout: 30000,
        },
      );
      console.log(
        `  Success (${Date.now() - start}ms): Status ${response.status}`,
      );
    } catch (e) {
      console.log(`  Failed: ${e.code} - ${e.message}`);
    }
  }
}

testConnectivity();
