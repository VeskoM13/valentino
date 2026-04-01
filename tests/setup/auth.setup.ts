import path from 'path';
import fs from 'fs';
import { test } from '@playwright/test';
import { Login } from '../pages/Login';

const authSessionFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json');
const loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf-8')) as {
    email: string,
    pass: string
}

test('authenticate', async ({ page }) => { 
    await page.goto('/login')
    const loginPage = new Login(page);
    await loginPage.loginFlow(loginData.email, loginData.pass)
    await loginPage.verifySuccessfulLogin()

    await page.context().storageState({
        path: authSessionFile
    })
});