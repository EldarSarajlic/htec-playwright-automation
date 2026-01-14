import {test,expect, Locator} from '@playwright/test'

test('Test for single dropdowns', async({page}) => {
    await page.goto('https://testautomationpractice.blogspot.com/');

    const dropDown:Locator = page.locator('#country');
    await dropDown.selectOption('Germany'); //looks at the text
    //await page.waitForTimeout(3000);
    await dropDown.selectOption({value:'uk'}); //attribute in the dropdown option
    //await page.waitForTimeout(3000);
    await dropDown.selectOption({label: 'Brazil'}); //almost the same as text
    //await page.waitForTimeout(3000);
    await dropDown.selectOption({index:0}); //select manually the option by position
    // await page.waitForTimeout(3000);

    const counter:number = await dropDown.count();
    console.log("Number of options NOT VALID: ", counter); //ONLY RETURNS 1 - select option, 
    // we need to use CSS locators to go down to the options with #country > option
    const options:Locator = await page.locator('#country>option');
    console.log("Number of options: ", await options.count());
    expect(options).toHaveCount(10);

    const optionsText:string[] = (await options.allTextContents()).map(text=>text.trim());
    console.log("Options text: ",optionsText);
    expect(optionsText).toContain('France');
})