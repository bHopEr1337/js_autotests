const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');
const SearchUtils = require('../utils/searchUtils');
const generateHtmlReport = require('../reportGenerator');

test('test 3', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });
    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);
    const homePage = new HomePage(page);
    const searchUtils = new SearchUtils(page);

    const testResults = [];
    let factCount = 0;

    try {
        // Переход на страницу патентов и загрузка данных
        await patentsPage.navigate();
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });
        await patentsPage.clickElement(patentsPage.showAllButton);
        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });

        // Получение списка патентов
        const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);
        //const patents = [''];

        // Переход на главную страницу и открытие поиска
        await homePage.navigate();
        await homePage.clickElement(homePage.searchButton);

        // Поиск каждого патента
        for (let index = 0; index < patents.length; index++) {
            const patentText = patents[index];
            let found = false;
            let additionalInfo = '';

            try {
                // Поиск патента
                await searchUtils.searchPatent(patentText, homePage);
                found = await searchUtils.checkSearchResults(patentText, homePage);

                // Если патент не найден, проверяем на странице всех результатов
                if (!found) {
                    found = await searchUtils.checkAllResultsPage(patentText, page, homePage);
                }

                if (found) factCount++;
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
                additionalInfo: additionalInfo.trim(),
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