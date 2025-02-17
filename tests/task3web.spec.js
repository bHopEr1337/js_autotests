const { test, expect } = require('@playwright/test');

test('Task3', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    let count;
    const page = await context.newPage();
    await page.goto('https://infotecs.ru/about/patents/', { waitUntil: 'domcontentloaded' });


    const showAllButton = await page.locator('.b-files-page__show-all.c-green-btn');
    count = await showAllButton.count();
    // console.log(count);
    await showAllButton.click;

    const allPatents = await page.locator('.b-file-item__content-title');
    // ТУТ НАДО ДОБАВИТЬ ПРОВЕРКУ ЧТО ВСЕ ОБЪЕКТЫ ВИДНЫ.
    count = await allPatents.count();
    // console.log(count);

    let arrayOfNames = [];

    for (let index = 0; index < count; index++) {
        const element = allPatents.nth(index);
        let text = await element.textContent();
        arrayOfNames.push(text);
    }

    console.log(arrayOfNames.length);

    await page.goto('https://infotecs.ru', { waitUntil: 'load' });


    const searchButton = page.locator('.b-header__menu-icon.b-header__menu-icon--loupe');

        await searchButton.click();
    
        let inputSearch = page.locator('.b-header__search-field');
    
        let searchText = arrayOfNames[0];
        await inputSearch.fill(searchText);
        
        await inputSearch.press('Enter');
    
        // Поиск элемента после вставки в поиск
        await page.waitForSelector('.b-header__search-item-content', { state: 'attached' })
        const searchOutputElements = await page.locator('.b-header__search-item-content');
        // ТУТ НАДО ДОБАВИТЬ ОЖИДАНИЕ,ТАК КАК ТОЛЬКО В ДЕБАГЕ ВИДИТ
        count = await searchOutputElements.count();
        console.log(count)
    
        const titleOfOutputElement = await searchOutputElements.locator('.b-header__search-item-category');
        console.log(await titleOfOutputElement.textContent());
    
        const textOfOutputElement = await searchOutputElements.locator('.b-header__search-item-title');
        console.log(await textOfOutputElement.textContent());
    
        // if (typeof searchText !== 'string' || typeof textOfOutputElement !== 'string') {
        //     throw new Error("Патент не найден");
        // }
        console.log(textOfOutputElement);



    for (let index = 1; index < arrayOfNames.length; index++) {
        
        const inputSearch = page.locator('.b-header__search-field');
        await inputSearch.click();
    
        const searchText = arrayOfNames[index];
        await inputSearch.fill(searchText);
    
        await inputSearch.press('Enter');
    
    
        // Поиск элемента после вставки в поиск
        await page.waitForSelector('.b-header__search-item-content', { state: 'attached' })
        let searchOutputElements = await page.locator('.b-header__search-item-content');
        // ТУТ НАДО ДОБАВИТЬ ОЖИДАНИЕ,ТАК КАК ТОЛЬКО В ДЕБАГЕ ВИДИТ
        count = await searchOutputElements.count();
        console.log(count)

        if (count > 1) {
            searchOutputElements = await searchOutputElements.nth(0);
        }
    
        const titleOfOutputElement = await searchOutputElements.locator('.b-header__search-item-category');
        console.log(await titleOfOutputElement.textContent());
    
        const textOfOutputElement = await searchOutputElements.locator('.b-header__search-item-title');
        console.log(await textOfOutputElement.textContent());
    
        // if (typeof searchText !== 'string' || typeof textOfOutputElement !== 'string') {
        //     throw new Error("Патент не найден");
        // }
        console.log(index);
        
    }
    await context.close();
});
