const { test, expect } = require('@playwright/test');

test('Task2', async ({ page }) => {
    // Отключаем блокировку запросов

    // Переходим на страницу и ждем её полной загрузки
    await page.goto('https://infotecs.ru/about/patents/', { waitUntil: 'domcontentloaded' });
    const filterButton = await page.locator('[data-section-id="133"]');
    
    let count = await filterButton.count();
    expect(count).toBeGreaterThan(0);
    await expect(filterButton).toBeVisible();

    let filterButtonNumber = await filterButton.textContent();
    console.log(filterButtonNumber);

    await filterButton.click();

    const blockValue = await page.locator('.b-files-page__title-count.b-files-page__title-count--js_init');
    await blockValue.waitFor({ state: 'visible' });
    count = await blockValue.count();
    console.log(count);
    await expect(blockValue).toBeVisible();

    let mainValue = await blockValue.textContent();
    console.log(mainValue);

});