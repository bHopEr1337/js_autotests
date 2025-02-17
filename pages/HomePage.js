
class HomePage {
    constructor(page) {
        this.page = page;

        // Locators
        const element = page.locator('.b-header__menu-item[data-link="/about/"]');
        const aboutBlock = page.locator('.b-header__menu-content.b-header__menu-content--js_init.b-header__menu-content--active');
        const menuElements = aboutBlock.locator('.b-header__menu-section-elem');

    }
}