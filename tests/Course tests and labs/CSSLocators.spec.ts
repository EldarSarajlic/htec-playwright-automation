import {test, expect} from '@playwright/test'

test("CSS Locators", async ({page}) => {
   await page.goto("https://demowebshop.tricentis.com/");

//    await page.locator('input#small-searchterms').fill("T shirt");
//    await page.waitForTimeout(3000);

//    await page.locator('input.search-box-text').fill("T-shirt");
//    await page.waitForTimeout(3000)

//    await page.locator("input[name='q']").fill("T-shirt");
//    await page.waitForTimeout(3000)

//     await page.locator("input.search-box-text[value='Search store']").fill("T-shirt");
//     await page.waitForTimeout(3000)
})