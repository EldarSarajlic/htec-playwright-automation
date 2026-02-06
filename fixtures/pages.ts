import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

type Pages = {
    loginPage: LoginPage;
};

const testPages = base.extend<{
    pages: Pages;
}>({
    pages: async ({ page }, use) => {
        const pages: Pages = {
            loginPage: new LoginPage(page),
        };

        await use(pages);
    }
})

export const test = testPages;

//storageState, globalSetup, globalTearDown