const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');

test('patents-desktop-3', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });

    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    try {
        await patentsPage.navigate();
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });

        await patentsPage.clickElement(patentsPage.showAllButton);
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });

        const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);
        //let patents = ['ViPNet QSS', 'Способ обнаружения аномального  трафика в сети', 'Способ передачи данных в цифровых сетях передачи данных по протоколу TCP/IP через HTTP', 'Свидетельство на товарный знак ViPNet','Свидетельство РФ на товарный знак ViPNet Quandor','Способ шифрования данных'];

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.clickElement(homePage.searchButton);

        let factCount = 0;
        console.log(`Общее количество патентов: ${patents.length}`);

        for (let index = 0; index < patents.length; index++) {
            //console.log(`Обрабатываем патент №${index + 1}`);
            const patentText = patents[index];

            try {
                await homePage.clickElement(homePage.inputSearch);
                await homePage.inputSearch.fill(patentText);
                await homePage.inputSearch.press('Enter');

                const responsePromise = page.waitForResponse(response => 
                    response.url().startsWith('https://infotecs.ru/local/api/search/ajax/getitems.php') &&
                    response.status() === 200,
                    { timeout: 20000 }
                );
            
                // Ждем ответа на запрос
                await responsePromise;

                // Получаем все элементы результатов поиска
                const searchResults = homePage.searchOutputElements;
                const count = await searchResults.count();

                let found = false; // Флаг, указывающий, был ли найден патент

                // Перебираем все элементы
                for (let i = 0; i < count; i++) {
                    try {
                        const element = await searchResults.nth(i);
                        const titleOfOutputElement = await element.locator('.b-header__search-item-title');
                        await titleOfOutputElement.waitFor({ state: 'visible'});
                        const textOfOutputElement = await titleOfOutputElement.textContent();

                        const headerPatent = await element.locator('.b-header__search-item-category');
                        await headerPatent.waitFor({ state: 'visible'});
                        const textHeaderPatent = await headerPatent.textContent();

                        if (textHeaderPatent.trim() === 'Патенты') {
                            const cleanedOutputText = textOfOutputElement.trim().replace(/\s+/g, ' ');

                            // Сравниваем названия патентов
                            if (patentText === cleanedOutputText) {
                                found = true; // Патент найден
                                factCount ++;
                                break; // Выход из цикла, если найдено соответствие
                            }
                        }

                        
                    } catch (error) {
                        console.error(`Ошибка при обработке элемента поиска: ${error}`);
                    }
                }

                if (found === false) {
                    await page.waitForSelector('.b-header__search-total-count', { state: 'visible', timeout: 5000 });
                    const showAllResults = await page.locator('.b-header__search-total-count');

                    let count = await showAllResults.count();
                    if (count > 0) {
                        const linkElement = await showAllResults.locator('a');
                        await linkElement.waitFor({ state: 'visible', timeout: 5000 });

                        await linkElement.click();

                        await page.waitForSelector('.b-search-page__search-item-content', { state: 'visible', timeout: 5000 });
                        const allResultsInNewPage = await page.locator('.b-search-page__search-item-content');

                        count = await allResultsInNewPage.count();

                        for (let index = 0; index < count; index++) {
                            const element = await allResultsInNewPage.nth(index);

                            await page.waitForSelector('.b-search-page__search-item-category', { state: 'visible', timeout: 5000 });
                            let title = await element.locator('.b-search-page__search-item-category');
                            await title.waitFor({ state: 'visible' });

                            title = await title.textContent();
                            title = title.trim();
                            if (title !== 'Патенты') {
                                continue;
                            }
            
                            const text = await element.locator('.b-search-page__search-item-title');
                            //await text.waitFor({ state: 'visible' }); не помогло
                            
                            let textFromWeb = await text.textContent();
                            
                            if (textFromWeb.trim() === patentText) {
                                found = true;
                                factCount ++;
                                //console.log(textFromWeb.trim());
                                //console.log(patentText);
                                break;
                            }
                            
                        }

                        await homePage.navigate();

                        await homePage.searchButton.waitFor({ state: 'visible' });

                        await homePage.clickElement(homePage.searchButton);
                    }
                } 
                    
                // Если после проверки всех элементов патент не был найден
                if (!found) {
                    console.error(`Ошибка: Патент "${patentText}" не найден в результатах`);
                }
            } catch (error) {
                console.error(`Ошибка при обработке патента "${patentText}": ${error}`);
            }
            
        }
        console.log('Всего найдено: ', factCount);
    } catch (error) {
        console.error(`Ошибка в основном потоке теста: ${error}`);
    } finally {
        await context.close();
    }
    
});