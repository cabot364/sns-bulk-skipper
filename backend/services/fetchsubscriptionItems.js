const puppeteer = require('puppeteer');
const loginToAmazon = require('./amazonLogin');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchSubscriptionItems(username, password, browser) {
    // Use the loginToAmazon function to log in and get the browser and page instances
    const { page, alreadyLoggedIn } = await loginToAmazon(username, password, browser);

    if (!page) {
        // If login failed (indicated by not receiving a page object), return an empty array or handle as appropriate
        console.error('Login failed. Cannot fetch subscription items.');
        return [];
    }

    await page.goto('https://www.amazon.com/gp/subscribe-and-save/manager/viewsubscriptions?ref_=nav_AccountFlyout_sns');

    while (true) {
    // Check if the "See more items" button is present
    const buttonSelector = '.delivery-pagination-trigger';
    const isButtonVisible = await page.evaluate(selector => {
        const btn = document.querySelector(selector);
        if (!btn) return false;
        const style = window.getComputedStyle(btn);
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }, buttonSelector);

    if (!isButtonVisible) {
        break; // Exit the loop if the button is not visible or does not exist
    }

    try {
        // Attempt to click the button
        await page.click(buttonSelector);
        // Wait for the page to load more items
        await sleep(1000);
    } catch (error) {
        // If an error occurs during the click, assume no more items can be loaded and exit the loop
        console.error('"See More Items" Button is gone, all items are visible."', error.message);
        break;
    }
}

    const subscriptionItems = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('[id^="subscription-card-"]').forEach(card => {
            const image = card.querySelector('img.subscription-product-image')?.dataset.src;
            const title = card.querySelector('.subscription-product-title .a-truncate-cut')?.innerText;
            const price = card.querySelector('.subscription-price')?.innerText;
            const status = card.querySelector('.delivery-shipping-status')?.innerText;
            const subID = card.dataset.subscriptionId;
            items.push({ image, title, price, status, subID });
        });
        return items;
    });

    await page.close();
    return subscriptionItems;
}

module.exports = fetchSubscriptionItems;