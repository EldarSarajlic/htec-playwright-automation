import {Page, expect, Locator} from '@playwright/test';
import { BasePage } from './BasePage';
import { ADMIN_TABS, TABLE_COLUMN_HEADERS } from '../constants/adminUserManagement-constants';

export class AdminUserManagementPage extends BasePage{
    readonly page: Page;
    private readonly adminSidebarItem: Locator;
    private readonly userNameFilter: Locator;
    private readonly employeeNameFilter: Locator;
    private readonly userRoleFilter: Locator;
    private readonly statusFilter:Locator;
    private readonly searchButton:Locator;
    private readonly resetButton:Locator;
    private readonly addButton:Locator;
    private readonly tempTextSearching: Locator;
    private readonly tempTextSelect: Locator;
    private readonly systemUsersHeader: Locator;

    private cachedUsername?:string;
    private cachedEmployeeName?:string;
    private cachedUserRole?:string;
    private cachedStatus?:string;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.adminSidebarItem = page.getByRole('link', { name: 'Admin' });
        this.userNameFilter = page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox');
        this.employeeNameFilter = page.locator('div').filter({ hasText: /^Employee Name$/ }).getByRole('textbox');
        this.userRoleFilter = page.locator('div').filter({ hasText: /^User Role/ }).getByText('-- Select --')
        this.statusFilter = page.getByText('Status-- Select --');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.addButton = page.getByRole('button', { name: 'Add'});
        this.tempTextSearching = page.getByRole('option', { name: 'Searching....' });
        this.tempTextSelect = page.getByRole('option', { name: '-- Select --' })
        this.systemUsersHeader = page.getByRole('heading', { name: 'System Users' });
    }

    async goToUserManagementPage() {
        await this.navigate(process.env.USERMANAGEMENT_URL!);
        await this.navHelper.validateUrlPartition("viewSystemUsers");
    }

    async verifySidebarItemIsActive() {
       await expect(this.adminSidebarItem).toBeVisible();
       await expect(this.adminSidebarItem).toContainClass('active');
    }

    async verifiyHeaderVisibility(){
        await expect(this.systemUsersHeader).toBeVisible({timeout:30000});
    }
    
    async verifyAdminTabs(){
        await this.validateDropdownsAndSubItems(ADMIN_TABS);
    }
    
    //#region Validation - Filters
    async verifyUsernameFilterVisibility(){
        await expect(this.userNameFilter).toBeVisible();
    }

    async verifiyEmployeeNameFilterVisibility(){
        await expect(this.employeeNameFilter).toBeVisible();
    }

    async verifyUserRoleFilterVisibility(){
        await expect(this.userRoleFilter).toBeVisible();
    }

    async verifyStatusFilterVisibility(){
        await expect(this.statusFilter).toBeVisible();
    }
    //#endregion
    
    //#region Validation - Buttons
    async verifyAddButton(){
        await this.validateButtonByName('Add');
    }

    async verifySearchButton(){
        await this.validateButtonByName('Search');
    }

    async verifyResetButton(){
        await this.validateButtonByName('Reset');
    }
    //#endregion
    
    //#region Validation - Table Column Headers
    async getTableColumnHeaders() {
        return (await this.page.getByRole('columnheader').allInnerTexts()).slice(1);
    }

    async verifyTableColumnHeaders(){
        await this.waitForSpinnerToDisappear();
        let loadedHeaders = await this.getTableColumnHeaders();
        for(const header of TABLE_COLUMN_HEADERS){
         expect(loadedHeaders).toContain(header);   
        }
    }
    //#endregion

    //#region Buttons - click actions
    async clickSearchButton(){
        await this.searchButton.click();
    }

    async clickResetButton(){
        await this.resetButton.click();
    }

    async clickAddButton(){
        await this.addButton.click();
    }
    //#endregion
   
    //#region Username filter
    async getValidUsername() {
        if(!this.cachedUsername){
            this.cachedUsername = await this.page.getByRole('row').nth(1).getByRole('cell').nth(1).innerText();
        }
        return this.cachedUsername;
    }

    async fillUsernameFilter(username?:string){
        if(username){
        await this.waitForSpinnerToDisappear();
        await this.userNameFilter.fill(username);
        }
        else{
        await this.waitForSpinnerToDisappear();
        await this.userNameFilter.fill(await this.getValidUsername());
        }
        
    }

    async verifyAndResetUsernameFilter(){
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('cell').nth(1)).toContainText(await this.getValidUsername());
        await this.resetFilters(this.userNameFilter);
    }
    //#endregion

    //#region Employee name filter
    async getValidEmployeeName(){
        if(!this.cachedEmployeeName){
            this.cachedEmployeeName = await this.page.getByRole('row').nth(1).getByRole('cell').nth(3).innerText();
        }
        return this.cachedEmployeeName;
    }
    
    async getSuggestedEmployeeNames(){
        return (await this.page.getByRole('listbox').getByRole('option').all());
    }

    async chooseValidEmployeeName(){
        await this.tempTextSearching.waitFor({state:'hidden'});
        let validEmployeeNameParts = (await this.getValidEmployeeName()).split(' ');
        for(let option of await this.getSuggestedEmployeeNames()){
            let optionText = await option.innerText()
            const isMatching = validEmployeeNameParts?.every(part => optionText.includes(part));
            if(isMatching){
                await option.click();
                break;
            }
        }
    }

    async fillEmployeeNameFilter(){
        await this.employeeNameFilter.fill(await this.getValidEmployeeName());
    }

    async verifyAndResetEmployeeNameFilter(){
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('cell').nth(3)).toContainText(await this.getValidEmployeeName());
        await this.resetFilters(this.employeeNameFilter);
    }
    //#endregion
    
    //#region User role filter
    async getValidUserRole(){
        if(!this.cachedUserRole){
            this.cachedUserRole = await this.page.getByRole('row').nth(1).getByRole('cell').nth(2).innerText();
        }
        return this.cachedUserRole;
    }       

    async getAllUserRoles(){
        return (this.page.getByRole('option')).all();
    }

    async clickUserRoleDropdown(){
        await this.userRoleFilter.click();
    }

    async chooseUserRole(){
        await this.tempTextSelect.waitFor({state:'visible'});
        for(let role of await this.getAllUserRoles()){
            if((await role.innerText()).includes(await this.getValidUserRole())){
                await role.click();
                break;
            }
        }
    }

    async verifyAndResetUserRoleFilter(){
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('cell').nth(2)).toContainText(await this.getValidUserRole());
        await this.resetFilters(this.userRoleFilter);
    }
    //#endregion

    //#region Status filter

    async getValidStatus(){
        if(!this.cachedStatus){
            this.cachedStatus = await this.page.getByRole('row').nth(1).getByRole('cell').nth(4).innerText();
        }
        return this.cachedStatus;
    }

    async getAllStatuses(){
        return(await this.page.getByRole('option').all())
    }

    async clickStatusDropdown(){
        await this.statusFilter.click();
    }

    async chooseStatus(){
        await this.tempTextSelect.waitFor({state:'visible'});
        for(let status of await this.getAllStatuses()){
            if((await status.innerText()).includes(await this.getValidStatus())){
                await status.click();
                break;
            }
        }
    }

    async verifyAndResetStatusFilter(){
        await this.waitForSpinnerToDisappear();
        await expect(this.page.getByRole('cell').nth(4)).toContainText(await this.getValidStatus());
        await this.resetFilters(this.userRoleFilter);
    }
    //#endregion
    
    async resetFilters(filter:Locator){
        await this.clickResetButton();
        await this.waitForSpinnerToDisappear();
        if(filter !== this.userRoleFilter && filter !== this.statusFilter)
            await expect(filter).toBeEmpty();
        else
            expect(await filter.innerText()).toBe('-- Select --');
    }
}