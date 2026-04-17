import path from 'path';
import fs from 'fs';
import { test } from '@playwright/test';
import { Login } from '../pages/Login';

// Paths for session and login data
const authSessionFile = path.resolve(__dirname, '../../playwright/.auth/user.json');
const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json');

// --- SAFE SETUP START ---

// 1. Ensure the .auth directory exists so we can save the session later
const authDir = path.dirname(authSessionFile);
if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

/**
 * 2. Safe read of loginData.json
 * If file exists (local), use it. 
 * If not (CI/GitHub Actions), use Environment Variables from secrets.
 */
let loginData = { email: '', pass: '' };

if (fs.existsSync(loginDataFile)) {
    // Reading from local JSON file
    loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf-8'));
} else {
    // Reading from GitHub Secrets (Environment Variables)
    loginData = {
        email: process.env.LOGIN_EMAIL || '',
        pass: process.env.LOGIN_PASSWORD || ''
    };
}

// --- SAFE SETUP END ---

test('authenticate', async ({ page }) => { 
    await page.goto('/login');
    const loginPage = new Login(page);

    // Use the safely loaded loginData
    await loginPage.loginFlow(loginData.email, loginData.pass);
    await loginPage.verifySuccessfulLogin();

    // Save the authentication state (cookies/session) to the JSON file
    await page.context().storageState({
        path: authSessionFile
    });
});