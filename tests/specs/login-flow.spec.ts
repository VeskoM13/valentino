import { test as base, expect } from '@playwright/test';
import { Login } from '../pages/Login';
import path from 'path';
import fs from 'fs';

const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json');
const loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf-8')) as {
    email: string,
    pass: string
};

const testData = {
    emptyFields: {
        errorEmail: 'Please enter a valid email address.',
        errorPassword: 'Password is required.',
    },
    wrongPassword: {
        password: '1234',
        errorMessage: 'Incorrect username or password.',
    },
    invalidEmail: {
        email: 'testvesko@gmailll.com',
        errorMessage: 'User does not exist.',
    }
};

const test = base.extend<{ loginPage: Login }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new Login(page);
        await page.goto('/login');
        await use(loginPage);
    }
});

test.describe('Login Flow', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Validation errors - empty email and password fields', async ({ page, loginPage }) => {
        await loginPage.clikcLogin();

        await expect(page.getByText(testData.emptyFields.errorEmail, { exact: true })).toBeVisible();
        await expect(page.getByText(testData.emptyFields.errorPassword, { exact: true })).toBeVisible();
    });

    test('Wrong password - shows error message', async ({ page, loginPage }) => {
        await loginPage.loginFlow(loginData.email, testData.wrongPassword.password);

        await expect(page.getByText(testData.wrongPassword.errorMessage, { exact: true })).toBeVisible();
    });

    test('Invalid email - shows error message', async ({ page, loginPage }) => {
        await loginPage.loginFlow(testData.invalidEmail.email, loginData.pass);

        await expect(page.getByText(testData.invalidEmail.errorMessage, { exact: true })).toBeVisible();
    });

    test('Happy flow - successful login', async ({ loginPage }) => {
        await loginPage.loginFlow(loginData.email, loginData.pass);
        await loginPage.verifySuccessfulLogin();
    });
});