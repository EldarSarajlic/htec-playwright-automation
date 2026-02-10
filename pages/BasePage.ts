import {test, expect, Page, Locator} from '@playwright/test'
import { NavigationHelper } from '../helpers/navigationHelper';

export class BasePage{
    readonly page: Page;
    protected navHelper: NavigationHelper;

    constructor(page:Page){
        this.page = page;
        this.navHelper = new NavigationHelper(page);
    }

     //#region Validations & Assesrtions
    async validateInput(input: Locator, expectedInput: string){
        await expect(input).toHaveValue(expectedInput);
    }
    async validateByText(text: string){
    await expect(this.page.getByText(text)).toBeVisible();
}
    async validateTextboxByName(textbox: string){
        await expect(this.page.getByRole('textbox', {name: textbox})).toBeEditable();
    }
    async validateButtonByName(textbox: string){
        await expect(this.page.getByRole('button', {name: textbox})).toBeEnabled();
    }
    //#endregion

    async navigate(url: string) {
    await this.navHelper.navigate(url);
}
}
