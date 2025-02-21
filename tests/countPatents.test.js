const { test, expect } = require('@playwright/test');
const fs = require('fs');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');

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

        const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);
        //const patents = ['Свидетельство о государственной регистрации ViPNet SIES MC', 'Свидетельство о государственной регистрации ViPNet TLS Gateway']

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.clickElement(homePage.searchButton);

        let factCount = 0;
        console.log(`Общее количество патентов: ${patents.length}`);

        for (let index = 0; index < patents.length; index++) {
            const patentText = patents[index];
            let found = false;

            try {
                await homePage.clickElement(homePage.inputSearch);
                await homePage.inputSearch.fill(patentText);
                await homePage.inputSearch.press('Enter');

                const responsePromise = page.waitForResponse(response => 
                    response.url().startsWith('https://infotecs.ru/local/api/search/ajax/getitems.php') &&
                    response.status() === 200,
                    { timeout: 20000 }
                );
            
                await responsePromise;

                const searchResults = homePage.searchOutputElements;
                const count = await searchResults.count();

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

                            if (patentText === cleanedOutputText) {
                                found = true;
                                factCount++;
                                break;
                            }
                        }
                    } catch (error) {
                        console.error(`Ошибка при обработке элемента поиска: ${error}`);
                    }
                }

                if (!found) {
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
                    console.error(`Ошибка: Патент "${patentText}" не найден в результатах`);
                }
            } catch (error) {
                console.error(`Ошибка при обработке патента "${patentText}": ${error}`);
            }

            // Добавляем результат для каждого патента
            testResults.push({
                testName: 'test 3',
                checkName: 'Поиск патента',
                inputData: patentText,
                
                status: found ? 'Успешно' : 'Ошибка',
                
            });
        }

        console.log('Всего найдено: ', factCount);
    } catch (error) {
        console.error(`Ошибка в основном потоке теста: ${error}`);
    } finally {
        await context.close();
    }

    // Генерация HTML-отчёта
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Результаты теста patents-desktop-3</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .status-pass {
                    color: green;
                    font-weight: bold;
                }
                .status-fail {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>test 3</h1>
            <table>
                <thead>
                    <tr>
                        <th>Название теста</th>
                        <th>Название проверки</th>
                        <th>Входные данные</th>
                        <th>Статус</th>                        
                    </tr>
                </thead>
                <tbody>
                    ${testResults.map(result => `
                        <tr>
                            <td>${result.testName}</td>
                            <td>${result.checkName}</td>
                            <td>${result.inputData}</td>
                            <td class="status-${result.status === 'Успешно' ? 'pass' : 'fail'}">${result.status}</td>
                            
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Сохранение HTML-файла
    fs.writeFileSync('test-results-patents-desktop-3.html', htmlContent);
});