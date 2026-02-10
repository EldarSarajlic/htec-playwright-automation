import {Page, expect, Locator} from '@playwright/test';
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
    private readonly requiredError: Locator;
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
        this.requiredError =  page.getByText('Required');
        this.forgotYourPasswordLink = page.getByText('Forgot your password?');
    }

    async goToLoginPage() {
    await this.navigate(process.env.LOGIN_URL!);
}

    async verifyLoginHeader() {
        await expect(this.loginHeader).toBeVisible();
    }

    async enterUsername(username: string){
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string){
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
    await this.loginButton.click();
}

    async verifySuccessfulLogin() {
        await this.dashboardHeader.waitFor();
        await this.navHelper.validateUrlPartition('dashboard');
    }

    async verifyInvalidCredentialsError() {
        await expect(this.validationError).toBeVisible({timeout:10000});
    }

    async verifyRequiredFieldErrors() {
        await expect(this.requiredError).toHaveCount(2);
    }

    async clickForgotYourPassword(){
        await this.forgotYourPasswordLink.click();
        await this.navHelper.validateUrlPartition('requestPasswordResetCode');
        await expect(this.resetPasswordHeader).toBeVisible({timeout:10000});
    }

    async LoginUser(username:string, password:string){
        await this.goToLoginPage();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }
    //#endregion
}