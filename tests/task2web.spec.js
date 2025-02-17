// const { test, expect } = require('@playwright/test');

// test('Task2', async ({ browser }) => {
//     const context = await browser.newContext({
//         viewport: { width: 2000, height: 1080 },
//     });
//     let count;
//     const page = await context.newPage();
//     await page.goto('https://infotecs.ru/about/patents/');

//     const filterButton = await page.locator('.b-files-page__category.active.b-files-page__category--js_init[data-section-id="133"]');
//     count = await filterButton.count();
//     console.log(count);
    
//     expect(count).toBeGreaterThan(0);
//     await expect(filterButton).toBeVisible();

//     const numberInFilter = await filterButton.locator('.b-files-page__category-count');
//     let text = await numberInFilter.textContent();
//     console.log(text);
//     await filterButton.click();
    
//     const mainNumber = await page.locator('.b-files-page__title-count.b-files-page__title-count--js_init');
//     let text2 = await mainNumber.textContent();
//     console.log(text2);

//     await context.close();
// });
