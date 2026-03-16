import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage';
import { AdminUserManagementPage } from '../pages/AdminUserManagementPage';
import { AdminAddUserPage } from '../pages/AdminAddUserPage';
import { PimEmployeeListPage } from '../pages/PimEmployeeListPage';
import { PimAddEmployeePage } from '../pages/PimAddEmployeePage';

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    adminUserManagementPage: AdminUserManagementPage
    adminAddUserPage: AdminAddUserPage;
    pimEmployeeListPage: PimEmployeeListPage;
    pimAddEmployeePage: PimAddEmployeePage;
};

const testPages = base.extend<{
    pages: Pages;
}>({
    pages: async ({ page }, use) => {
        const pages: Pages = {
            loginPage: new LoginPage(page),
            dashboardPage: new DashboardPage(page),
            adminUserManagementPage: new AdminUserManagementPage(page),
            adminAddUserPage: new AdminAddUserPage(page),
            pimEmployeeListPage: new PimEmployeeListPage(page),
            pimAddEmployeePage: new PimAddEmployeePage(page),
        };

        await use(pages);
    }
})

export const test = testPages;

//storageState, globalSetup, globalTearDown