
class HomePage {
    constructor(page) {
        this.page = page;

        // Locators

        //Поиск кнопки в шапке "О компании"
        this.element = page.locator('.b-header__menu-item[data-link="/about/"]');
        //Поиск расширенного меню (возможно после наведения на шапку)
        this.aboutBlock = page.locator('.b-header__menu-content.b-header__menu-content--js_init.b-header__menu-content--active');
        //Поиск ссылок в расширенном меню
        this.headerElements = this.aboutBlock.locator('.b-header__menu-section-elem');
    }


    // Метод для переода на главную страницу
    async navigate() {
        await this.page.goto('https://infotecs.ru/');
    }


    // Метод для наведения на шапку
    async hoverHeader() {
        await this.element.hover();
        await this.aboutBlock.waitFor({ state: 'visible' });
    }


    // Метод для проверки элементов в шапке
    async verifyHeaderItems(headerItems) {
        for (let index = 0; index < 9; index++) {
                const headerElement = this.headerElements.nth(index);
                
                //По идее эту проверку надо вынести отдельно в тест, т.к. в Страницах только взаимодействие.
                //expect(headerElement).toBeVisible();

                await headerElement.waitFor({ state: 'visible' });
                
                const text = await headerElement.textContent();
                if (text.trim() !== headerItems[index].trim()) {
                    throw new Error(`Текст элемента не совпадает: ожидалось "${expectedItems[index]}", получено "${text}"`);
                }
            }
    }
}

module.exports = HomePage;