import { expect, type Locator, type Page } from '@playwright/test';

export class ContactPage {
    readonly page: Page;
    private readonly orderIdInput = '[data-test-id="contact-order-id-input"]';
    private readonly emailInput = '[data-test-id="contact-email-input"]';
    private readonly trackOrderButton = '[data-test-id="contact-track-order-button"]';

    constructor(page: Page) {
        this.page = page;
    }

    async fillOrderIdAndEmail(orderId: string, email: string) {
        await this.page.locator(this.orderIdInput).fill(orderId);
        await this.page.locator(this.emailInput).fill(email);    
    }

    async clickTrackOrder() {
        await this.page.locator(this.trackOrderButton).click();  
    }
}