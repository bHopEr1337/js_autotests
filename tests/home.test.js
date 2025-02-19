const { test, expect } = require('@playwright/test');
const fs = require('fs');
const HomePage = require('../pages/HomePage');
const headerItems = require('../test-data/headerItems');

test('home-desktop-1', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 2000, height: 1080 },
    });

    const page = await context.newPage();
    const homePage = new HomePage(page);

    // Массив для хранения результатов тестов
    const testResults = [];

    try {
        await homePage.navigate();
        await expect(homePage.element).toBeVisible();
        await homePage.hoverHeader();
        await expect(homePage.aboutBlock).toBeVisible();
        await expect(homePage.headerElements.first()).toBeVisible();
        await homePage.verifyHeaderItems(headerItems);

        // Если всё прошло успешно, добавляем результат
        testResults.push({
            testName: 'home-desktop-1',
            checkName: 'Проверка наличия 9 элементов из массива на странице',
            inputData: JSON.stringify(headerItems),
            executionTime: '1.2s', // Здесь можно добавить реальное время выполнения
            status: 'Успешно'
        });
    } catch (error) {
        // Если тест упал, добавляем результат с ошибкой
        testResults.push({
            testName: 'home-desktop-1',
            checkName: 'Проверка наличия 9 элементов из массива на странице',
            inputData: JSON.stringify(headerItems),
            executionTime: '1.2s',
            status: 'Ошибка'
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
            <title>Результаты тестов</title>
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
            <h1>Результаты тестов</h1>
            <table>
                <thead>
                    <tr>
                        <th>Название теста</th>
                        <th>Название проверки</th>
                        <th>Входные данные</th>
                        <th>Время выполнения</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${testResults.map(result => `
                        <tr>
                            <td>${result.testName}</td>
                            <td>${result.checkName}</td>
                            <td>${result.inputData}</td>
                            <td>${result.executionTime}</td>
                            <td class="status-${result.status === 'Успешно' ? 'pass' : 'fail'}">${result.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Сохранение HTML-файла
    fs.writeFileSync('test-results-patents-desktop-1.html', htmlContent);
});