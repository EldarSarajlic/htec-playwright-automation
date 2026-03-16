import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { INCLUDE_OPTIONS } from '../constants/pimEmployeeList-constants';

export class PimEmployeeListPage extends BasePage {
    readonly page: Page;

    private readonly employeeNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly employmentStatusDropdown: Locator;
    private readonly includeDropdown: Locator;
    private readonly supervisorNameInput: Locator;
    private readonly jobTitleDropdown: Locator;
    private readonly subUnitDropdown: Locator;
    private readonly addButton: Locator;
    private readonly searchButton: Locator;
    private readonly resetButton: Locator;
    private readonly tempTextSelect: Locator;

    private cachedFirstName?: string;
    private cachedLastName?: string;
    private cachedEmployeeId?: string;
    private cachedJobTitle?: string;
    private cachedEmploymentStatus?: string;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.employeeNameInput = page.locator('div').filter({ hasText: /^Employee Name$/ }).getByRole('textbox');
        this.employeeIdInput = page.locator('div').filter({ hasText: /^Employee Id$/ }).getByRole('textbox');
        // Prefix match (no trailing $) so the filter targets the outer container div
        // whose innerText is "Employment Status-- Select --", not just the label div
        this.employmentStatusDropdown = page.locator('div').filter({ hasText: /^Employment Status/ }).getByText('-- Select --');
        this.includeDropdown = page.locator('div').filter({ hasText: /^Include/ }).getByText(INCLUDE_OPTIONS.CURRENT_EMPLOYEES_ONLY);
        this.supervisorNameInput = page.locator('div').filter({ hasText: /^Supervisor Name$/ }).getByRole('textbox');
        this.jobTitleDropdown = page.locator('div').filter({ hasText: /^Job Title/ }).getByText('-- Select --');
        this.subUnitDropdown = page.locator('div').filter({ hasText: /^Sub Unit/ }).getByText('-- Select --');
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.tempTextSelect = page.getByRole('option', { name: '-- Select --' });
    }

    async goToPage(): Promise<void> {
        await this.navigate(process.env.PIM_EMPLOYEE_LIST_URL!);
        await this.navHelper.validateUrlPartition('viewEmployeeList');
    }

    async clickSearchButton(): Promise<void> {
        await this.searchButton.click();
    }

    async clickAddButton(): Promise<void> {
        await this.addButton.click();
    }

    //#region Employee ID targeted search (used after creation to verify persistence)

    async fillEmployeeIdFilterWithValue(id: string): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await this.employeeIdInput.fill(id);
    }

    async verifyEmployeeByIdAndReset(id: string): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('row').nth(1)).toContainText(id);
        await this.clickReset();
        await expect(this.employeeIdInput).toBeEmpty();
    }

    //#endregion

    //#region Private helpers

    private async clickReset(): Promise<void> {
        await this.resetButton.click();
        await this.waitForSpinnerToDisappear();
    }

    private async selectFirstAvailableOption(): Promise<void> {
        await this.tempTextSelect.waitFor({ state: 'visible' });
        for (const option of await this.page.getByRole('option').all()) {
            const text = (await option.innerText()).trim();
            if (text !== '-- Select --') {
                await option.click();
                return;
            }
        }
    }

    private async selectOptionByValue(value: string): Promise<void> {
        await this.tempTextSelect.waitFor({ state: 'visible' });
        for (const option of await this.page.getByRole('option').all()) {
            if ((await option.innerText()).includes(value)) {
                await option.click();
                return;
            }
        }
    }

    private async verifyAtLeastOneResult(): Promise<void> {
        await expect(this.page.getByRole('row').nth(1)).toBeVisible();
    }

    // Scans all data rows and returns the first non-empty value at the given cell index
    private async getFirstNonEmptyCellValue(cellIndex: number): Promise<string> {
        await this.waitForSpinnerToDisappear();
        const rows = await this.page.getByRole('row').all();
        for (let i = 1; i < rows.length; i++) {
            const text = (await rows[i].getByRole('cell').nth(cellIndex).innerText()).trim();
            if (text) return text;
        }
        return '';
    }

    private async getValidFirstName(): Promise<string> {
        if (!this.cachedFirstName) {
            this.cachedFirstName = await this.getFirstNonEmptyCellValue(2);
        }
        return this.cachedFirstName;
    }

    private async getValidLastName(): Promise<string> {
        if (!this.cachedLastName) {
            this.cachedLastName = await this.getFirstNonEmptyCellValue(3);
        }
        return this.cachedLastName;
    }

    private async getValidEmployeeId(): Promise<string> {
        if (!this.cachedEmployeeId) {
            this.cachedEmployeeId = await this.getFirstNonEmptyCellValue(1);
        }
        return this.cachedEmployeeId;
    }

    private async getValidJobTitle(): Promise<string> {
        if (!this.cachedJobTitle) {
            this.cachedJobTitle = await this.getFirstNonEmptyCellValue(4);
        }
        return this.cachedJobTitle;
    }

    private async getValidEmploymentStatus(): Promise<string> {
        if (!this.cachedEmploymentStatus) {
            this.cachedEmploymentStatus = await this.getFirstNonEmptyCellValue(5);
        }
        return this.cachedEmploymentStatus;
    }

    //#endregion

    //#region Employee Name filter

    async fillEmployeeNameFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await this.employeeNameInput.fill(await this.getValidFirstName());
        await this.waitForSearchToFinish();
        const nameParts = [await this.getValidFirstName(), await this.getValidLastName()];
        for (const option of await this.page.getByRole('option').all()) {
            const optionText = await option.innerText();
            if (nameParts.every(part => optionText.includes(part))) {
                await option.click();
                break;
            }
        }
    }

    async verifyAndResetEmployeeNameFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('row').nth(1)).toContainText(await this.getValidFirstName());
        await this.clickReset();
        await expect(this.employeeNameInput).toBeEmpty();
    }

    //#endregion

    //#region Employee Id filter

    async fillEmployeeIdFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await this.employeeIdInput.fill(await this.getValidEmployeeId());
    }

    async verifyAndResetEmployeeIdFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('row').nth(1)).toContainText(await this.getValidEmployeeId());
        await this.clickReset();
        await expect(this.employeeIdInput).toBeEmpty();
    }

    //#endregion

    //#region Employment Status filter

    async clickEmploymentStatusDropdown(): Promise<void> {
        await this.getValidEmploymentStatus(); // pre-cache table value before dropdown opens
        await this.employmentStatusDropdown.click();
    }

    async selectEmploymentStatus(): Promise<void> {
        const status = await this.getValidEmploymentStatus();
        if (status) {
            await this.selectOptionByValue(status);
        } else {
            await this.selectFirstAvailableOption();
        }
    }

    async verifyAndResetEmploymentStatusFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        const status = await this.getValidEmploymentStatus();
        if (status) {
            await expect(this.page.getByRole('row').nth(1)).toContainText(status);
        } else {
            await this.verifyAtLeastOneResult();
        }
        await this.clickReset();
        await expect(this.employmentStatusDropdown).toBeVisible();
    }

    //#endregion

    //#region Include filter

    async clickIncludeDropdown(): Promise<void> {
        await this.includeDropdown.click();
    }

    async selectCurrentAndPastEmployees(): Promise<void> {
        const option = this.page.getByRole('option', { name: INCLUDE_OPTIONS.CURRENT_AND_PAST_EMPLOYEES });
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    async verifyAndResetIncludeFilter(): Promise<void> {
        await this.verifyAtLeastOneResult();
        await this.clickReset();
        await expect(this.includeDropdown).toBeVisible();
    }

    //#endregion

    //#region Supervisor Name filter

    async fillSupervisorNameFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        await this.supervisorNameInput.fill('a');
        await this.waitForSearchToFinish();
        const firstOption = this.page.getByRole('option').first();
        await firstOption.waitFor({ state: 'visible' });
        await firstOption.click();
    }

    async verifyAndResetSupervisorNameFilter(): Promise<void> {
        // 0 results is valid — the selected employee may not have any direct reports
        await this.waitForSpinnerToDisappear();
        await this.clickReset();
        await expect(this.supervisorNameInput).toBeEmpty();
    }

    //#endregion

    //#region Job Title filter

    async clickJobTitleDropdown(): Promise<void> {
        await this.getValidJobTitle(); // pre-cache table value before dropdown opens
        await this.jobTitleDropdown.click();
    }

    async selectJobTitle(): Promise<void> {
        const jobTitle = await this.getValidJobTitle();
        if (jobTitle) {
            await this.selectOptionByValue(jobTitle);
        } else {
            await this.selectFirstAvailableOption();
        }
    }

    async verifyAndResetJobTitleFilter(): Promise<void> {
        await this.waitForSpinnerToDisappear();
        const jobTitle = await this.getValidJobTitle();
        if (jobTitle) {
            await expect(this.page.getByRole('row').nth(1)).toContainText(jobTitle);
        } else {
            await this.verifyAtLeastOneResult();
        }
        await this.clickReset();
        await expect(this.jobTitleDropdown).toBeVisible();
    }

    //#endregion

    //#region Sub Unit filter

    async clickSubUnitDropdown(): Promise<void> {
        await this.subUnitDropdown.click();
    }

    async selectFirstSubUnit(): Promise<void> {
        await this.selectFirstAvailableOption();
    }

    async verifyAndResetSubUnitFilter(): Promise<void> {
        await this.verifyAtLeastOneResult();
        await this.clickReset();
        await expect(this.subUnitDropdown).toBeVisible();
    }

    //#endregion
}
