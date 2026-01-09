import {test, expect} from '@playwright/test'

test("Hover test", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");

    const pointMe = page.locator(".dropbtn");
    await pointMe.hover();

    const laptopsOption = page.locator(".dropdown-content a").nth(1);
    await laptopsOption.hover();
    await laptopsOption.click();

    await page.waitForTimeout(3000);
})

test("Test right click", async({page})=>{
    await page.goto("http://swisnl.github.io/jQuery-contextMenu/demo.html");
    const button = page.locator("span.context-menu-one");
    await button.click({button:'right'});
    const dialogOptionCopy = page.getByRole('listitem').filter({ hasText: 'Copy' })
    
    page.on('dialog', (dialog)=>{
        console.log("Dialog message: ", dialog.message());
        expect(dialog.message()).toContain("clicked: copy");
        dialog.accept();
    });

    await dialogOptionCopy.click();
    await page.waitForTimeout(2000);
})

test("Double click", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    const button = page.getByRole('button', { name: 'Copy Text' });
    await button.dblclick();
    expect(await page.locator("#field2").inputValue()).toEqual("Hello World!");
})

test("Drag and drop", async ({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com");
    const draggable = page.locator("#draggable");
    const droppable = page.locator("#droppable");
    // await draggable.hover();
    // await page.mouse.down();
    // await droppable.hover();
    // await page.mouse.up();

    //ALTERNATIVE METHOD:
    await draggable.dragTo(droppable);
    await page.waitForTimeout(5000);
})