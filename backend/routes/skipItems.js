const express = require('express');
const router = express.Router();
require('dotenv').config();

const { globalBrowser } = require('../app');
console.log('Imported globalBrowser in skipItems:', globalBrowser);

const skipItems = require('../services/skipsubscriptionItems');
const {configDotenv} = require("dotenv"); // Adjust the path as necessary

router.post('/skip-items', async (req, res) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const itemIds = req.body.items; // Extract item IDs from request body

    try {
        const results = await skipItems(itemIds, username, password, globalBrowser);
        res.json(results); // Send the results back to the client
    } catch (error) {
        console.error('Failed to skip items:', error);
        res.status(500).send('Failed to skip items');
    }
});

module.exports = router;