import {test, expect, Locator} from '@playwright/test'

// test("Read data from all table pages", async ({page})=>{
//     await page.goto("https://datatables.net/examples/basic_init/alt_pagination.html");
//     await page.setViewportSize({width:1920, height:1080})
//     let hasMorepages = true;
    
//     const table: Locator = page.locator("table#example");

//     while(hasMorepages){
//         const rows:Locator[] = await table.locator("tbody tr").all();
//         for(let row of rows){
//             console.log(await row.innerText())
//         }
//         await page.waitForTimeout(2000);
        
//         const nextButton:Locator = page.locator("[aria-label='Next']");
//         if( (await nextButton.getAttribute('class'))?.includes('disabled')){
//             hasMorepages=false;
//         }
//         else await nextButton.click();
//     }
// })

test("Pagination table test", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");

    await page.setViewportSize({width:1920,height:1080});
    
    const pages:Locator = page.locator(".pagination > li");

    for (let i = 0; i < await pages.count(); i++) {
        await pages.nth(i).click();
        const rows = page.locator("#productTable tbody tr");

        for (let j = 0; j < await rows.count(); j++) {
            console.log(await rows.nth(j).innerText());
        }
    }

})