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
        await patentsPage.clickElement(patentsPage.showAllButton);

        await page.waitForSelector('.b-file-item__content-title', { state: 'visible', timeout: 10000 });
        const patents = await patentsPage.getNameOfAllPatents(patentsPage.allPatents);

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.clickElement(homePage.searchButton);

        console.log(`Общее количество патентов: ${patents.length}`);

        for (let index = 0; index < patents.length; index++) {
            console.log(`Обрабатываем патент №${index + 1}`);
            const patentText = patents[index];

            try {
                await homePage.clickElement(homePage.inputSearch);
                await homePage.inputSearch.fill(patentText);
                await homePage.inputSearch.press('Enter');

                // Используем ожидание, чтобы дать время загрузиться результатам
                //await page.waitForTimeout(2000);

                const responsePromise = page.waitForResponse(response => 
                    response.url().startsWith('https://infotecs.ru/local/api/search/ajax/getitems.php') &&
                    response.status() === 200
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
                        //блок с элементами вывода - b-header__search-items ps b-header__search-items--js_init
                        // Кнопка показать всё - b-header__search-total-count

                        // Если кнопка существует, то нажать
                        // На новой странице найти необходимы текст в блоке b-search-page__search-item-title
                        // независимо от исхода вернуться в поиск на главную страницу.

                        const element = await searchResults.nth(i);
                        const titleOfOutputElement = await element.locator('.b-header__search-item-title');
                        const textOfOutputElement = await titleOfOutputElement.textContent();

                        const cleanedPatentText = patentText.trim().replace(/\s+/g, ' ');
                        const cleanedOutputText = textOfOutputElement.trim().replace(/\s+/g, ' ');

                        //console.log(`Ищем: "${cleanedPatentText}" | Проверяем: "${cleanedOutputText}"`);

                        // Сравниваем названия патентов
                        if (cleanedPatentText === cleanedOutputText) {
                            found = true; // Патент найден
                            //console.log(`Патент "${cleanedPatentText}" успешно найден.`);
                            break; // Выход из цикла, если найдено соответствие
                        }
                    } catch (error) {
                        console.error(`Ошибка при обработке элемента поиска: ${error}`);
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
    } catch (error) {
        console.error(`Ошибка в основном потоке теста: ${error}`);
    } finally {
        // Закрываем контекст браузера в любом случае
        await context.close();
    }
});