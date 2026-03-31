import { type Page } from '@playwright/test';

export class Base {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openCart() {
        await this.page.locator('[data-test-id="header-cart-button"]').getByRole('button').click();
    }

}
