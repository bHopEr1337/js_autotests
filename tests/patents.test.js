const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PatentsPage = require('../pages/PatentsPage');
const generateHtmlReport = require('../reportGenerator');

test('test 2', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    const patentsPage = new PatentsPage(page);

    // Массив для хранения результатов тестов
    const testResults = [];
    let additionalInfo = ''; // Для хранения дополнительной информации об ошибках

    try {
        await patentsPage.navigate();
        await expect(patentsPage.filterButton).toBeVisible();

        // Получаем число из фильтра
        await patentsPage.numberInFilter.waitFor({ state: 'visible' });
        const numberInFilter = await patentsPage.numberInFilter.textContent();
        const filterNumber = parseInt(numberInFilter.trim(), 10);

        await patentsPage.clickElement(patentsPage.filterButton);

        // Получаем число из основного блока
        await patentsPage.mainNumber.waitFor({ state: 'visible' });
        const numberInMainBlock = await patentsPage.mainNumber.textContent();
        const mainNumber = parseInt(numberInMainBlock.trim(), 10);

        // Сравниваем числа и выбрасываем ошибку, если они не совпадают
        expect(filterNumber).toBe(mainNumber);

        // Если числа совпали, добавляем результат теста в массив
        testResults.push({
            testName: 'test 2',
            checkName: 'Сравнение количества в двух блоках',
            inputData: `Число в фильтре: ${filterNumber}, Число в основном блоке: ${mainNumber}`,
            status: 'Успешно',
            additionalInfo: additionalInfo.trim(), // Добавляем дополнительные сведения (если есть)
        });
    } catch (error) {
        // Если тест упал, добавляем результат с ошибкой
        additionalInfo += `Ошибка в тесте: ${error.message}\n`;
        console.error(`Ошибка в тесте: ${error.message}`);

        testResults.push({
            testName: 'test 2',
            checkName: 'Сравнение количества в двух блоках',
            inputData: 'N/A',
            status: 'Ошибка',
            additionalInfo: additionalInfo.trim(), // Добавляем дополнительные сведения
        });

        // Пробрасываем ошибку, чтобы тест завершился с FAILED
        throw error;
    } finally {
        await context.close();
    }

    // Генерация HTML-отчёта с использованием функции
    generateHtmlReport(testResults, 'test 2', 'test-results-patents-desktop-2.html');
});