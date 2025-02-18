const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');

test('patents-desktop-2', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    
    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    await patentsPage.navigate();

    await expect(patentsPage.filterButton).toBeVisible();
    
    await patentsPage.numberInFilter.waitFor({ state: 'visible' });
    let numberInFilter = await patentsPage.numberInFilter.textContent();

    await patentsPage.clickElement(patentsPage.filterButton);
    
    await patentsPage.mainNumber.waitFor({ state: 'visible' });
    let numberInMainBlock = await patentsPage.mainNumber.textContent();

    console.log(numberInFilter.trim(), numberInMainBlock.trim());

    await context.close();
})