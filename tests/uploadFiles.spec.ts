import {test, expect} from '@playwright/test'
import fs from 'fs'

// test("Testing uploads", async({page})=>{
//     await page.goto("https://testautomationpractice.blogspot.com/");

//     await page.locator("#singleFileInput").setInputFiles('uploads/text1.txt');
//     await page.getByRole('button', { name: 'Upload Single File' }).click();

//     const msgSingle = await page.locator("#singleFileStatus").textContent();
//     console.log(msgSingle);
//     expect(msgSingle).toContain('text1.txt');
//     console.log("Upload succesful");
//     await page.waitForTimeout(3000);
// })

// test("Testing multiple uploads", async({page})=>{
//     await page.goto("https://testautomationpractice.blogspot.com/");

//     await page.locator("#multipleFilesInput").setInputFiles(['uploads/text1.txt','uploads/text2.txt']);
//     await page.getByRole('button', { name: 'Upload Multiple Files' }).click();

//     const msgSingle = await page.locator("#multipleFilesStatus").textContent();
//     expect(msgSingle).toContain('text1.txt');
//     expect(msgSingle).toContain('text2.txt');
//     console.log("Upload succesful"); 
//     await page.waitForTimeout(3000);
// })

test("Testing download", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/p/download-files_25.html");
    await page.locator("#inputText").fill('Welcome');
    await page.locator('#generateTxt').click();

    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#txtDownloadLink').click()]);

    const downloadPath = 'downloads/testfile.txt';
    await download.saveAs(downloadPath);

    const fileExists = fs.existsSync(downloadPath);
    expect(fileExists).toBeTruthy();
})