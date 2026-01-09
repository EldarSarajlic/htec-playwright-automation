import {test, expect, chromium} from '@playwright/test'

// test("Testing popups", async()=>{
//     const browser = await chromium.launch();
//     const context = await browser.newContext()

//     const parentPage = await context.newPage();
//     await parentPage.goto("https://testautomationpractice.blogspot.com/");

//     await Promise.all([parentPage.waitForEvent('popup'),await parentPage.locator('#PopUp').click()]);

//     const allPages = context.pages();
//     console.log("Number of pages: ", allPages.length);

//     for(const page of allPages){
//         const title =await page.title();
//         if(title.includes('Playwrigt')){
//             await page.locator('.getStarted_Sjon').click();
//             await page.waitForTimeout(2000);
//             await page.close(); 
//         }
//     }
// })

test("Test automated popuos", async({browser})=>{
    const context = await browser.newContext({httpCredentials:{username: 'admin', password:'admin'}});
    const page = await context.newPage();

    await page.goto("https://the-internet.herokuapp.com/basic_auth");

    await expect(page.locator('text=Congratulations')).toBeVisible();
    await page.waitForTimeout(3000);
});