import {test, expect, Page, Locator} from '@playwright/test'

export class BasePage{
    readonly page: Page;


    constructor(page:Page){
        this.page = page;
    }

     //#region Validations & Assesrtions
    async validateInput(input: Locator, expectedInput: string){
        await expect(input).toHaveValue(expectedInput);
    }
    async validateElementPresence(element?: Locator, text?:string){
        if(element){
            await expect(element).toBeVisible();
        }
        else if(text){
            await expect(this.page.getByText(text)).toBeVisible();
        }
        
        else throw Error("No parameters were provided for validateElemetPresence function!");
        
    }
    async validateTextboxByName(textbox: string){
        await expect(this.page.getByRole('textbox', {name: textbox})).toBeEditable();
    }
    async validateButtonByName(textbox: string){
        await expect(this.page.getByRole('button', {name: textbox})).toBeEnabled();
    }
    async validateUrlPartition(urlPart: string){
         await expect(this.page).toHaveURL(new RegExp(urlPart));
    }
    //#endregion

    //#region Action methods shared across pages
    //#region Page actions
    async navigate(url: string){
        await this.page.goto(url);
    }
    //#endregion
}
