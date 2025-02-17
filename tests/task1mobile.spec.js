const { test, expect } = require('@playwright/test');

test('Task1', async ({ page }) => {
    await page.goto('https://infotecs.ru/');
    const menuButton = page.locator('.b-header__menu-hamburger.b-header__menu-hamburger--js_init');

    let count = await menuButton.count();
    expect(count).toBeGreaterThan(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const aboutCompanyLink = page.locator('.b-header__mobile-menu-item.b-header__mobile-menu-item--js_init[data-link="/about/"]');
    count = await aboutCompanyLink.count();
    expect(count).toBeGreaterThan(0);
    await expect(aboutCompanyLink).toBeVisible();
    await aboutCompanyLink.click();

    const aboutCompanySubContainer = page.locator('.b-header__mobile-menu-sections-wrapper.b-header__mobile-menu-sections-wrapper--active');
    count = await aboutCompanySubContainer.count();
    expect(count).toBeGreaterThan(0);

    const aboutCompanySubLinks = aboutCompanySubContainer.locator('.b-header__mobile-menu-section.b-header__mobile-menu-section--js_init')
    count = await aboutCompanySubLinks.count();
    expect(count).toBeGreaterThan(0);
    
    const aboutCompanySubLink = await aboutCompanySubLinks.nth(0);
    await expect(aboutCompanySubLink).toBeVisible();
    await aboutCompanySubLink.click();

    let links = aboutCompanySubLink.locator('.b-header__mobile-menu-link');
    count = await links.count();
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

    for (let index = 0; index < count; index++) {
        const element = links.nth(index);

        expect(element).toBeTruthy();
        expect(element).toBeVisible();
        
        const text = await element.textContent();
        if (text.trim() !== infotecsItems[index]) {
            throw new Error("Text does not match")
        }

        console.log(text);
    }
});
