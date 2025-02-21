const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');
const generateHtmlReport = require('../reportGenerator'); // Импорт модуля для генерации отчётов

test('test 3', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    // Массив для хранения результатов тестов
    const testResults = [];
    try {
        await patentsPage.navigate();
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });
        await patentsPage.clickElement(patentsPage.showAllButton);
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });

        //const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);
        const patents = ['Свидетельство о государственной регистрации ViPNet SIES MC', 'Свидетельство о государственной регистрации ViPNet TLS Gateway'];
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.clickElement(homePage.searchButton);

        let factCount = 0;
        console.log(`Общее количество патентов: ${patents.length}`);

        for (let index = 0; index < patents.length; index++) {
            const patentText = patents[index];
            let found = false;
            let additionalInfo = ''; // Для хранения дополнительной информации об ошибках

            try {
                // Цикл для повторных попыток выполнения блока
                const maxAttempts = 2; // Количество попыток
                let attempt = 0;
                let searchCompleted = false;

                while (attempt < maxAttempts && !searchCompleted) {
                    try {
                        await homePage.clickElement(homePage.inputSearch);
                        await homePage.inputSearch.fill(patentText);
                        await homePage.inputSearch.press('Enter');

                        const responsePromise = page.waitForResponse(response => 
                            response.url().startsWith('https://infotecs.ru/local/api/search/ajax/getitems.php') &&
                            response.status() === 200,
                            { timeout: 5000 }
                        );

                        await responsePromise;
                        searchCompleted = true; // Успешное выполнение блока
                    } catch (error) {
                        attempt++;
                        if (attempt < maxAttempts) {
                            console.warn(`Попытка ${attempt} не удалась. Повторная попытка...`);
                            additionalInfo += `Попытка ${attempt} не удалась: ${error.message}\n`;
                        } else {
                            console.error(`Все попытки (${maxAttempts}) выполнения поиска для патента "${patentText}" не увенчались успехом.`);
                            additionalInfo += `Ошибка при выполнении поиска после ${maxAttempts} попыток: ${error.message}\n`;
                        }
                    }
                }

                if (!searchCompleted) {
                    throw new Error(`Не удалось выполнить поиск для патента "${patentText}" после ${maxAttempts} попыток.`);
                }

                const searchResults = homePage.searchOutputElements;
                const count = await searchResults.count();

                for (let i = 0; i < count; i++) {
                    try {
                        const element = await searchResults.nth(i);
                        const titleOfOutputElement = await element.locator('.b-header__search-item-title');
                        await titleOfOutputElement.waitFor({ state: 'visible' });
                        const textOfOutputElement = await titleOfOutputElement.textContent();
                        const headerPatent = await element.locator('.b-header__search-item-category');
                        await headerPatent.waitFor({ state: 'visible' });
                        const textHeaderPatent = await headerPatent.textContent();

                        if (textHeaderPatent.trim() === 'Патенты') {
                            const cleanedOutputText = textOfOutputElement.trim().replace(/\s+/g, ' ');
                            if (patentText === cleanedOutputText) {
                                found = true;
                                factCount++;
                                break;
                            }
                        }
                    } catch (error) {
                        additionalInfo += `Ошибка при обработке элемента поиска: ${error.message}\n`;
                        console.error(`Ошибка при обработке элемента поиска: ${error.message}`);
                    }
                }

                if (!found) {
                    await page.waitForSelector('.b-header__search-total-count', { state: 'visible', timeout: 10000 });
                    const showAllResults = await page.locator('.b-header__search-total-count');
                    let count = await showAllResults.count();

                    if (count > 0) {
                        const linkElement = await showAllResults.locator('a');
                        await linkElement.waitFor({ state: 'visible', timeout: 5000 });
                        await linkElement.click();
                        await page.waitForSelector('.b-search-page__search-item-content', { state: 'visible', timeout: 10000 });
                        const allResultsInNewPage = await page.locator('.b-search-page__search-item-content');
                        count = await allResultsInNewPage.count();

                        for (let index = 0; index < count; index++) {
                            const element = await allResultsInNewPage.nth(index);
                            await page.waitForSelector('.b-search-page__search-item-category', { state: 'visible', timeout: 10000 });
                            let title = await element.locator('.b-search-page__search-item-category');
                            await title.waitFor({ state: 'visible' });
                            title = await title.textContent();
                            title = title.trim();

                            if (title !== 'Патенты') {
                                continue;
                            }

                            const text = await element.locator('.b-search-page__search-item-title');
                            let textFromWeb = await text.textContent();

                            if (textFromWeb.trim() === patentText) {
                                found = true;
                                factCount++;
                                break;
                            }
                        }

                        await homePage.navigate();
                        await homePage.searchButton.waitFor({ state: 'visible' });
                        await homePage.clickElement(homePage.searchButton);
                    }
                }

                if (!found) {
                    additionalInfo += `Ошибка: Патент "${patentText}" не найден в результатах\n`;
                    console.error(`Ошибка: Патент "${patentText}" не найден в результатах`);
                }
            } catch (error) {
                additionalInfo += `Ошибка при обработке патента "${patentText}": ${error.message}\n`;
                console.error(`Ошибка при обработке патента "${patentText}": ${error.message}`);
            }

            // Добавляем результат для каждого патента
            testResults.push({
                testName: 'test 3',
                checkName: 'Поиск патента',
                inputData: patentText,
                status: found ? 'Успешно' : 'Ошибка',
                additionalInfo: additionalInfo.trim(), // Добавляем дополнительные сведения
            });
        }

        console.log('Всего патентов найдено: ', factCount);
    } catch (error) {
        console.error(`Ошибка в основном потоке теста: ${error.message}`);
        testResults.push({
            testName: 'test 3',
            checkName: 'Основной поток теста',
            inputData: 'N/A',
            status: 'Ошибка',
            additionalInfo: `Ошибка в основном потоке теста: ${error.message}`,
        });
    } finally {
        await context.close();
    }

    // Генерация HTML-отчёта
    generateHtmlReport(testResults, 'test 3', 'test-results-patents-desktop-3.html');
});