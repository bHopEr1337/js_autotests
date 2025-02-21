class SearchUtils {
    constructor(page) {
        this.page = page;
    }

    async searchPatent(patentText, homePage) {
        let found = false;
        let additionalInfo = '';
        const maxAttempts = 2;
        let attempt = 0;
        let searchCompleted = false;

        while (attempt < maxAttempts && !searchCompleted) {
            try {
                await homePage.clickElement(homePage.inputSearch);
                await homePage.inputSearch.fill(patentText);
                await homePage.inputSearch.press('Enter');

                const responsePromise = this.page.waitForResponse(response =>
                    response.url().startsWith('https://infotecs.ru/local/api/search/ajax/getitems.php') &&
                    response.status() === 200,
                    { timeout: 5000 }
                );

                await responsePromise;
                searchCompleted = true;
            } catch (error) {
                attempt++;
                if (attempt < maxAttempts) {
                    console.warn(`Попытка ${attempt} не удалась. Повторная попытка...`);
                    additionalInfo += `Попытка ${attempt} не удалась: ${error.message}\n`;
                } else {
                    console.error(`Превышен лимит попыток (${maxAttempts})   Патент "${patentText}" не найден.`);
                    additionalInfo += `Ошибка при выполнении поиска после ${maxAttempts} попыток: ${error.message}\n`;
                }
            }
        }

        if (!searchCompleted) {
            throw new Error(`Не удалось выполнить поиск для патента "${patentText}" после ${maxAttempts} попыток.`);
        }

        return { found, additionalInfo };
    }


    async checkSearchResults(patentText, homePage) {
        const searchResults = homePage.searchOutputElements;
        const count = await searchResults.count();
        let found = false;

        for (let i = 0; i < count; i++) {
            try {
                const element = await searchResults.nth(i);
                const titleOfOutputElement = await element.locator('.b-header__search-item-title');
                await titleOfOutputElement.waitFor({ state: 'visible' });
                const textOfOutputElement = await titleOfOutputElement.textContent();
                const headerPatent = await element.locator('.b-header__search-item-category');
                await headerPatent.waitFor({ state: 'visible' });
                const textHeaderPatent = await headerPatent.textContent();

                if (textHeaderPatent.trim() === 'Патенты' && patentText === textOfOutputElement.trim().replace(/\s+/g, ' ')) {
                    found = true;
                    break;
                }
            } catch (error) {
                console.error(`Ошибка при обработке элемента поиска: ${error.message}`);
            }
        }

        return found;
    }

    
    async checkAllResultsPage(patentText, page, homePage) {
        let found = false;
        await page.waitForSelector('.b-header__search-total-count', { state: 'visible', timeout: 10000 });
        const showAllResults = await page.locator('.b-header__search-total-count');
        const count = await showAllResults.count();

        if (count > 0) {
            const linkElement = await showAllResults.locator('a');
            await linkElement.waitFor({ state: 'visible', timeout: 5000 });
            await linkElement.click();
            await page.waitForSelector('.b-search-page__search-item-content', { state: 'visible', timeout: 10000 });
            const allResultsInNewPage = await page.locator('.b-search-page__search-item-content');
            const newCount = await allResultsInNewPage.count();

            for (let index = 0; index < newCount; index++) {
                const element = await allResultsInNewPage.nth(index);
                await page.waitForSelector('.b-search-page__search-item-category', { state: 'visible', timeout: 10000 });
                let title = await element.locator('.b-search-page__search-item-category');
                await title.waitFor({ state: 'visible' });
                title = await title.textContent();
                title = title.trim();

                if (title !== 'Патенты') continue;

                const text = await element.locator('.b-search-page__search-item-title');
                let textFromWeb = await text.textContent();

                if (textFromWeb.trim() === patentText) {
                    found = true;
                    break;
                }
            }

            await homePage.navigate();
            await homePage.searchButton.waitFor({ state: 'visible' });
            await homePage.clickElement(homePage.searchButton);
        }

        return found;
    }
}

module.exports = SearchUtils;