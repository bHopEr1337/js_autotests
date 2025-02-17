const { test, expect } = require('@playwright/test');

test('Task1', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 }, // Задайте нужные размеры
    });
    
    const page = await context.newPage();
    await page.goto('https://infotecs.ru/');

    const element = page.locator('.b-header__menu-item[data-link="/about/"]');
    let count = await element.count();
    if (count === 0) {
        throw new Error('Элемент не найден');
    }

    await element.hover();
    await page.waitForTimeout(2000);

    const aboutBlock = page.locator('.b-header__menu-content.b-header__menu-content--js_init.b-header__menu-content--active');
    count = await aboutBlock.count();
    if (count === 0) {
        throw new Error('Элемент не найден');
    }

    const menuElements = aboutBlock.locator('.b-header__menu-section-elem');
    count = await menuElements.count();
    if (count === 0) {
        throw new Error('Элемент не найден');
    }
    console.log(count);

    const infotecsItems = [
        "Компания «ИнфоТеКС»",
        "Экосистема ИнфоТеКС",
        "Лицензии",
        "Академия",
        "Патенты",
        "Награды",
        "Реквизиты",
        "Вакансии",
        "Контакты"
    ];
    
    // Выводим массив в консоль
    console.log(infotecsItems);
    

    for (let index = 0; index < 9; index++) {
        const element = menuElements.nth(index);

        expect(element).toBeTruthy();
        expect(element).toBeVisible();
        
        const text = await element.textContent();
        if (text.trim() !== infotecsItems[index]) {
            throw new Error("Text does not match")
        }

        console.log(text);
    }


    await context.close();
});
