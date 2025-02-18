
class PatentsPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.filterButton = page.locator('.b-files-page__category.active.b-files-page__category--js_init[data-section-id="133"]');
        
        this.numberInFilter = this.filterButton.locator('.b-files-page__category-count');
        
        this.mainNumber = page.locator('.b-files-page__title-count.b-files-page__title-count--js_init');
        //Кнопка показать все патенты
        this.showAllButton = page.locator('.b-files-page__show-all.c-green-btn');
        //Все патенты
        this.allPatents = page.locator('.b-file-item__content-title');




    }

    async navigate() {
        await this.page.goto('https://infotecs.ru/about/patents/', { waitUntil: 'domcontentloaded' });
    }

    
    async clickElement(element) {
        await element.click();
    }

    async getNameOfAllPatents(patents) {
        let arrayOfNames = [];

        for (let index = 0; index < await patents.count(); index++) {
            const element = patents.nth(index);
            let text = await element.textContent();
            arrayOfNames.push(text);
        }
        return arrayOfNames;
    }
}

module.exports = PatentsPage;