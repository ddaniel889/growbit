require("dotenv").config();
const SlideSeed = require("../database/models/SlideSeed");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const crypto = require("crypto");

// Alisado con las 1000 del servicio index.js del juego
const NUMBER_OF_SLIDE_SEEDS = 1000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("MongoDB Conectado Exitosamente.");
  } catch (err) {
    console.error("Error de conexión:", err);
    process.exit(1);
  }
};

async function generateSlideSeeds() {
  console.log("Limpiando semillas antiguas de Slide...");
  await SlideSeed.deleteMany({});

  console.log(`Generando cadena de ${NUMBER_OF_SLIDE_SEEDS} semillas hibridadas...`);
  let batch = [];
  let hash = null;
  let previousHash = null;

  let start = new Date().getTime();

  for (let index = 0; index < NUMBER_OF_SLIDE_SEEDS; index++) {
    if (previousHash) {
      hash = crypto
        .createHash("sha256")
        .update(previousHash.toString())
        .digest("hex");
    } else {
      // Primera semilla ancla
      hash = crypto.randomBytes(32).toString("hex");
    }

    batch.push({
      previousHash: previousHash,
      index: index,
      seedServer: hash,
    });

    // Operación por lotes directa sin demoras artificiales en entorno local
    if (batch.length === 500) {
      await SlideSeed.insertMany(batch);
      batch = [];
    }
    previousHash = hash;
  }

  if (batch.length) {
    await SlideSeed.insertMany(batch);
  }

  let elapsed = (new Date().getTime() - start) / 1000;
  console.log(`✅ ¡Éxito! Semillas de Slide inyectadas en la BD en ${elapsed}s`);
}

(async () => {
  try {
    await connectDB();
    await generateSlideSeeds();
    process.exit(0);
  } catch (e) {  
    console.error("Error fatal ejecutando script:", e);
    process.exit(1);
  }
})();
