import {Page, expect, Locator} from '@playwright/test';
import { BasePage } from './BasePage';
import { DASHBOARD_WIDGETS } from '../constants/dashboard-constants';

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
    const widgets = await this.page.locator('.orangehrm-dashboard-widget-header').allTextContents();
  
    for (const widget of DASHBOARD_WIDGETS) {
         expect(widgets).toContain(widget);
        }
    }
   
}

   