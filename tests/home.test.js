const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const headerItems = require('../test-data/headerItems');
const generateHtmlReport = require('../reportGenerator'); // Импорт модуля для генерации отчётов

test('test 1', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    const homePage = new HomePage(page);

    // Массив для хранения результатов тестов
    const testResults = [];
    let additionalInfo = ''; // Для хранения дополнительной информации об ошибках
    let testPassed = true; // Флаг для отслеживания успешности теста

    try {
        await homePage.navigate();
        await expect(homePage.element).toBeVisible();
        await homePage.hoverHeader();
        await expect(homePage.aboutBlock).toBeVisible();
        await expect(homePage.headerElements.first()).toBeVisible();

        // Проверяем элементы в шапке с использованием метода verifyHeaderItems
        try {
            await homePage.verifyHeaderItems(headerItems);
        } catch (error) {
            additionalInfo += `Ошибка при проверке элементов шапки: ${error.message}\n`;
            throw error; // Пробрасываем ошибку, чтобы тест завершился с FAILED
        }

        // Если всё прошло успешно, добавляем результат
        testResults.push({
            testName: 'test 1',
            checkName: 'Проверка наличия 9 элементов из массива на странице',
            inputData: JSON.stringify(headerItems),
            status: 'Успешно',
            additionalInfo: additionalInfo.trim(), // Добавляем дополнительные сведения (если есть)
        });
    } catch (error) {
        // Если тест упал, добавляем результат с ошибкой
        additionalInfo += `Ошибка в тесте: ${error.message}\n`;
        console.error(`Ошибка в тесте: ${error.message}`);

        testResults.push({
            testName: 'test 1',
            checkName: 'Проверка наличия 9 элементов из массива на странице',
            inputData: JSON.stringify(headerItems),
            status: 'Ошибка',
            additionalInfo: additionalInfo.trim(), // Добавляем дополнительные сведения
        });

        testPassed = false; // Устанавливаем флаг, что тест не прошёл
    } finally {
        await context.close();
    }

    // Генерация HTML-отчёта с использованием функции
    generateHtmlReport(testResults, 'test 1', 'test-results-patents-desktop-1.html');

    // Если тест не прошёл, выбрасываем ошибку
    if (!testPassed) {
        throw new Error('Тест завершился с ошибкой. Отчёт сформирован.');
    }
});