import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage';

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

const testPages = base.extend<{
    pages: Pages;
}>({
    pages: async ({ page }, use) => {
        const pages: Pages = {
            loginPage: new LoginPage(page),
            dashboardPage: new DashboardPage(page)
        };

        await use(pages);
    }
})

export const test = testPages;

//storageState, globalSetup, globalTearDown