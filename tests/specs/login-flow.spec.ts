import { test, expect } from '@playwright/test';
import { Base } from '../pages/Base';
import { Login } from '../pages/Login';
import path from 'path'
import fs from 'fs'

const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json');
const loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf-8')) as {
    email: string,
    pass: string
}

const validationTestData = [
    {
        errorEmailMessage: 'Please enter a valid email address.',
        errorPasswordMessage: 'Password is required.',
    },
    {
        email: loginData.email,
        password: '1234',
        errorPasswordMessage: 'Incorrect username or password.',
    },
    {
        email: "testvesko@gmailll.com",
        password: loginData.pass,
        errorEmailMessage: 'User does not exist.',
    }

];

test.describe('Login Flow', () => {
    test.describe.configure({ mode: 'serial' });
    test.use({ storageState: { cookies: [], origins: [] } });
    let loginPage: Login;

    test.beforeEach(async ({ page }) => {
        loginPage = new Login(page);
        await page.goto('/login');
    });

    test('Validation errors - empty email and password fields', async ({ page }) => {
        await page.locator('[data-test-id="login-submit-button"]').click();

        await expect(page.getByText(validationTestData[0].errorEmailMessage!, { exact: true })).toBeVisible();
        await expect(page.getByText(validationTestData[0].errorPasswordMessage!, { exact: true })).toBeVisible();
    });

    test('Wrong password - shows error message', async ({ page }) => {
        await loginPage.loginFlow(loginData.email, validationTestData[1].password!);

        await expect(page.getByText(validationTestData[1].errorPasswordMessage!, { exact: true })).toBeVisible();
    });

     test('Invalid email - shows error message', async ({ page }) => {
        await loginPage.loginFlow(validationTestData[2].email!, loginData.pass);

        await expect(page.getByText(validationTestData[2].errorEmailMessage!, { exact: true })).toBeVisible();
    });

    test('Happy flow - successful login', async ({ page }) => {
        await loginPage.loginFlow(loginData.email, loginData.pass);
        await loginPage.verifySuccessfulLogin();
    });

});
