const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const hpp = require("hpp");
const cors = require("cors");
const socket = require("socket.io");
const axios = require("axios");

// Load application config
// require('dotenv').config({ path: './config/config.env' });
require("dotenv").config();

// Init express app & create http server
const app = express();

const server = http.createServer(app);

// Create socket server
const io = socket(server, {
  transports: ["websocket"],
  cors: {
    origin: (
      process.env.SERVER_FRONTEND_URL || "https://growbit-ieec.onrender.com"
    )
      .split(",")
      // Trim spaces and remove trailing slash
      .map((url) => url.trim().replace(/\/$/, "")),
    credentials: true,
  },
  maxHttpBufferSize: 1e7,
});

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const formattedError = {
      status: error.response?.status,
      message:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
      type: "error",
      code: error.code,
    };

    return Promise.reject(formattedError);
  },
);

// Load database and initialize DB-dependent services after connection
(async () => {
  try {
    await require("./database")();

    // Services are initialized in background (see end of file)
    console.log("Database connected, starting services in background...");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error(
      "Proceeding without DB-dependent services (development mode).",
    );
  }

  // Enable if you are behind a reverse proxy
  app.set("trust proxy", 1);

  // Set other middleware
  app.use(express.json());
  /*app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Esto guarda el JSON exacto recibido
    }
  }));*/
  app.use(express.urlencoded({ extended: true }));
  app.use(hpp());
  app.use(
    cors({
      origin: (
        process.env.SERVER_FRONTEND_URL ||
        "https://growbit-ieec.onrender.com"
      )
        .split(",")
        // Trim spaces and remove trailing slash
        .map((url) => url.trim().replace(/\/$/, "")),
      credentials: true,
    }),
  );

  // Mount routes
  app.use("/", require("./nexus")(io));
  app.use("/api", require("./routes")(io));
  app.use("/api/public", express.static(path.join(__dirname, "public")));

  // Mount sockets
  require("./sockets")(io);

  // Set app port
  const PORT = process.env.PORT || process.env.SERVER_PORT || 5001;

  // Initialize DB-dependent services
  try {
    if (require("mongoose").connection.readyState === 1) {
      // Init page settings
      await require("./utils/setting").settingInitDatabase();

      // Init services in background
     // require("./services/slots/slot_data")
       // .initSlotData()//
        //.catch((e) => console.error("Failed to init slot data:", e.message));
     require("./services/challenges")
        .initChallenges()
        .catch((e) => console.error("Failed to init challenges:", e.message));
      require("./services/bots")
        .init(io)
        .catch((e) => console.error("Failed to init bots:", e.message));
      require("./services/boxLoader")
        .initBoxes()
        .catch((e) => console.error("Failed to init boxes:", e.message));
      require("./services/cashier/crypto/crypto")
        .preGenerateWalletAddresses()
        .catch((e) =>
          console.error("Failed to pre-generate wallet addresses:", e.message),
        );
      require("./services/cashier/growtopia/currency_service")
        .init()
        .catch((e) =>
          console.error(
            "Failed to init growtopia currency service:",
            e.message,
          ),
        );
      try {
        require("./services/cashier/fiat_exchange_rates").startFiatExchangeRatesWorker();
      } catch (e) {
        console.error("Failed to start fiat exchange worker:", e.message);
      }
    }
  } catch (e) {
    console.error("Error initializing background services:", e);
  }

  server.listen(PORT, "0.0.0.0", () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}, database url: ${process.env.DATABASE_URI}`,
    ),
  );
})();
