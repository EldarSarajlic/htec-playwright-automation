import {test, expect, Locator} from '@playwright/test'

// test("Testing Text Boxes", async ({page})=>{
//     await page.goto("https://testautomationpractice.blogspot.com/");

//     //Grabbing the locator for name input
//     const nameTextBox:Locator = page.locator('#name');

//     //Check if input is visible
//     await expect(nameTextBox).toBeVisible();

//     //Check if input is enabled
//     await expect(nameTextBox).toBeEnabled();

//     //Check if attribute 'maxLength' is equal to 15
//     const maxLength: string | null = await nameTextBox.getAttribute('maxLength');
//     if(maxLength) { expect(maxLength).toBe('15'); }

//     //Fill input with a value
//     await nameTextBox.fill("John Doe");

//     //Print out the input value in the console
//     // console.log("Current input value of textBox: ", nameTextBox.textContent()); //this DOES NOT WORK because the input is not in the DOM
//     console.log("Current input value of textBox: ", await nameTextBox.inputValue());
//     await page.waitForTimeout(3000);

//     //Get the 'male' radio button
//     const maleRadioButton:Locator = await page.locator('.form-check-label[for="male"]');
//     await maleRadioButton.check();
// })

// test("Testing Radio buttons", async ({page})=>{
//     await page.goto("https://testautomationpractice.blogspot.com/");

//     //Get the 'male' radio button
//     const maleRadioButton:Locator = await page.locator('.form-check-label[for="male"]');
//     await maleRadioButton.check();
//     await expect(maleRadioButton).toBeChecked();
//     await page.waitForTimeout(3000);

//     //Get the 'female' radio button
//     const femaleRadioButton:Locator = await page.locator('.form-check-label[for="female"]');
//     await femaleRadioButton.check();
//     await expect(femaleRadioButton).toBeChecked();

//     //Check that the 'male' radio button is unchecked
//     await expect(maleRadioButton).toBeChecked({checked: false});
//     await page.waitForTimeout(3000);
// })

test("Testing Checkboxes", async ({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com");

    //Course method for mapping days
    const checkboxes: Locator = await page.locator('.form-check-input[type="checkbox"]');
    const days:string[] = await checkboxes.evaluateAll(elements =>
        elements.map(el => el.id)
    );
    
    const checkBoxes:Locator[] = days.map(index => page.getByLabel(index));

    for(let checkBox of checkBoxes){
        await checkBox.check();
        await page.waitForTimeout(1000);
    }

    // 4. Uncheck last 3 checkboxes and assert

    
        for(const checkbox of checkBoxes.slice(-3))
        {
            await checkbox.uncheck();
            await expect(checkbox).not.toBeChecked();
        }

        await page.waitForTimeout(3000);
    

    //5.Toggle checkboxes: If checked, uncheck; if unchecked, check. Assert state flipped.

    for(const checkbox of checkBoxes)
        {
        if(await checkbox.isChecked()) // true
        {
            // onlyne if checked
            await checkbox.uncheck();
            await expect(checkbox).not.toBeChecked();
        
        }
        else{
                // onlyne if not checked
                await checkbox.check();
                await expect(checkbox).toBeChecked();
        }
    }
    await page.waitForTimeout(3000);
    

    //6. Randomely select check boxes - Select checkboxes by index (1, 3, 6) and assert

    const indexes:number[]=[1,3,6];

    for(const i of indexes)
    {
        await checkBoxes[i].check();
        await expect(checkBoxes[i]).toBeChecked();

    }
    await page.waitForTimeout(5000);
 

    //7. Select the check box based on the Label
    const weekname:string="Friday";

    for(const label of days)
    {
        if(label.toLowerCase()===weekname.toLowerCase())
        {
            const checkbox=page.getByLabel(label);
            checkbox.check();
            await expect(checkbox).toBeChecked();
        }
    }
    await page.waitForTimeout(5000);

})
 
