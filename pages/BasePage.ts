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

    async validateDropdownsAndSubItems(tabs: Record<string, string[]>){
        for (const [tabName, expectedSubItems] of Object.entries(tabs)) {
        const tab = this.page.getByRole('listitem').filter({hasText:tabName});
        await expect(tab).toHaveText(tabName);
        await tab.click();
        const dropdownItems = this.page.getByRole('menuitem');
        await expect(dropdownItems).toHaveText(expectedSubItems);
        }
    }
    //#endregion
    
    async navigate(url: string) {
    await this.navHelper.navigate(url);
}
}
