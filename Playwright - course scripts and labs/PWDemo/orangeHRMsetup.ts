import { chromium } from "@playwright/test";

async function authSetup(){
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    await page.fill('[name="username"]', 'Admin');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard');
    await context.storageState({ path: 'storageState.json' });

    await browser.close();
}
export default authSetup;