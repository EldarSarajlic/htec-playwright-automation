import {test, expect} from '@playwright/test'

test("Lab testing drag and drop", async({page})=>{
    await page.goto("https://demo.guru99.com/test/drag_drop.html");

    const bankBlock = page.locator(".block14");
    const accountField = page.locator("#bank li");
    await bankBlock.dragTo(accountField);
    await page.waitForTimeout(3000);
})