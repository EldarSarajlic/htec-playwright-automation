import { test, expect, Locator } from '@playwright/test';

// test("Verify Chroe CPU load in dynamic table", async ({page})=>{
//     await page.goto("https://practice.expandtesting.com/dynamic-table");

//     //Get the table element
//     const table:Locator = page.locator("table.table tbody");

  
//     let cpuLoad = '';  //Let is function scoped
//     const rows:Locator[] = await table.locator("tr").all(); //Ged all table rows as seperate locators
//     for(let row of rows){
//         const processName:string = await row.locator("td").nth(0).innerText(); //Grab the first table data element of each table row
//         if(processName === "Chrome"){
//             cpuLoad = await row.locator("td",{hasText:"%"}).innerText(); //Grab the table data field which matches the CPU lod
//             console.log("CPU load of Chrome: ", cpuLoad);
//             break;
//         }
//     }
//     let chromeTextBox:string = await page.locator("#chrome-cpu").innerText(); //Grab the value from the yellow text box for Chrome CPU load
//     if(chromeTextBox.includes(cpuLoad)){ //Compare yellow text box value from table data value
//         console.log("CPU load of Chrome is equal");
//     }

//     expect(chromeTextBox).toContain(cpuLoad);
// })

// test("Dynamic table test but for test automation practice blogspot", async ({page})=>{
//     await page.goto("https://testautomationpractice.blogspot.com/");

//     //Grab the table element
//     const table:Locator = page.locator("#taskTable");
//     //Get all table rows as seperate locators
//     const rows:Locator[] = await table.locator("tbody > tr").all();
    
//     let memorySize = '';
//     for(let row of rows){
//         const processName = await row.locator("td").nth(0).innerText();
//         if(processName === "Firefox"){
//             memorySize = await row.locator("td",{hasNotText:"s", hasText:"MB"}).innerText();
//             console.log("Memory size of Firefox process: ", memorySize);
//             break;
//         }
//     }
//     const textBoxMemorySize: string = await page.locator("strong.firefox-memory").innerText();
//     if(textBoxMemorySize.includes(memorySize)){
//         console.log("Memory sizes are equal");
//     }
//     expect(textBoxMemorySize).toContain(memorySize);
// })

test("Dynamic table test", async ({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");

    const rows:Locator[] = await page.locator("#taskTable tbody tr").all();
    let networkSpeed = '';
    for(let row of rows){
        const processName = await row.locator("td").nth(0).innerText();
        if(processName==="Chrome"){
            networkSpeed = await row.locator("td",{hasText:"Mbps"}).innerText();
            break;
        }
    }
    const chromeNetworkSpeed:string = await page.locator(".chrome-network").innerText();
    if(chromeNetworkSpeed===networkSpeed){
        console.log("They are equal")
    }
})