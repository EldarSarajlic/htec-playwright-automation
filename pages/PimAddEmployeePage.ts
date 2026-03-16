import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { DataHelper } from '../helpers/dataHelper';

export class PimAddEmployeePage extends BasePage {
    readonly page: Page;
    private readonly dataHelper: DataHelper;

    private readonly addEmployeeHeader: Locator;
    // OrangeHRM Add Employee form uses placeholder attributes for the name fields
    private readonly firstNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly lastNameInput: Locator;
    // Employee Id field has no placeholder — targeting by label container
    private readonly employeeIdInput: Locator;
    private readonly saveButton: Locator;

    private cachedFirstName?: string;
    private cachedLastName?: string;
    private cachedEmployeeId?: string;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.dataHelper = new DataHelper();
        this.addEmployeeHeader = page.getByRole('heading', { name: 'Add Employee' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeeIdInput = page.locator('div').filter({ hasText: /^Employee Id/ }).getByRole('textbox');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    //#region Navigation & header

    async goToPage(): Promise<void> {
        await this.navigate(process.env.PIM_ADD_EMPLOYEE_URL!);
        await this.navHelper.validateUrlPartition('addEmployee');
    }

    async verifyAddEmployeeHeader(): Promise<void> {
        await expect(this.addEmployeeHeader).toBeVisible();
    }

    async verifyPersonalDetailsPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 15000 });
    }

    //#endregion

    //#region First name

    async enterFirstName(): Promise<void> {
        this.cachedFirstName = this.dataHelper.generateFirstName();
        await this.firstNameInput.fill(this.cachedFirstName);
    }

    async getFirstName(): Promise<string> {
        return this.cachedFirstName ?? '';
    }

    //#endregion

    //#region Last name

    async enterLastName(): Promise<void> {
        this.cachedLastName = this.dataHelper.generateLastName();
        await this.lastNameInput.fill(this.cachedLastName);
    }

    async getLastName(): Promise<string> {
        return this.cachedLastName ?? '';
    }

    //#endregion

    //#region Employee ID

    async captureEmployeeId(): Promise<void> {
        const uniqueId = `QA${Date.now().toString().slice(-7)}`;
        await this.employeeIdInput.clear();
        await this.employeeIdInput.fill(uniqueId);
        await expect(this.page.getByText('Employee Id already exists')).not.toBeVisible();
        this.cachedEmployeeId = uniqueId;
    }

    async getEmployeeId(): Promise<string> {
        return this.cachedEmployeeId ?? '';
    }

    //#endregion

    //#region Save

    async clickSave(): Promise<void> {
        await expect(this.page.getByText('Employee Id already exists')).not.toBeVisible();
        await this.saveButton.click();
    }

    //#endregion
}
