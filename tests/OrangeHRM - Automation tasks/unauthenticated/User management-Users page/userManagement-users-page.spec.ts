import {test, expect, Locator} from '@playwright/test'
import { stat } from 'node:fs';
import { StatementSync } from 'node:sqlite';
import { text } from 'node:stream/consumers';

test("Succesful navigation to 'Admin' page from sidebar", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {waitUntil:'load'});
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', {name: 'Dashboard'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5: Navigate to 'Admin' page
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/viewSystemUsers/);
    await expect(page.getByRole('link', { name: 'Admin' })).toContainClass('active');
})

test("All admin related tabs are displayed on 'Admin' page", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {waitUntil:'load'});
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', {name: 'Dashboard'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5: Navigate to 'Admin' page
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('link', { name: 'Admin' })).toContainClass('active');

    //Step 6: Verify that all admin tabs are displayed and dropdown tabs contain subitems
    //lists, page, basepage function potentially
    const tabs: Record<string, string[]> = {
    'User Management': ['Users'],
    'Job': ['Job Titles', 'Pay Grades', 'Employment Status', 'Job Categories', 'Work Shifts'],
    'Organization': ['General Information', 'Locations', 'Structure'],
    'Qualifications': ['Skills', 'Education', 'Licenses', 'Languages', 'Memberships'],
    'Configuration': ['Email Configuration', 'Email Subscriptions', 'Localization', 'Language Packages', 'Modules', 'Social Media Authentication', 'Register OAuth Client', 'LDAP Configuration']
    };
    for (const [tabName, expectedSubItems] of Object.entries(tabs)) {
        const tab = page.getByRole('listitem').filter({hasText:tabName});
        await expect(tab).toHaveText(tabName);
        await tab.click();
        const dropdownItems = page.getByRole('menuitem');
        await expect(dropdownItems).toHaveText(expectedSubItems);
    }
})

test("All 'System users' filters, action buttons and table headers are displayed", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {waitUntil:'load'});
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', {name: 'Dashboard'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5: Navigate to 'Admin' page
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('link', { name: 'Admin' })).toContainClass('active');

    //Step 6: Check "Username" filter is displayed
    await expect(page.getByText('Username', { exact: true })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox')).toBeVisible();

    //Step 7: Check "Employee Name" filter is dispalyed
    await expect(page.getByText('Employee Name', { exact: true })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Employee Name$/ }).getByRole('textbox')).toBeVisible();

    //Step 8: Check "User Role" and "Status" dropdown filters are displayed
    await expect(page.getByText('User Role', { exact: true })).toBeVisible();
    await expect(page.getByText('Status', { exact: true })).toBeVisible();
    await expect(page.getByText('-- Select --')).toHaveCount(2); 

    //Step 9: Check "Reset", "Search" and "Add" buttons are displayed
    await expect(page.getByRole('button', { name: /Add/i})).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();

    //Step 10: Check that user records table displays correct column headers (Username, User Role, Employee Name, Status)
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'})
    const tableColumnHeaders:Locator[] = 
        (await page.getByRole('columnheader').all()).slice(1); //1 because the checkbox on the table falls under table headers

    const headers: string[] = 
    ["Username", "User Role", "Employee Name", "Status", "Actions"];

    for(let i = 1; i < tableColumnHeaders.length; i++){ 
        expect(await tableColumnHeaders[i].innerText()).toContain(headers[i]);
    }

})

test("User list table records are filtered correctly after searching", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {waitUntil:'load'});
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', {name: 'Dashboard'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5: Navigate to 'Admin' page
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('link', {name: 'Admin'}).waitFor({state:'visible'});
    await expect(page.getByRole('link', { name: 'Admin' })).toContainClass('active');

    //Step 6: Enter valid username in "Username" input and apply filter
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    const userName:string = await page.getByRole('row').nth(1).getByRole('cell').nth(1).innerText()
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill(userName);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.getByRole('cell').nth(1)).toContainText(userName);

    //Step 7: Reset previous filter and apply valid "Employee" filter
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox')).toBeEmpty();

    const employeeName:string = await page.getByRole('row').nth(1).getByRole('cell').nth(3).innerText();
    const employeeNameParts = employeeName.split(' ');
    await page.locator('div').filter({ hasText: /^Employee Name$/ }).getByRole('textbox').fill(employeeName);
    await page.getByRole('option', { name: 'Searching....' }).waitFor({state:'hidden'});
    const suggestedEmployeeNames: Locator[] = await page.getByRole('listbox').getByRole('option').all();
    for(let option of suggestedEmployeeNames){
        const optionText = await option.innerText();
        const isMatching = employeeNameParts.every(part => optionText.includes(part));
        if(isMatching){
            await option.click();
            break;
        }
    }
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.getByRole('cell').nth(3)).toContainText(employeeName);

    //Step 8: Reset previous filter and apply "User role" filter
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.locator('div').filter({ hasText: /^Employee Name$/ }).getByRole('textbox')).toBeEmpty();

    const userRoleChoice: string = await page.getByRole('row').nth(1).getByRole('cell').nth(2).innerText();
    await page.locator('div').filter({ hasText: /^User Role/ }).getByText('-- Select --').click();
    await page.getByRole('option', { name: '-- Select --' }).waitFor({state:'visible'});
    const userRoles: Locator[] = await page.getByRole('option').all();
    for(let role of userRoles){
        if((await role.innerText()).includes(userRoleChoice)){
            await role.click();
            break;
        }
    }
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.getByRole('cell').nth(2)).toContainText(userRoleChoice);

    //Step 9: Reset previous filter and apply "Status" filter 
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    expect(await page.locator('div').filter({ hasText: /^User Role-- Select --$/ }).getByText('-- Select --').innerText()).toBe("-- Select --");
    
    const statusChoice:string = await page.getByRole('row').nth(1).getByRole('cell').nth(4).innerText();
    await page.locator('div').filter({ hasText: /^Status/ }).getByText('-- Select --').click();
    await page.getByRole('option', { name: '-- Select --' }).waitFor({state:'visible'});
    const userStatuses: Locator[] = await page.getByRole('option').all();
    for(let status of userStatuses){
        if((await status.innerText()).includes(statusChoice)){
            await status.click();
            break;
        }
    }
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.getByRole('cell').nth(4)).toContainText(statusChoice); 
})

test("New user is succesfuly created and persists in the user list", async({page})=>{
    //Step 1: navigate to OrangeHRM login website
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {waitUntil:'load'});
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2: In "Username" field, enter username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); //or use userName instead
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', {name: 'Dashboard'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5: Navigate to 'Admin' page
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('link', {name: 'Admin'}).waitFor({state:'visible'});
    await expect(page.getByRole('link', { name: 'Admin' })).toContainClass('active');
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    let employeeName:string = await page.getByRole('row').nth(1).getByRole('cell').nth(3).innerText(); //used for inmputing valid employee name

    //Step 6: Click on "Add" button
    await page.getByRole('button', { name: /Add/i}).click();
    await expect(page).toHaveURL(/saveSystemUser/);
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    //Step 7: Select "User role" for new user
    let userRoleChoice = "Admin";
    await page.locator('div').filter({ hasText: /^User Role*/ }).nth(3).getByText("-- Select --").click();
    const userRoleOptions:Locator[] = await page.getByRole('option').all();
    for(let role of userRoleOptions){
        if((await role.innerText()).includes(userRoleChoice)){
            await role.click();
            break;
        }
    }
    expect(await page.locator('div').filter({ hasText: /^User Role*/ }).nth(3).getByText(userRoleChoice).innerText()).toBe(userRoleChoice);

    //Step 8: Select "Status" for new user
    let statusChoice = "Enabled";
    await page.locator('div').filter({ hasText: /^Status*/ }).getByText("-- Select --").click();
    const statusOptions:Locator[] = await page.getByRole('option').all();
    for(let status of statusOptions){
        if((await status.innerText()).includes(statusChoice)){
            await status.click();
            break;
        }
    }
    expect(await page.locator('div').filter({ hasText: /^Status*/ }).getByText(statusChoice).innerText()).toBe(statusChoice);

    //Step 9: Input "Username" for new user
    let date = new Date();
    let dateTime:string = date.toLocaleString()
    let usernameChoice = `qa_user_Username<${dateTime}>`;
    await page.locator('div').filter({ hasText: /^Username*/ }).getByRole('textbox').fill(usernameChoice);
    expect(await page.locator('div').filter({ hasText: /^Username*/ }).getByRole('textbox').inputValue()).toBe(usernameChoice);

    //Step 10: Input "Employee name" for new user
    const employeeNameField = page.locator('div').filter({ hasText: /^Employee Name*/ }).getByRole('textbox');
    await employeeNameField.fill(employeeName);
    await page.getByRole('option', { name: 'Searching....' }).waitFor({state:'hidden'});
    await page.getByRole('option').first().click();
    const employeeNameFieldInput = await employeeNameField.inputValue();
    const employeeNameParts = employeeName.split(' ');
    const isMatching = employeeNameParts.every(part => employeeNameFieldInput.includes(part)); 
    expect(isMatching).toBe(true);
    
    //Step 11: Enter valid password in "Password" and "Confirm password" fields
    const password:string = "Testing_Password_12345"
    const passwordField = page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox');
    const confirmPasswordField = page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox');
    await passwordField.fill(password);
    expect(await passwordField.inputValue()).toBe(password);
    await confirmPasswordField.fill(password);
    expect(await confirmPasswordField.inputValue()).toBe(password);
    
    //Step 12: Click on "Save button" to add new user
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('heading', {name:'System Users'}).waitFor({state:'visible'});
    await expect(page.getByRole('heading', { name: 'System Users'})).toBeVisible();

    //Step 13: Verify persistence by searching for the new user using the "Username filter" 
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill(usernameChoice);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-loader').waitFor({state:'hidden'});
    await expect(page.getByRole('cell').nth(1)).toContainText(usernameChoice);
})