import {test, expect, Locator} from '@playwright/test'

test("jQuery date time picker", async ({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");

    const dateInput:Locator = page.locator("#datepicker");

    await dateInput.click();

    //Give target date
    const year='2026';
    const month='February';
    const day='5';

    while(true){
        const currentMonth:string|null = await page.locator(".ui-datepicker-month").textContent();
        const currentYear:string|null = await page.locator(".ui-datepicker-year").textContent();

        if(currentMonth === month && currentYear === year){
            break;
        }
        //If not found go forward
        await page.locator(".ui-datepicker-next").click();
    }

    const allDates:Locator[] = await page.locator(".ui-datepicker-calendar td").all();
    for(let dt of allDates){
        const dataText = await dt.innerText();
        if(dataText == day){
            await dt.click();
            break;
        }
    }

    await page.waitForTimeout(3000);
})