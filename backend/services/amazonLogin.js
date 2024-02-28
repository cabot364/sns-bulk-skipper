const puppeteer = require('puppeteer');

async function loginToAmazon(username, password, browser) {
    if (!browser) {
        throw new Error("Global browser has not been initialized.");
    }

    let page = await browser.newPage();

    try {
        // Navigate to Amazon's homepage to check login status
        await page.goto('https://www.amazon.com');

        // Attempt to hover over the account list to reveal the dropdown menu
        await page.hover('#nav-link-accountList', { delay: 1000 });

        // Check if the sign-out option is visible, indicating that we're logged in
        const signOutVisible = await page.waitForSelector('#nav-item-signout', {visible: true, timeout: 5000}).then(() => true).catch(() => false);

        if (signOutVisible) {
            console.log('Already logged in.');
            return { page, alreadyLoggedIn: true };
        }

        // If not already logged in, perform the login procedure
        await page.goto('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');
        // Your login steps here
        await page.type('#ap_email', username, { delay: 30 });
        await page.click('#continue');
        await page.waitForSelector('#ap_password', { visible: true });
        await page.type('#ap_password', password, { delay: 30 });
        await page.click('#signInSubmit');
        await page.waitForNavigation();

        // Verify login was successful by locating the signout button again
        await page.hover('#nav-link-accountList', { delay: 1000 });
        const postLoginSignOutVisible = await page.waitForSelector('#nav-item-signout', {visible: true, timeout: 5000}).then(() => true).catch(() => false);

        if (!postLoginSignOutVisible) {
            throw new Error('Login failed: Sign-out option not found after login attempt.');
        }

        return { page, alreadyLoggedIn: false };
    } catch (error) {
        console.error('An error occurred during login:', error);
        await page.close(); // Close the page in case of an error
        throw error; // Rethrow the error to be handled by the caller
    }
}

module.exports = loginToAmazon;