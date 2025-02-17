const { test, expect } = require('@playwright/test');
const headerItems = require('../test-data/headerItems');

test('Task1', async ({ browser }) => {
    //Размеры страницы
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    const page = await context.newPage();

    //Переход на страницу
    await page.goto('https://infotecs.ru/');

    //Поиск кнопки в шапке "О компании"
    const element = page.locator('.b-header__menu-item[data-link="/about/"]');
    await expect(element).toBeVisible();

    //Наведение на шапку, чтоб появилась расширенная шапка
    await element.hover();

    //Поиск расширенного меню (возможно после наведения на шапку)
    const aboutBlock = page.locator('.b-header__menu-content.b-header__menu-content--js_init.b-header__menu-content--active');
    await expect(aboutBlock).toBeVisible();

    //Поиск ссылок в расширенном меню
    const headerElements = aboutBlock.locator('.b-header__menu-section-elem');

    for (let index = 0; index < 9; index++) {
        const headerElement = headerElements.nth(index);

        expect(headerElement).toBeTruthy();
        expect(headerElement).toBeVisible();
        
        const text = await headerElement.textContent();
        if (text.trim() !== headerItems[index].trim()) {
            throw new Error("Text does not match")
        }
    }
    await context.close();
});
