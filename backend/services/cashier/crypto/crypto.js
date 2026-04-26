const validator = require("validator");
const fetch = require("node-fetch");
const { logger } = require("../../../utils/logger");
const axios = require("axios");

const CryptoAddress = require("../../../database/models/CryptoAddress");

const { settingGet } = require("../../../utils/setting");

const getSupportedCurrencies = (withdraw = false) => {
  const settings = settingGet();

  // Check global toggle first
  if (settings && settings.crypto) {
    const globalEnabled = withdraw
      ? settings.crypto.withdraw?.enabled
      : settings.crypto.deposit?.enabled;
    if (globalEnabled === false) return [];
  }

  if (settings && settings.crypto && Array.isArray(settings.crypto.coins)) {
    return settings.crypto.coins.filter((c) =>
      withdraw ? c.enabled && c.withdrawEnabled : c.enabled,
    );
  }
  return [
    { name: "BTC", network: "Bitcoin", enabled: true, withdrawEnabled: false },
    { name: "ETH", network: "ERC20", enabled: true, withdrawEnabled: false },
    { name: "TRX", network: "TRC20", enabled: true, withdrawEnabled: false },
    { name: "LTC", network: "Litecoin", enabled: true, withdrawEnabled: true },
  ].filter((c) => (withdraw ? c.enabled && c.withdrawEnabled : c.enabled));
};

const APP_URL = process.env.APP_URL;

const cashierCheckSendCryptoWithdrawData = (data) => {
  if (!data) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (
    !data.currency ||
    typeof data.currency !== "string" ||
    !getSupportedCurrencies(true)
      .map((c) => c.name)
      .includes(data.currency)
  ) {
    throw new Error("You’ve entered an invalid withdraw currency.");
  } else if (
    data.amount === undefined ||
    isNaN(data.amount) === true ||
    data.amount <= 0
  ) {
    throw new Error("You’ve entered an invalid withdraw amount.");
  } else if (data.amount < (process.env.MIN_WITHDRAWAL_AMOUNT || 5)) {
    throw new Error("Please try a minimum withdrawal of $5.");
  } else if (
    data.address === undefined ||
    typeof data.address !== "string" ||
    (data.currency === "BTC" &&
      validator.isBtcAddress(data.address) !== true) ||
    (data.currency === "ETH" &&
      validator.isEthereumAddress(data.address) !== true) ||
    (data.currency === "LTC" &&
      /^(L[1-9a-km-zA-HJ-NP-Z]{33}|[M3][1-9a-km-zA-HJ-NP-Z]{33}|ltc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59})$/i.test(
        data.address,
      ) !== true)
  ) {
    throw new Error(
      `You’ve entered an invalid ${data.currency} withdraw address.`,
    );
  }
};

const cashierCheckSendCryptoWithdrawUser = (data, user) => {
  if (user.balance < data.amount) {
    throw new Error("You don’t have enough balance for this action.");
  } else if (user.limits.betToWithdraw > 0) {
    throw new Error(
      `You need to wager ${parseFloat(user.limits.betToWithdraw)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} more before you can withdraw.`,
    );
  } else if (user.limits.blockSponsor || user.limits.blockWithdraw) {
    throw new Error(
      "You aren`t allowed to withdraw at the moment. Please contact the support for more information.",
    );
  }
};

const cashierCheckSendCryptoWithdrawTransactions = (transactionsDatabase) => {
  if (transactionsDatabase.length >= 5) {
    throw new Error(
      "You aren`t allowed to have more then 5 pending crypto withdraws.",
    );
  }
};

const cashierCryptoGetPricesByOxapay = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Send post request for prices with empty body
      let response = await axios.post("https://api.oxapay.com/api/prices", {}, { timeout: 15000 });

      const data = response.data;
      if (data.result === 100) {
        resolve(data.data);
      } else {
        reject(new Error(data.message || "Failed to fetch prices"));
      }
    } catch (err) {
      logger.error(`[Oxapay] Prices fetch error: ${err.message}`);
      reject(err);
    }
  });
};

const getCurrencies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.post(
        "https://api.oxapay.com/api/currencies",
        {},
        { timeout: 15000 }
      );

      const data = response.data;
      if (data.result === 100) {
        resolve(data.data);
      } else {
        reject(new Error(data.message || "Failed to fetch currencies"));
      }
    } catch (err) {
      logger.error(`[Oxapay] Currencies fetch error: ${err.message}`);
      reject(err);
    }
  });
};

const generateAddressOxa = async (currency, network) => {
  if (!APP_URL) {
    throw new Error("APP_URL not set");
  }

  const url = "https://api.oxapay.com/api/payment/static-address";

  const reqData = {
    network: network,
    callbackUrl: `${APP_URL}/api/callback/oxapay-deposit`,
  };

  const headers = {
    merchant_api_key: process.env.OXAPAY_MERCHANT_API_KEY,
    "Content-Type": "application/json",
  };

  let retryCount = 0;
  let lastError;

  while (retryCount < 3) {
    try {
      if (!headers.merchant_api_key) {
        throw new Error("OXAPAY_MERCHANT_API_KEY is not set in .env");
      }

      let { data } = await axios.post(url, reqData, {
        headers,
        timeout: 30000,
      });

      if (data.result !== 100) {
        throw new Error(data.message || "Oxapay API error");
      }

      return data;
    } catch (e) {
      console.error(
        `[Oxapay] Error generating static address (Attempt ${retryCount + 1}):`,
        e.response?.data?.message || e.message,
      );
      lastError = e;
      retryCount++;
      if (retryCount < 3) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * retryCount));
      }
    }
  }
  throw lastError;
};

const getWalletAddress = async (currency, network, userId) => {
  try {
    let wallet = await CryptoAddress.findOneAndUpdate(
      { user: null, name: currency, network: network },
      { $set: { user: userId } },
      { new: true },
    )
      .lean()
      .exec();

    if (!wallet) {
      wallet = await generateWalletAddress(currency, network, userId);
    }
    return wallet;
  } catch (e) {
    logger.error(e);
    return null;
  }
};

const generateWalletAddress = async (currency, network, userId = null) => {
  //Generate in advance
  let createdAddress = await generateAddressOxa(currency, network);
  if (createdAddress) {
    let addr;
    try {
      addr = await CryptoAddress.create({
        name: currency,
        network: network,
        address: createdAddress.address,
        user: userId,
      });
    } catch (e) {
      console.warn(
        "Could not save wallet address (likely collection limit reached):",
        e.message,
      );
      return null;
    }
    return addr?.toObject();
  }
};

const ADDRESS_RESERVE = process.env.ADDRESS_RESERVE !== undefined ? parseInt(process.env.ADDRESS_RESERVE) : 500;

//TODO: remove addresses from inactive users

const GENERATE_ON_DEMAND = new Set(["SOL"]);

async function preGenerateWalletAddresses() {
  try {
    const supported = getSupportedCurrencies();
    const existing = await CryptoAddress.aggregate([
      {
        $match: {
          user: null,
          name: { $in: supported.map((currency) => currency.name) },
          network: {
            $in: supported.map((currency) => currency.network),
          },
        },
      },
      {
        $group: {
          _id: { name: "$name", network: "$network" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          network: "$_id.network",
          count: 1,
        },
      },
    ]).exec();

    let toCreate = [];

    let currencies = supported.filter((c) => !GENERATE_ON_DEMAND.has(c.name));

    for (let curr of currencies) {
      let count =
        existing.find((e) => e.name === curr.name && e.network === curr.network)
          ?.count || 0;

      if (count < ADDRESS_RESERVE) {
        toCreate.push({
          ...curr,
          count: ADDRESS_RESERVE,
        });
      }
    }

    let hasMore;
    do {
      hasMore = false;
      for (let cryptoToCreate of toCreate) {
        if (cryptoToCreate.count > 0) {
          let retryCount = 0;
          let retry = true;
          while (retryCount < 2 && retry) {
            try {
              await generateWalletAddress(
                cryptoToCreate.name,
                cryptoToCreate.network,
              );

              cryptoToCreate.count--;
              retry = false;
              await new Promise((resolve) => setTimeout(resolve, 5000));
            } catch (e) {
              retry = true;
              retryCount++;
              logger.error(
                `Error generating wallet ${cryptoToCreate.name} ${cryptoToCreate.network}`,
              );
              logger.error(e);
              await new Promise((resolve) => setTimeout(resolve, 1000 * 65));
            }
          }
        }
        if (cryptoToCreate.count > 0) {
          hasMore = true; // Set hasMore to true if there are still items to create
        }
      }

      //TODO: sleep
    } while (hasMore);
  } catch (e) {
    logger.error(e);
  }

  setTimeout(
    () => {
      preGenerateWalletAddresses();
    },
    1000 * 60 * 5,
  );
}

module.exports = {
  cashierCheckSendCryptoWithdrawData,
  cashierCheckSendCryptoWithdrawUser,
  cashierCheckSendCryptoWithdrawTransactions,
  cashierCryptoGetPricesByOxapay,
  getCurrencies,
  preGenerateWalletAddresses,
  getWalletAddress,
  getSupportedCurrencies,
};
