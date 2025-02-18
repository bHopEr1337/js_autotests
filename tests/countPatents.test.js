const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');

test('patents-desktop-3', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    
    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    await patentsPage.navigate();

    await patentsPage.clickElement(patentsPage.showAllButton);

    await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });
    const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);

    const homePage = new HomePage(page);

    await homePage.navigate();

    await homePage.clickElement(homePage.searchButton);
    console.log(patents.length);

    for (let index = 0; index < patents.length; index++) {
        console.log(index);
        const patentText = patents[index];

        await homePage.clickElement(homePage.inputSearch);
        await homePage.inputSearch.fill(patentText);
        await homePage.inputSearch.press('Enter');

        //await page.waitForSelector('.b-header__search-item-content', { state: 'attached' });
        await page.waitForTimeout(1000);
        let count = await homePage.searchOutputElements.count();

        let element;
        if (count > 1) {
            element = await homePage.searchOutputElements.nth(0);
        } else {
            element = homePage.searchOutputElements;
        }

        const titleOfOutputElement = await element.locator('.b-header__search-item-category');
        //console.log(await titleOfOutputElement.textContent());
    
        const textOfOutputElement = await element.locator('.b-header__search-item-title');
        //console.log(await textOfOutputElement.textContent());

        let text1 = patentText.trim();
        let pass = await textOfOutputElement.textContent();
        let text2 = pass.trim();

        text1 = text1.replace(/\s+/g, ' ').trim();
        text2 = text2.replace(/\s+/g, ' ').trim();

        console.log(text1);
        console.log(text2);

        if (text1 !== text2) {
                throw new Error("Патент не найден");
            }
    }
   
    await context.close();
})