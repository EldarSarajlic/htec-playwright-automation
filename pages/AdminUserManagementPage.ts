import {Page, expect, Locator} from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminUserManagementPage extends BasePage{
    readonly page: Page;
    private readonly adminSidebarItem: Locator;
    private readonly tabs: Record<string, string[]>

    constructor(page: Page){
        super(page);
        this.page = page;
        this.adminSidebarItem = page.getByRole('link', { name: 'Admin' });
        this.tabs = {
         'User Management': ['Users'],
         'Job': ['Job Titles', 'Pay Grades', 'Employment Status', 'Job Categories', 'Work Shifts'],
         'Organization': ['General Information', 'Locations', 'Structure'],
         'Qualifications': ['Skills', 'Education', 'Licenses', 'Languages', 'Memberships'],
         'Configuration': ['Email Configuration', 'Email Subscriptions', 'Localization', 'Language Packages', 'Modules', 'Social Media Authentication', 'Register OAuth Client', 'LDAP Configuration']
        }
    }

    async goToUserManagementPage() {
        await this.navigate(process.env.USERMANAGEMENT_URL!);
        await this.navHelper.validateUrlPartition("viewSystemUsers");
    }

    async verifySidebarItemIsActive() {
       await expect(this.adminSidebarItem).toBeVisible();
       await expect(this.adminSidebarItem).toContainClass('active');
    }
    
}