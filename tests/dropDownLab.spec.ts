import {test, expect, Locator} from '@playwright/test'

test('Testing lab tasks', async({page})=>{
    await page.goto('https://www.bstackdemo.com/');

    //o Locate the "Order by" dropdown element.
    const dropDown:Locator = page.locator('.sort > select');

    //o Verify the dropdown is displayed and enabled.
    await expect(dropDown).toBeVisible();
    await expect(dropDown).toBeEnabled();
    
    //o Select the option "Lowest to highest" from the dropdown.
    await dropDown.selectOption('Lowest to highest');
    await page.waitForTimeout(3000);

    //o Retrieve the list of product price elements.
    const priceElements:Locator = page.locator('.val');
    const prices:string[] = await priceElements.allTextContents();

    //o Retrieve the list of product name elements.
    const namesElements:Locator = page.locator('.shelf-item__title');
    const names:string[] = await namesElements.allTextContents();

    //o Verify Product names and their prices count are equal.
    expect(namesElements.count()).toEqual(priceElements.count());
    //o Print each product name along with its corresponding price in the console.
    for (let i = 0; i < names.length; i++) {
        console.log(`${names[i]} - ${prices[i]}`);
    }
    console.log('-------------------------------------------------');
    //o Access the first element of the product prices list and the first element of the product names list.
    //o Print the lowest priced product name and its price in the console.
    console.log(`Lowest priced item: ${names[0]} - ${prices[0]}`);
   
    //o Access the last element of the product prices list and the last element of the product names list.
    //o Print the highest priced product name and its price in the console
    console.log(`Highest priced item: ${names[names.length-1]} - ${prices[prices.length-1]}`);

})