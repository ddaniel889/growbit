const express = require("express");
const router = express.Router();
const oddsApi = require("../services/oddsApi");

module.exports = () => {
  // Get all sports
  router.get("/sports", async (req, res) => {
    try {
      const sports = await oddsApi.getSports();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sports" });
    }
  });

  // Get events for a sport
  router.get("/events/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      const { league } = req.query;
      const events = await oddsApi.getEvents(sport, league);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get odds for an event
  router.get("/odds/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { bookmakers } = req.query;
      const odds = await oddsApi.getOdds(eventId, bookmakers);
      res.json(odds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch odds" });
    }
  });

  // Get value bets
  router.get("/value-bets", async (req, res) => {
    try {
      const { bookmaker } = req.query;
      const valueBets = await oddsApi.getValueBets(bookmaker);
      res.json(valueBets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch value bets" });
    }
  });

  // Get arbitrage bets
  router.get("/arbitrage-bets", async (req, res) => {
    try {
      const { bookmakers } = req.query;
      const arbitrageBets = await oddsApi.getArbitrageBets(bookmakers);
      res.json(arbitrageBets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch arbitrage bets" });
    }
  });

  return router;
};
