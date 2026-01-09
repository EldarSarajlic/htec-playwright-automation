import{test,expect, Locator} from '@playwright/test'

test("Testing dropdowsn multiple", async ({page})=>{
    await page.goto('https://testautomationpractice.blogspot.com/');

    const dropDown:Locator = page.locator('#colors');

    // await dropDown.selectOption(['Red','Blue','Green']);
    // await page.waitForTimeout(3000);

    // await dropDown.selectOption(['red','blue','green']); //this first looks at text and THEN at value and THEN at label 
    // //so this is okay to write like this
    // await dropDown.selectOption([{value:'red'}, {value:'blue'}, {value:'green'}]);
    // await page.waitForTimeout(3000);

    // await dropDown.selectOption([{label:'Red'},{label:'Blue'},{label:'Green'}]);
    // await page.waitForTimeout(3000)

    // await dropDown.selectOption([{index:0},{index:1},{index:2}]);
    // await page.waitForTimeout(3000);

    const dropDownOptions:Locator = page.locator('#colors>option');
    console.log("Number of options: ",await dropDownOptions.count());
    expect(await dropDownOptions.count()).toEqual(7);

    const dropDownOptionsTexts:string[] = (await (dropDownOptions.allTextContents())).map(text => text.trim());
    expect(dropDownOptionsTexts).toContain('Red');
    for(let text of dropDownOptionsTexts){
        console.log(text);
    }
})