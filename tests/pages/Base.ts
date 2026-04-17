import { type Page } from '@playwright/test';

export class Base {
    readonly page: Page;

    private readonly cartButton = '[data-test-id="header-cart-button"]';

    constructor(page: Page) {
        this.page = page;
    }

    async openCart() {
        await this.page.locator(this.cartButton).click();
    }
}
