import { Page, expect } from "@playwright/test";

export class LoginPage {

    readonly page: Page;
    private readonly emailInput = '[data-test-id="login-email-input"]';
    private readonly passInput = '[data-test-id="login-password-input"]';
    private readonly clickLoginButton = '[data-test-id="login-submit-button"]';

    constructor(page: Page) {
        this.page = page;

    }

    async login(email: string, password: string) {
        await this.page.locator(this.emailInput).fill(email);
        await this.page.locator(this.passInput).fill(password);
        await this.page.locator(this.clickLoginButton).click();
    }

    async clickLogin() {
        await this.page.locator(this.clickLoginButton).click();
    }


    async verifySuccessfulLogin(page: Page) {
        // After successful login, user should be redirected to home page
        await expect(page).toHaveURL('/', { timeout: 10000 });
    }
}