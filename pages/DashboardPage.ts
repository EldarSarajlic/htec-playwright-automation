import {Page, expect, Locator} from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage{
    readonly page: Page;
    private readonly dashboardItem : Locator;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.dashboardItem = page.getByRole('link', { name: 'Dashboard' });
    }

    async goToDashboardPage() {
        await this.navigate(process.env.DASHBOARD_URL!);
        await this.navHelper.validateUrlPartition('dashboard');
    }
     async verifyDashboardItemIsActive() {
       await expect(this.dashboardItem).toBeVisible();
       await expect(this.dashboardItem).toContainClass('active');
    }

    async verifyDashboardWidgets() {
    const expectedWidgets = [
        'Time at Work',
        'My Actions',
        'Quick Launch',
        'Buzz Latest Posts',
        'Employees on Leave Today',
        'Employee Distribution by Sub Unit',
        'Employee Distribution by Location'
    ];

    const widgets = await this.page.locator('.orangehrm-dashboard-widget-header').allTextContents();
    for (const widget of expectedWidgets) {
        expect(widgets).toContain(widget);
    }
    }
      
}

   