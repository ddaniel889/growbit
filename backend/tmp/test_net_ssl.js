const axios = require("axios");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false,
});

async function testNet() {
  console.log("Testing Oxapay NET with SSL ignore...");
  try {
    const res = await axios.get("https://api.oxapay.net/api/prices", {
      httpsAgent: agent,
      timeout: 10000,
    });
    console.log("Success on NET:", res.status);
    console.log("Data sample:", JSON.stringify(res.data).substring(0, 100));
  } catch (e) {
    console.log("Failed on NET even with SSL ignore:", e.message);
    if (e.response) console.log("Response status:", e.response.status);
  }
}

testNet();
