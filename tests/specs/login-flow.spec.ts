import { test as base, expect } from '@playwright/test';
import { Login } from '../pages/Login';
import path from 'path';
import fs from 'fs';

// --- SAFE JSON READING LOGIC START ---

const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json');

/**
 * We check if the file exists. 
 * On CI (GitHub Actions), this file might be missing because it's ignored by git.
 * If it's missing, we pull values from process.env (GitHub Secrets).
 */
let loginData = { email: '', pass: '' };

if (fs.existsSync(loginDataFile)) {
    // If file exists (local development), read from it
    loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf-8'));
} else {
    // If file is missing (CI/GitHub Actions), use Environment Variables
    loginData = {
        email: process.env.LOGIN_EMAIL || '',
        pass: process.env.LOGIN_PASSWORD || ''
    };
}

// Ensure the directory exists so Playwright doesn't crash if it tries to write there later
const authDir = path.dirname(loginDataFile);
if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

// --- SAFE JSON READING LOGIC END ---

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
    // We clear storage state to ensure we are testing a fresh login every time
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