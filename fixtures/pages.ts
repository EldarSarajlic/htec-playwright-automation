import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage';
import { AdminUserManagementPage } from '../pages/AdminUserManagementPage';

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    adminUserManagementPage: AdminUserManagementPage
};

const testPages = base.extend<{
    pages: Pages;
}>({
    pages: async ({ page }, use) => {
        const pages: Pages = {
            loginPage: new LoginPage(page),
            dashboardPage: new DashboardPage(page),
            adminUserManagementPage: new AdminUserManagementPage(page)
        };

        await use(pages);
    }
})

export const test = testPages;

//storageState, globalSetup, globalTearDown