import {test, expect} from '@playwright/test'

test("Get booking detalis by Name - query params", async({request})=>{
    const firstname = "Jim";
    const lastname = "Brown";

    const response = await request.get("https://restful-booker.herokuapp.com/booking", {
        params:
        {
            firstname,
            lastname
        }
    });

    const responseBody = await response.json();
    console.log(responseBody);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    expect(responseBody.length).toBeGreaterThan(0);

    for(const item of responseBody){
        expect(item).toHaveProperty("bookingid");
        expect(typeof item.bookingid).toBe("number");
        expect(item.bookingid).toBeGreaterThan(0);
    }
})