import {test, expect} from '@playwright/test'

test("'Dashboard' item selected on 'Dashboard' page", async({page})=>{
    //Step 1 - Open OrangeHRM login page
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2 - In Username input field, enter Username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); 
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3: In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4: Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);

    //Step 5: Verify "Dashboard" item in sidebar is selected
    const dashboardItem = page.getByRole('link', { name: 'Dashboard' });
    await expect(dashboardItem).toContainClass('active');
})

test("Expected UI widgets are visible on 'Dashboard' page", async({page})=>{
     //Step 1 - Open OrangeHRM login page
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    //Step 2 - In Username input field, enter Username test data credential
    const userNameInput = page.getByRole('textbox', {name: 'Username'});
    await userNameInput.fill("Admin"); 
    expect(await userNameInput.inputValue()).toBe("Admin");
    
    //Step 3 - In "password field", enter password test data credential
    const passwordInput = page.getByRole('textbox', {name:'Password'});
    await passwordInput.fill("admin123");
    expect(await passwordInput.inputValue()).toBe("admin123");

    //Step 4 - Click on "Login" button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    //Step 5 - Verify that expected Widgets are displayed
    const expectedWidgets = [
    'Time at Work',
    'My Actions',
    'Quick Launch',
    'Buzz Latest Posts',
    'Employees on Leave Today',
    'Employee Distribution by Sub Unit',
    'Employee Distribution by Location'
    ];

    let widgets:string[] = await page.locator('.orangehrm-dashboard-widget-header').allTextContents();
    for(let widget of expectedWidgets){
        expect(widgets).toContain(widget)
    }
})