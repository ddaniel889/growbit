const NodeCache = require("node-cache");

const GROWTOPIA_CURRENCY = "growtopia_DLS";

const InGameCurrencyExchangeRate = require("../../../database/models/InGameCurrencyExchangeRate");

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

function invalidateCache() {
  cache.del("currencyToDollar");
  cache.del("dollarToCurrency");
}

const mongoose = require("mongoose");

async function wiwiTokenToUsd(tokens) {
  let currencyToDollar = cache.get("currencyToDollar");

  if (currencyToDollar) {
    return tokens * currencyToDollar;
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn(
      "MongoDB not connected. Using default Growtopia exchange rate."
    );
    return tokens * 0.18;
  }

  const exchangeRate = await InGameCurrencyExchangeRate.findOne({
    currency: GROWTOPIA_CURRENCY,
  }).lean();

  if (!exchangeRate?.currencyToDollar) {
    console.warn("Exchange rate missing! Using default 0.18");
    return tokens * 0.18;
  }

  cache.set("currencyToDollar", exchangeRate.currencyToDollar);
  return tokens * exchangeRate.currencyToDollar;
}

async function usdToWiwiToken(dollars) {
  let dollarToCurrency = cache.get("dollarToCurrency");

  if (dollarToCurrency) {
    return dollars * dollarToCurrency;
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn(
      "MongoDB not connected. Using default Growtopia exchange rate."
    );
    return dollars * 5.56;
  }

  const exchangeRate = await InGameCurrencyExchangeRate.findOne({
    currency: GROWTOPIA_CURRENCY,
  }).lean();

  if (!exchangeRate?.dollarToCurrency) {
    console.warn("Exchange rate missing! Using default 5.56");
    return dollars * 5.56;
  }

  cache.set("dollarToCurrency", exchangeRate.dollarToCurrency);

  return dollars * exchangeRate.dollarToCurrency;
}

// async function getExchangeRate() {
//   return await InGameCurrencyExchangeRate.findOne({ currency: CURRENCY }).lean();
// }

async function init() {
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected. Skipping Growtopia Currency init.");
    return;
  }
  const exists = await InGameCurrencyExchangeRate.findOne({
    currency: GROWTOPIA_CURRENCY,
  }).lean();
  if (!exists) {
    try {
      await InGameCurrencyExchangeRate.create({
        currency: GROWTOPIA_CURRENCY,
        dollarToCurrency: 5.56,
        currencyToDollar: 0.18,
      });
    } catch (e) {
      console.warn(
        "Could not init Growtopia Currency Service (likely collection limit reached):",
        e.message
      );
    }
  }
}

module.exports = {
  init,
  wiwiTokenToUsd: wiwiTokenToUsd,
  usdToWiwiToken: usdToWiwiToken,
  growbitTokenToUsd: wiwiTokenToUsd, // Alias for backward compatibility during migration
  usdToGrowbitToken: usdToWiwiToken, // Alias for backward compatibility during migration
  GROWTOPIA_CURRENCY,
  invalidateCache,
};
