import { test, expect } from '@playwright/test';
import { url } from 'node:inspector';

test("Verify page url", async ({page})=>{
    await page.goto("http://www.automationpractice.pl/index.php");

    let url:String = await page.url();
    console.log("Url: ",url);

    await expect(page).toHaveURL(/automationpractice/);
})
