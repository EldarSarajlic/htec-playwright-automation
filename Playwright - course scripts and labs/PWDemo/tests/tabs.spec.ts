import {test, expect, chromium} from '@playwright/test'

test("Testing tabs", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    const parentPage = await context.newPage();
    await parentPage.goto("https://testautomationpractice.blogspot.com/");

    const [childPage] = await Promise.all([context.waitForEvent('page'),parentPage.locator("button:has-text('New Tab')").click()]);
    
    console.log("Title of parent page:", await parentPage.title());
    console.log("Title of child page: ", await childPage.title());

    const pages = context.pages();
    console.log("Title of parent page method 2: ", await pages[0].title());
    console.log("Title of child page method 2: ", await pages[1].title());
});