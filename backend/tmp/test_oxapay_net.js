const axios = require("axios");
const https = require("https");
require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});

async function testOxapayNet() {
  const url = "https://api.oxapay.net/api/prices";
  console.log(`Testing ${url} with certificate verification disabled...`);

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const start = Date.now();
    const response = await axios.post(
      url,
      {},
      {
        headers: { merchant_api_key: process.env.OXAPAY_MERCHANT_API_KEY },
        timeout: 10000,
        httpsAgent: agent,
      },
    );
    console.log(
      `  Success (${Date.now() - start}ms): Status ${response.status}`,
    );
    console.log("  Data:", JSON.stringify(response.data).substring(0, 100));
  } catch (e) {
    console.log(`  Failed: ${e.code || "NO_CODE"} - ${e.message}`);
    if (e.response) {
      console.log("  Response status:", e.response.status);
      console.log("  Response data:", e.response.data);
    }
  }
}

testOxapayNet();
