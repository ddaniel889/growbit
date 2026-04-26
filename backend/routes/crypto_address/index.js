const express = require('express');
const router = express.Router();
const { logger } = require("../../utils/logger");
const User = require("../../database/models/User");
const { authorizeUser } = require("../../middleware/auth");

module.exports = () => {
    router.post('/crypto_address', [authorizeUser(true)], async (req, res) => { 
  try {
        const { address } = req.body;
        logger.info(address);
        const userId = req.user._id;

        if (!address) return res.status(400).json({ error: "Address is required" });

        const user = await User.findById(userId);

        // Evitar duplicados en el array cryptoAddresses
        if (!user.cryptoAddresses.includes(address)) {
            user.cryptoAddresses.push(address);
            await user.save();
            return res.json({ message: "Address saved successfully", addresses: user.cryptoAddresses });
        }

        res.json({ message: "Address already exists" });
    } catch (error) {
        res.status(500).json({ error: "Error saving address" });
    }
    });
    return router;
};