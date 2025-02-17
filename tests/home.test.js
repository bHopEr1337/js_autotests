const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const headerItems = require('../test-data/headerItems');

test('home-desktop-1', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });

    const page = await context.newPage();
    const homePage = new HomePage(page);

    await homePage.navigate();

    await expect(homePage.element).toBeVisible();
    
    await homePage.hoverHeader();

    await expect(homePage.aboutBlock).toBeVisible();

    await expect(homePage.headerElements.first()).toBeVisible();

    await homePage.verifyHeaderItems(headerItems);

    await context.close();
})