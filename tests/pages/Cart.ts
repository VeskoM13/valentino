import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    private readonly headingRole = 'heading';
    private readonly subtotalLabel = 'Subtotal';
    private readonly subtotalValueSelector = '.font-semibold';

    constructor(page: Page) {
        this.page = page;
    }

    async assertProduct(heading: string) {
        const firstProductHeading = this.page.getByRole(this.headingRole, {
            name: heading
        })
        await expect(firstProductHeading).toBeVisible()
    }

    async getSubTotal() {
        const subTotalWrapper = this.page.getByText(this.subtotalLabel).locator('..').locator(this.subtotalValueSelector)
        const subtotal = await subTotalWrapper.textContent();
        return Number(subtotal?.substring(1))
    }

    async proceedToCheckout() {
        await this.page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    } 
}