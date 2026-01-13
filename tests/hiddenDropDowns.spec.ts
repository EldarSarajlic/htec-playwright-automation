import {test, expect, Locator} from '@playwright/test'

// test("Testing Bootstrap dropdowns", async ({page})=>{
//     await page.goto('https://www.flipkart.com/');

//     const searchBox:Locator = page.locator(".lNPl8b[name='q']");
//     await searchBox.fill('smart');
//     await page.waitForTimeout(3000); //kako da znam koliko traje ovo inace? 
//     // izgleda da kao moze puno vremena se ovdje gubiti ako stavljamo puno wait time-a

//     const options:Locator = page.locator('ul > li');
//     console.log("Number of suggested options: ", await options.count());

//     for(let i=0; i < await options.count(); i++){
//         console.log("Option ",i,": ",await options.nth(i).innerText());
//     }

//     for(let i=0; i < await options.count(); i++){
//         const text = await options.nth(i).innerText();
//         if(text === 'smartphone'){
//             await options.nth(i).click();
//             break;
//         }
//     }
//     await page.waitForTimeout(5000);
// })

test('Testing hidden dropdown OrangeHRM', async ({page})=>{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    const usernameInput:Locator = page.locator("[name='username']");
    const passwordInput:Locator = page.locator("[name='password']");
    await usernameInput.fill('Admin');
    await passwordInput.fill('admin123');
    expect((await usernameInput.inputValue())).toEqual('Admin');
    expect((await passwordInput.inputValue())).toEqual('admin123');

    const loginButton:Locator = page.locator("[type='submit']");
    await loginButton.click();
    await page.waitForTimeout(3000);
    await expect(page.locator("li > a[href*='dashboard']")).toHaveClass(/active/);


    await page.locator("li > a[href*='PimModule']").click();
    await expect(page.locator("li > a[href*='PimModule']")).toHaveClass(/active/); //pristup pogledati nav bar

    expect(await page.locator("h6.oxd-topbar-header-breadcrumb-module").innerText()).toEqual('PIM'); //pristup pogledati header

    await page.locator('form i').nth(2).click();
    await page.waitForTimeout(1000);

    const jobTitleDropdown:Locator = page.locator("div[role='option']");
    console.log("number of options: ", await jobTitleDropdown.count());
    for(let i = 0; i < await jobTitleDropdown.count(); i++){
        const text = await jobTitleDropdown.nth(i).innerText();
        if(text === 'QA Lead'){
            await jobTitleDropdown.nth(i).click();
            break;
        }
    }
    const displayedText:Locator = page.locator(".oxd-select-text-input").nth(2);
    console.log(await displayedText.innerText());
    expect(await displayedText.innerText()).toEqual('QA Lead');
})