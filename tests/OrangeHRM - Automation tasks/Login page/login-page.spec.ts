import {test, expect} from '@playwright/test'

test("Login successful with valid credentials", async ({page})=> {

    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  
    //Step 2: In "Username" field, enter username test data credential
    //      For Username and Password fields...
    //  Method 1- extract data first from text boxes given on OrangeHRM login page
    //      const userName:string = (await page.getByText('Username : Admin').innerText()).trim().split(':')[1].trim();
    //      const password:string = (await page.getByText('Password : admin123').innerText()).trim().split(':')[1].trim();
    //                   OR...
    //  Method 2- hard code value into textboxes

    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    await expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
})

test("Attempt login with invalid password", async({page})=>{
     //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

     //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");

    //Step 3: In "password field", enter invalid password
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("invalidPassword");
    expect(await passwordInput.inputValue()).toBe("invalidPassword");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
})

test("Attempt login with invalid username", async({page})=>{
      //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

     //Step 2: In "Username" field, enter invalid username
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("UsernameInvalid"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("UsernameInvalid");

    //Step 3: In "password field", enter any password
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("invalidPassword");
    expect(await passwordInput.inputValue()).toBe("invalidPassword");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
})

test("Attempt login with empty input fields", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    const requiredValidators = page.getByText('Required');
    const numberOfValidators = await requiredValidators.count();
    expect(numberOfValidators).toEqual(2);
})

test("Check element presence (username, password, login, forgot your password?)", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeEnabled();

    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeEnabled();

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();

    await expect(page.getByText('Forgot your password?')).toBeVisible();
})

test("Verify that 'Forgot your password?' link works", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: Click on "Forgot your password?" button
    await page.getByText('Forgot your password?').click();
    await expect(page).toHaveURL(/requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
})

