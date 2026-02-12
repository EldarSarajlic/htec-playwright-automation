import { test } from '../../../../fixtures/pages'

test.beforeEach(async ({ pages }) => {
    await pages.loginPage.navigate(process.env.LOGIN_URL!);
    await pages.loginPage.verifyLoginHeader();
});

test("Login successful with valid credentials", async ({ pages }) => {
    await pages.loginPage.enterUsername(process.env.ADMIN_USERNAME!);
    await pages.loginPage.enterPassword(process.env.ADMIN_PASSWORD!);
    await pages.loginPage.clickLogin();
    await pages.loginPage.verifySuccessfulLogin();
});

test("Attempt login with invalid password", async ({ pages }) => {
    await pages.loginPage.enterUsername(process.env.ADMIN_USERNAME!);
    await pages.loginPage.enterPassword("InvalidPassword");
    await pages.loginPage.clickLogin();
    await pages.loginPage.verifyInvalidCredentialsError();
});

test("Attempt login with invalid username", async ({ pages }) => {
    await pages.loginPage.enterUsername("SomeInvalidUsername5555555");
    await pages.loginPage.enterPassword("RandomPassword");
    await pages.loginPage.clickLogin();
    await pages.loginPage.verifyInvalidCredentialsError();
});

test("Attempt login with empty input fields", async ({ pages }) => {
    await pages.loginPage.enterUsername("");
    await pages.loginPage.enterPassword("");
    await pages.loginPage.clickLogin();
    await pages.loginPage.verifyRequiredFieldErrors();
});

test("Check element presence (username, password, login, forgot your password?)", async ({ pages }) => {
    await pages.loginPage.validateTextboxByName("Username");
    await pages.loginPage.validateTextboxByName("Password");
    await pages.loginPage.validateButtonByName("Login");
    await pages.loginPage.validateByText("Forgot your password?");
});

test("Verify that 'Forgot your password?' link works", async ({ pages }) => {
    await pages.loginPage.clickForgotYourPassword();
});