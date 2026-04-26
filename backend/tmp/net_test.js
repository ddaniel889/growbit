const axios = require("axios");

async function testConnectivity() {
  const targets = [
    { name: "Oxapay COM", url: "https://api.oxapay.com/api/prices" },
    { name: "Oxapay NET", url: "https://api.oxapay.net/api/prices" },
    { name: "Google", url: "https://www.google.com" },
    { name: "CoinGecko", url: "https://api.coingecko.com/api/v3/ping" },
  ];

  for (const target of targets) {
    console.log(`Testing ${target.name} (${target.url})...`);
    try {
      const start = Date.now();
      const res = await axios.get(target.url, {
        timeout: 10000,
        validateStatus: () => true,
      });
      console.log(`  Result: ${res.status} (${Date.now() - start}ms)`);
    } catch (e) {
      console.log(`  Error: ${e.code || e.message}`);
    }
  }
}

testConnectivity();
