
import { Page } from "@playwright/test";
import signUpData from '../testdata/signUpData.json';
export { signUpData };


export async function signUp(page: Page, email: string) {
    await page.locator('[data-test-id="signup-firstname-input"]').fill(signUpData.firstName);
    await page.locator('[data-test-id="signup-lastname-input"]').fill(signUpData.lastName);
    await page.locator('[data-test-id="signup-email-input"]').fill(email);
    await page.locator('[data-test-id="signup-password-input"]').fill(signUpData.password);
    await page.locator('[data-test-id="signup-submit-button"]').click();
}

export async function addConfirmationCode(page: Page, code: string) {
    const input = page.locator('input[inputmode="numeric"]')
    await input.fill(code)
    await page.locator('[data-test-id="confirm-signup-submit-button"]').click();
}