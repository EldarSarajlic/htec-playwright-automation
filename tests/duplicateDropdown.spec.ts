import {test, expect, Locator} from '@playwright/test'
import { duplexPair } from 'node:stream';

test("Testing duplicates in dropdown", async({page})=>{
    await page.goto('https://testautomationpractice.blogspot.com/');

    const dropDown: Locator = page.locator('#colors>option');
    const optionsText:string[] = (await dropDown.allTextContents()).map(text=>text.trim());
    
    const noDuplicates = new Set<string>();
    const duplicates:string[]=[];

    for(const text of optionsText){
        if(noDuplicates.has(text)){
            duplicates.push(text);
        }
        else{
            noDuplicates.add(text);
        }
    }

    console.log('Duplicate options are --> ', duplicates);
})