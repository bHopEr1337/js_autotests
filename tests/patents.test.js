const { test, expect } = require('@playwright/test');
const fs = require('fs');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');

test('test 2', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });

    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    // Массив для хранения результатов тестов
    const testResults = [];

    try {
        await patentsPage.navigate();

        // Проверяем видимость кнопки фильтра
        await expect(patentsPage.filterButton).toBeVisible();

        // Получаем число из фильтра
        await patentsPage.numberInFilter.waitFor({ state: 'visible' });
        const numberInFilter = await patentsPage.numberInFilter.textContent();
        const filterNumber = parseInt(numberInFilter.trim(), 10);

        // Кликаем на кнопку фильтра
        await patentsPage.clickElement(patentsPage.filterButton);

        // Получаем число из основного блока
        await patentsPage.mainNumber.waitFor({ state: 'visible' });
        const numberInMainBlock = await patentsPage.mainNumber.textContent();
        const mainNumber = parseInt(numberInMainBlock.trim(), 10);

        console.log(`Число в фильтре: ${filterNumber}, Число в основном блоке: ${mainNumber}`);

        // Сравниваем числа
        const isMatch = filterNumber === mainNumber;

        // Добавляем результат теста в массив
        testResults.push({
            testName: 'test 2',
            checkName: 'Сравнение количества в двух блоках',
            inputData: `Число в фильтре: ${filterNumber}, Число в основном блоке: ${mainNumber}`,
            status: isMatch ? 'Успешно' : 'Ошибка',
            filterNumber: filterNumber,
            mainNumber: mainNumber
        });
    } catch (error) {
        console.error(`Ошибка в тесте: ${error}`);
        testResults.push({
            testName: 'patents-desktop-2',
            checkName: 'Сравнение количества в двух блоках',
            inputData: 'N/A',
            status: 'Ошибка',
            filterNumber: 'N/A',
            mainNumber: 'N/A'
        });
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
            <title>Результаты теста patents-desktop-2</title>
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
            <h1>Результаты теста test 2</h1>
            <table>
                <thead>
                    <tr>
                        <th>Название теста</th>
                        <th>Название проверки</th>
                        <th>Входные данные</th>
                        <th>Статус</th>
                        <th>Число в фильтре</th>
                        <th>Число в основном блоке</th>
                    </tr>
                </thead>
                <tbody>
                    ${testResults.map(result => `
                        <tr>
                            <td>${result.testName}</td>
                            <td>${result.checkName}</td>
                            <td>${result.inputData}</td>
                            <td class="status-${result.status === 'Успешно' ? 'pass' : 'fail'}">${result.status}</td>
                            <td>${result.filterNumber}</td>
                            <td>${result.mainNumber}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Сохранение HTML-файла
    fs.writeFileSync('test-results-patents-desktop-2.html', htmlContent);
});