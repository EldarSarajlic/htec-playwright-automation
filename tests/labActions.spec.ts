import { test, expect,Locator } from '@playwright/test';

test('Student Registration Form - InputText', async ({ page }) => {
  // Navigate to the form
  await page.goto('https://demo.wpeverest.com/user-registration/student-registration-form/');
  await page.waitForLoadState('domcontentloaded');

  // First Name input box
  const firstName = page.locator('#first_name');

  // Check if input is visible
  console.log('Is "First Name" displayed:', await firstName.isVisible());

  // Check if input is enabled
  console.log('Is "First Name" enabled:', await firstName.isEnabled());

  // Check if mandatory (has 'required' attribute)
  const required = await firstName.getAttribute('required');
  console.log('Is "First Name" mandatory:', required !== null);

  // Get placeholder
  const placeholder = await firstName.getAttribute('placeholder');
  console.log('Placeholder text:', placeholder);

  // Get maxlength
  const maxLength = await firstName.getAttribute('maxlength');
  console.log('Max Length:', maxLength);

  // Type text into the input
  await firstName.fill('John');

  // Get entered text
  const enteredText = await firstName.inputValue();
  console.log('Entered Text:', enteredText);

});




test.only('Student Registration Form - Radio and Checkbox', async ({ page }) => {

  await page.goto('https://demo.wpeverest.com/user-registration/student-registration-form/');

  // --- Radio Button: Male ---
  const maleRadio = page.locator('#radio_1623051748_Male');
  console.log('Is Male selected:', await maleRadio.isChecked());
  await maleRadio.check();
  console.log('Is Male selected after click:', await maleRadio.isChecked());

  // --- Checkboxes ---
  
  //Select the checkbox for "Singing".
  const singingCheckbox = page.locator('input[value="Singing"]');
  await singingCheckbox.check();
  console.log('Is Singing selected:', await singingCheckbox.isChecked());

  //Capture all available hobbies and print the count.
  const hobbies:Locator = page.locator('div.ur-field-item.field-checkbox input[type="checkbox"]');// Returns multiple elements
  const count = await hobbies.count();
  console.log('Number of Hobbies:', count);

   // Check all hobbies using a loop. 
   for (let i = 0; i < count; i++) {
    await hobbies.nth(i).check();
  }
  await page.waitForTimeout(3000);

    // Uncheck all hobbies using a loop. 
    for (let i = 0; i < count; i++) {
      await hobbies.nth(i).uncheck();
    }
    await page.waitForTimeout(3000);

    
 
  // Check last 2 hobbies
 for (let i = count - 2; i < count; i++) {
  await hobbies.nth(i).check();
}
await page.waitForTimeout(3000);


   
  // Check first 3 hobbies
  for (let i = 0; i < 3; i++) {
    await hobbies.nth(i).check();
  }
  await page.waitForTimeout(3000);


   // Check random hobbies (i=1 and i=5)
   for (let i = 0; i < count; i++) {
    if (i === 1 || i === 5) {
      await hobbies.nth(i).check({ force: true });
    }
  }
  await page.waitForTimeout(3000);



  // Check hobbies based on values using a switch-case statement
  const hobbyValue:string = 'Singing';
  switch (hobbyValue) {
    case 'Drawing':
      await page.locator('input[value="Drawing"]').check();
      break;
    case 'Singing':
      await page.locator('input[value="Singing"]').check();
      break;
    case 'Dancing':
      await page.locator('input[value="Dancing"]').check();
      break;
    case 'Sketching':
      await page.locator('input[value="Sketching"]').check();
      break;
    default:
      console.log('Hobby not found');
  }
  await page.waitForTimeout(3000);

});
