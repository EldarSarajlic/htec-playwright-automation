import {Page, expect, Locator} from '@playwright/test';
import { error } from 'node:console';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage{
    readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput:Locator;
    private readonly loginButton: Locator;
    private readonly dashboardHeader: Locator;
    private readonly loginHeader: Locator;
    private readonly resetPasswordHeader: Locator;
    private readonly validationError: Locator;
    private readonly requiedError: Locator;
    private readonly forgotYourPasswordLink: Locator;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.usernameInput = page.getByRole('textbox', {name: 'Username'});
        this.passwordInput = page.getByRole('textbox', {name:'Password'});
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
        this.loginHeader = page.getByRole('heading', { name: 'Login' });
        this.resetPasswordHeader = page.getByRole('heading', { name: 'Reset Password' });
        this.validationError = page.getByText('Invalid credentials');
        this.requiedError =  page.getByText('Required');
        this.forgotYourPasswordLink = page.getByText('Forgot your password?');
    }

    override async navigate(url: string){
        await this.page.goto(url);

        await this.validateElementPresence(this.loginHeader);
    }

    async enterUsername(username: string){
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string){
        await this.passwordInput.fill(password);
    }

    async clickLogin(){
        await this.loginButton.click();

        await Promise.race([
            this.dashboardHeader.waitFor(),
            this.validationError.waitFor(),     
            this.requiedError.first().waitFor() 
        ]);

        if(await this.dashboardHeader.isVisible()){
            await this.validateUrlPartition("dashboard")
        }
        else if (await this.requiedError.first().isVisible()) {
            await expect(this.requiedError).toHaveCount(2);
        }
         else {
            await expect(this.validationError).toBeVisible();
        }
    }

    async clickForgotYourPassword(){
        await this.forgotYourPasswordLink.click();
        await this.validateUrlPartition("requestPasswordResetCode")
        await this.validateElementPresence(this.resetPasswordHeader);
    }

    async LoginUser(username:string, password:string){
        this.navigate(process.env.LOGIN_URL!);
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }
    //#endregion
}