const express = require('express');
const router = express.Router();
require('dotenv').config();

// Import your fetchItems function here, ensure the path is correct
const { globalBrowser } = require('../app');
console.log('Imported globalBrowser in fetchItems:', globalBrowser);

const fetchItems = require('../services/fetchsubscriptionItems');
const {configDotenv} = require("dotenv"); // Adjust the path as necessary

router.get('/fetch-items', async (req, res) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    try {
        const items = await fetchItems(username, password, globalBrowser);
        res.json(items); // Send the subscription items as JSON
    } catch (error) {
        console.error('Failed to fetch subscription items:', error);
        res.status(500).send('Failed to fetch subscription items');
    }
});

module.exports = router;
