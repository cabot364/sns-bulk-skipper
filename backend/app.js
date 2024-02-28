const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const puppeteer = require('puppeteer');

app.use(cors());

let globalBrowser;

async function initializeGlobalBrowser() {
    globalBrowser = await puppeteer.launch({ headless: true });
}

initializeGlobalBrowser().then(() => {
    console.log('Global browser initialized');

    // Export globalBrowser for use in other files
    module.exports = { globalBrowser };

    // Middleware to parse JSON bodies
    app.use(express.json());

    const fetchItems = require('./routes/fetchItems');

    app.use(fetchItems);

    const skipItems = require('./routes/skipItems');

    app.use(skipItems);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}).catch(err => {
    console.error('Failed to initialize global browser:', err);
});

process.on('SIGINT', async () => {
    if (globalBrowser) await globalBrowser.close();
    process.exit();
});

