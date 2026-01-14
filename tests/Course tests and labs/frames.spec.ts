import {test, expect, Frame} from '@playwright/test'

test("Frame testing", async ({page})=>{
    await page.goto("https://ui.vision/demo/webtest/frames/");

    const frames:Array<Frame> =page.frames();
    console.log("Number of frames: ", frames.length);

    //Approach number 1
    const frame = page.frame({url:"https://ui.vision/demo/webtest/frames/frame_1.html"});
    if(frame){
        await frame.locator("[name='mytext1']").fill("Hello");
    }
    else{
        console.log("Frame not available");
    }

    await page.waitForTimeout(3000);
})