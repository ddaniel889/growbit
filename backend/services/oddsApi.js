const axios = require("axios");
const NodeCache = require("node-cache");

const oddsCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes
const API_BASE_URL = "https://api.odds-api.io/v3";
const API_KEY = process.env.ODDS_API_KEY || "YOUR_API_KEY";

const getSports = async () => {
  const cacheKey = "sports_list";
  const cached = oddsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_BASE_URL}/sports`, {
      params: { apiKey: API_KEY },
    });
    oddsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sports from Odds API:", error.message);
    throw error;
  }
};

const getEvents = async (sport, league = null) => {
  const cacheKey = `events_${sport}_${league || "all"}`;
  const cached = oddsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_BASE_URL}/events`, {
      params: {
        apiKey: API_KEY,
        sport: sport,
        league: league,
      },
    });
    oddsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching events for ${sport}:`, error.message);
    throw error;
  }
};

const getOdds = async (eventId, bookmakers = null) => {
  const cacheKey = `odds_${eventId}`;
  const cached = oddsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_BASE_URL}/odds`, {
      params: {
        apiKey: API_KEY,
        eventId: eventId,
        bookmakers: bookmakers,
      },
    });
    oddsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching odds for event ${eventId}:`, error.message);
    throw error;
  }
};

const getValueBets = async (bookmaker = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/value-bets`, {
      params: {
        apiKey: API_KEY,
        bookmaker: bookmaker,
        includeEventDetails: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching value bets:`, error.message);
    throw error;
  }
};

const getArbitrageBets = async (bookmakers = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/arbitrage-bets`, {
      params: {
        apiKey: API_KEY,
        bookmakers: bookmakers,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching arbitrage bets:`, error.message);
    throw error;
  }
};

module.exports = {
  getSports,
  getEvents,
  getOdds,
  getValueBets,
  getArbitrageBets,
};
