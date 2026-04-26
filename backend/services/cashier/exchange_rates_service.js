const {
  wiwiTokenToUsd,
  usdToWiwiToken,
} = require("./growtopia/currency_service");

async function dollarToToken(dollar) {
  //TODO : Mmo tokens are dollar. For 99wiwi fetch exchange rate
  return await usdToWiwiToken(dollar);
}

async function tokenToDollar(tokens) {
  //TODO : Mmo tokens are dollar. For 99wiwi fetch exchange rate
  return await wiwiTokenToUsd(tokens);
}

module.exports = {
  dollarToToken,
};
