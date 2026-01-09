import {test, expect} from '@playwright/test'

test("Testing labels", async ({page}) => {
    await page.goto('file:///C:/Users/EldarSarajlic/Desktop/Playwright%20automation/PlayWright/Locators/ClassDemos/app.html');

    //Input field
    await page.getByLabel('Username').fill("MyUserName");
    await page.waitForTimeout(1000);

    //Checkbox
    await page.getByLabel('Accept terms').check();
    await page.waitForTimeout(1000);

    //Text
    await expect(page.getByText('colored text')).toBeVisible();
    await page.waitForTimeout(1000);

    //Radio-button
    await page.getByLabel('Standard').click();
    await page.waitForTimeout(1000);
})