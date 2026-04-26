// Load database models
const Setting = require("../database/models/Setting");

// Setting variables
let settings = null;

const defaultSettings = {
  general: {
    maintenance: { enabled: false },
    rain: { enabled: false },
    leaderboard: { enabled: false },
    tip: { enabled: false },
    affiliate: { enabled: false },
    reward: { multiplier: 1 },
  },
  chat: {
    mode: "normal",
    enabled: true,
    rooms: {
      en: { enabled: true },
      tr: { enabled: true },
      de: { enabled: true },
      es: { enabled: true },
      beg: { enabled: true },
      whale: { enabled: true },
    },
  },
  games: {
    crash: { enabled: true },
    dice: { enabled: true },
    mines: { enabled: true },
    keno: { enabled: true },
    plinko: { enabled: true },
    slide: { enabled: true },
    coinflip: { enabled: true },
    cases: { enabled: true },
    reme: { enabled: true },
    towers: { enabled: true },
    battles: { enabled: true },
  },
  growtopia: {
    deposit: { enabled: true },
    withdraw: { enabled: true },
  },
  mmo: {
    deposit: { enabled: false },
    withdraw: { enabled: false },
    coins: [
      { name: "RS3 Gold", id: "rs3_gold", enabled: true },
      { name: "WOW Gold", id: "wow_gold", enabled: true },
    ],
  },
  crypto: {
    deposit: { enabled: false },
    withdraw: { enabled: false },
    coins: [
      {
        name: "BTC",
        network: "Bitcoin",
        enabled: true,
        withdrawEnabled: false,
      },
      { name: "ETH", network: "ERC20", enabled: true, withdrawEnabled: false },
      { name: "TRX", network: "TRC20", enabled: true, withdrawEnabled: false },
      {
        name: "LTC",
        network: "Litecoin",
        enabled: true,
        withdrawEnabled: true,
      },
      { name: "USDT", network: "TRC20", enabled: true, withdrawEnabled: false },
    ],
  },
  limited: {
    deposit: { enabled: false },
    withdraw: { enabled: false },
    items: [{ name: "Limited Item", id: "limited_1", enabled: true }],
  },
  gift: {
    deposit: { enabled: false },
    withdraw: { enabled: false },
    cards: [{ name: "Promo Card", id: "promo", enabled: true }],
  },
  credit: {
    deposit: { enabled: false },
    withdraw: { enabled: false },
    methods: [{ name: "Visa", id: "visa", enabled: true }],
  },
};

const settingMergeDefaults = (data) => {
  const merged = { ...defaultSettings };
  if (data) {
    for (const key of Object.keys(defaultSettings)) {
      if (data[key]) {
        merged[key] = { ...defaultSettings[key], ...data[key] };

        // Ensure sub-keys that should be arrays are arrays
        for (const subKey of Object.keys(defaultSettings[key])) {
          if (
            Array.isArray(defaultSettings[key][subKey]) &&
            !Array.isArray(merged[key][subKey])
          ) {
            if (
              typeof merged[key][subKey] === "object" &&
              merged[key][subKey] !== null
            ) {
              merged[key][subKey] = Object.values(merged[key][subKey]);
            } else {
              merged[key][subKey] = defaultSettings[key][subKey];
            }
          }
        }
      }
    }
  }
  return merged;
};

const settingInitDatabase = async () => {
  try {
    settings = await Setting.findOne({})
      .select(
        "general chat games limited steam crypto gift credit growtopia mmo",
      )
      .lean();
    if (settings === undefined || settings === null) {
      settings = await Setting.create(defaultSettings);
      settings = settings.toObject();
    } else {
      settings = settingMergeDefaults(settings);
    }
    delete settings._id;
  } catch (err) {
    console.error(`Error loading settings from DB: ${err.message}`);
    console.warn("Using default settings in-memory.");
    settings = defaultSettings;
  }
};

const settingCheck = (user, value) => {
  if (
    settings.general.maintenance.enabled === true &&
    (user === null || user.rank !== "admin")
  ) {
    throw new Error("Site is in maintenance! Please try again later.");
  } else if (
    value !== undefined &&
    value.split(".").reduce((o, i) => o[i], settings) === false &&
    (user === null || user.rank !== "admin")
  ) {
    throw new Error("The action you’ve requested is currently unavailable.");
  }
};

const settingGet = () => {
  return settings;
};

const settingSetValue = async (setting, value) => {
  settings = await Setting.findOneAndUpdate(
    {},
    {
      $set: { [setting]: value },
    },
    { new: true },
  )
    .select("general chat games growtopia limited steam crypto gift credit mmo")
    .lean();

  settings = settingMergeDefaults(settings);
  delete settings._id;

  return settings;
};

module.exports = {
  settingInitDatabase,
  settingCheck,
  settingGet,
  settingSetValue,
};
