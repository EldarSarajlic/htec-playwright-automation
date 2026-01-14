import {test,expect} from '@playwright/test'

test("keyboaard actions", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    const input1 = page.locator("#input1");
    //focus on input1
    await input1.focus();

    //provide text for first input
    await page.keyboard.insertText("welcome");

    //ctrl+a to select the text that we inserted
    await page.keyboard.press('Control+A');
    //ctrl+c to copy the text that we inserted
    await page.keyboard.press('Control+C');

    //press TAB two times to focus on input2
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    //ctrl+v to paste the text into input2 field
    await page.keyboard.press('Control+V');

    //press TAB two times to focus on input3
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    //ctrl+v to paste the text into input3 field
    await page.keyboard.press('Control+V');

    await page.waitForTimeout(3000);
})