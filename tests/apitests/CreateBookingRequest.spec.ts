import {test, expect} from '@playwright/test'
import fs from 'fs'
test("Creating post request to create booking", async({request})=>{
    const jsonFile = "testdata/post_request_body.json";
    const requestBody:any = JSON.parse(fs.readFileSync(jsonFile,'utf-8'));
    /*
    or... hard codding would be:
    const requestBody = {
        ...
    }
    */

    const response = await request.post("https://restful-booker.herokuapp.com/booking", {data:requestBody});

    const responseBody = await response.json();
    console.log(responseBody);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    expect(responseBody).toHaveProperty("bookingid");
    expect(responseBody).toHaveProperty("booking");
    expect(responseBody).toHaveProperty("booking.additionalneeds");

    const booking = responseBody.booking;

    expect(booking).toMatchObject({
        firstname: requestBody.firstname,
        lastname: requestBody.lastname,
        totalprice: requestBody.totalprice,
        depositpaid: requestBody.depositpaid,
        additionalneeds: requestBody.additionalneeds
    })

    expect(booking.bookingdates).toMatchObject({
        checkin: requestBody.bookingdates.checkin,
        checkout: requestBody.bookingdates.checkout
    })
})