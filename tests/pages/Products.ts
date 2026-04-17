import { expect, type Locator, type Page } from '@playwright/test';

export class Product {
    readonly page: Page;
    private readonly productWrapper = '.p-6';
    private readonly productPrice = '.font-bold';
    private readonly productHeadingRole = 'headingrr';
    private readonly addToCartButtonName = 'Add to Cart';

    constructor(page: Page) {
        this.page = page;
    }

    // Instance method — call on an instance created with `new Product(page)`
    async addProductToCart(index: number) {
        const productWrapper = this.page.locator(this.productWrapper).nth(index)
        const productName = await productWrapper.getByRole(this.productHeadingRole).first().textContent()
        const productPrice = await productWrapper.locator(this.productPrice).textContent()
        const firstButton = productWrapper.getByRole('button', {
            name: this.addToCartButtonName
        })
        await firstButton.click()
        return {
            name: productName,
            price: Number(productPrice?.substring(1))
        }
    }
}

