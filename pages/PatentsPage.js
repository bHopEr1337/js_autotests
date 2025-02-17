
class PatentsPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.filterButton = page.locator('.b-files-page__category.active.b-files-page__category--js_init[data-section-id="133"]');
        
        this.numberInFilter = this.filterButton.locator('.b-files-page__category-count');
        
        this.mainNumber = page.locator('.b-files-page__title-count.b-files-page__title-count--js_init');
    }

    async navigate() {
        await this.page.goto('https://infotecs.ru/about/patents/', { waitUntil: 'domcontentloaded' });
    }

    async clickElement(element) {
        await element.click();
    }
}

module.exports = PatentsPage;