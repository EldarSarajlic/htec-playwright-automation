import {Page, expect, Locator} from '@playwright/test';
import { BasePage } from './BasePage';

const USER_ROLE = "Admin";
const STATUS  = "Enabled";
const VALID_PASSWORD = "Test_Password_User_12345"
let USERNAME = "";
let EMPLOYEE_NAME = "";

export class AdminAddUserPage extends BasePage {
    readonly page: Page;
    private readonly addUserPageHeader: Locator;
    private readonly userRoleDropdown: Locator;
    private readonly statusDropdown: Locator;
    private readonly usernameInput: Locator;
    private readonly employeeNameInput: Locator;
    private readonly passwordField:Locator;
    private readonly confirmPasswordField:Locator;
    private readonly saveButton: Locator;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.addUserPageHeader = page.getByRole('heading', { name: 'Add User' })
        this.userRoleDropdown = page.locator('div').filter({ hasText: /^User Role*/ }).nth(3).locator('div').nth(4);
        this.statusDropdown = page.locator('div').filter({ hasText: /^Status*/ }).nth(1).locator('div').nth(4)
        this.usernameInput = page.locator('div').filter({ hasText: /^Username*/ }).getByRole('textbox');
        this.employeeNameInput = page.locator('div').filter({ hasText: /^Employee Name*/ }).getByRole('textbox');
        this.passwordField = page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox')
        this.confirmPasswordField = page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async verifyAddUserHeader(){
        await expect(this.addUserPageHeader).toBeVisible();
    }

    async getDropdownOptions(){
        return this.page.getByRole('option').all();
    }

    //#region User role selection
    async chooseUserRole(){
        await this.userRoleDropdown.click();
        for(let role of await this.getDropdownOptions()){
            if((await role.innerText()).includes(USER_ROLE)){
                await role.click();
                break;
            }
        }
    }

    async verifyUserRole(){
        expect(await this.userRoleDropdown.innerText()).toBe(USER_ROLE);
    }
    //#endregion

    //#region Status selection
    async chooseStatus(){
        await this.statusDropdown.click();
        for(let status of await this.getDropdownOptions()){
            if((await status.innerText()).includes(STATUS)){
                await status.click();
                break;
            }
        }
    }

    async verifyStatus(){
        expect(await this.statusDropdown.innerText()).toBe(STATUS);
    }
    //#endregion

    //#region Username input
    generateValidUsername(): string{
        let date = new Date();
        let dateTime:string = date.toLocaleString();
        let VALID_USERNAME = `qa_user_Username<${dateTime}>`;
        USERNAME = VALID_USERNAME;
        return VALID_USERNAME;
    }

    async enterValidUsername(){
        await this.usernameInput.fill(this. generateValidUsername());
    }

    async verifyUsernameInput(){
        this.validateInput(this.usernameInput, USERNAME);
    }
    //#endregion

    //#region Employee name input
    async enterValidEmployeeName(employeeName:string){
        await this.employeeNameInput.fill(employeeName);
    }

    async chooseEmployeeName(){
        await this.waitForSearchToFinish();
        await this.page.getByRole('option').first().click();
    }
    //#endregion

    //#region Password input
    async enterValidPassword(){
        await this.passwordField.fill(VALID_PASSWORD);
        await this.confirmPasswordField.fill(VALID_PASSWORD);
    }
    //#endregion

    async clickSave(){
        await this.saveButton.click();
    }
}