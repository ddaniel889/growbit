const fs = require("fs").promises; // Usamos la versión de promesas
const { logger } = require("../utils/logger");

const boxes = [];

const initBoxes = async () => {
  try {
    // Leemos el archivo de forma asíncrona correctamente
    const data = await fs.readFile("./public/boxes.json", "utf8");
    const parsedData = JSON.parse(data);

    const validData = parsedData
      .map((box) => {
        if (!Array.isArray(box.items) || !box.casePrice) {
          console.warn(`Case (${box.caseName}) is invalid (missing items or price)`);
          return null;
        }

        let totalReturn = 0;
        let itemFrequencySum = 0;

        for (const item of box.items) {
          if (typeof item.itemPrice !== "number" || typeof item.frequency !== "number") {
            return null;
          }
          totalReturn += item.itemPrice * item.frequency;
          itemFrequencySum += item.frequency;
        }

        // Validación de frecuencia
        if (Math.abs(itemFrequencySum - 1) > 1e-6) {
          return null;
        }

        let rtp = totalReturn / box.casePrice;

        // Quitamos el console.log masivo. 
        // Solo mostramos si el RTP es sospechosamente alto o bajo si quieres.
        if (rtp > 0.98) {
          // console.log(`Box ${box.caseName} saltada por RTP alto: ${rtp}`);
          return null;
        }

        return box;
      })
      .filter(Boolean);

    boxes.length = 0; // Limpia el array sin perder la referencia
    boxes.push(...validData);
    
    console.log(`[BoxLoader] ${validData.length} cajas cargadas correctamente.`);
  } catch (err) {
    console.error("Error Loading boxes:", err.message);
    logger.error("Error Loading boxes:", err);
  }
};

module.exports = { initBoxes, boxes };
