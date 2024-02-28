const puppeteer = require('puppeteer');
const loginToAmazon = require('./amazonLogin');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function skipsubscriptionItems(itemIds, username, password, globalBrowser) {
    const { page } = await loginToAmazon(username, password, globalBrowser); // Use your existing login function

    const results = [];

    for (let itemId of itemIds) {
        await page.goto('https://www.amazon.com/gp/subscribe-and-save/manager/viewsubscriptions?ref_=nav_AccountFlyout_sns');

        // Check if the "See more items" button is present and click it until it's no longer visible
        while (true) {
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

        try {
            // Find and click the skip button for the item
            const selector = `[data-subscription-id="${itemId}"] .skip-subscription-button input`;
            await page.click(selector);

            // Handle the confirmation popup
            const confirmSelector = '.skip-approve-button input';
            await page.waitForSelector(confirmSelector, { visible: true });
            await page.click(confirmSelector);

            results.push({ itemId, status: 'Skipped' });
        } catch (error) {
            console.error(`Failed to skip item ${itemId}:`, error);
            results.push({ itemId, status: 'Failed', error: error.message });
        }
    }

    await page.close();
    return results;
}

module.exports = skipsubscriptionItems;