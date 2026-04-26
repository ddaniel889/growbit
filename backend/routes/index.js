const express = require("express");
const router = express.Router();

module.exports = (io) => {
  router.get("/", (req, res) => {
    res.status(200).json({ success: true });
  });

  router.use("/auth", require("./auth")());
  router.use("/callback", require("./callback")(io));
  router.use("/challenges", require("./challenges")());
  router.use("/admin", require("./admin")());
  router.use("/dice", require("./dice")(io));
  router.use("/reme", require("./reme")(io));
  router.use("/keno", require("./keno")(io));
  router.use("/growtopia", require("./growtopia")(io));
  router.use("/discord", require("./discord")(io));
  router.use("/games", require("./games")());
  router.use("/slots", require("./slots")(io));
  router.use("/notifications", require("./notifications")());
  router.use("/exchange-rates", require("./exchange_rates")());
  router.use("/banners", require("./banners")());
  router.use("/mmo_cashier", require("./mmo_cashier")());
  router.use("/payment", require("./payment")());
  router.use("/webhook", require("./webhook")(io));
  router.use("/full-currencies", require("./currency")());
  router.use("/payout", require("./payout")());
  router.use("/custody_balance", require("./custody_balance")());
  router.use("/payout_fee", require("./payout_fee")());

  return router;
};
