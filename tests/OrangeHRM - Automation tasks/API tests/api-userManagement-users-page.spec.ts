import {test, expect, APIRequestContext} from '@playwright/test'
import { log } from 'node:console';

async function loginGetSession(request: APIRequestContext){
    const loginURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    const validateURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate';

    const response = await request.get(loginURL);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const token = html.split(':token="&quot;')[1].split('&quot;')[0];
    expect(token).toBeDefined();

    const loginResponse = await request.post(validateURL, {
        form: {
            "_token": token,
            "username": "Admin",
            "password": "admin123"
        }
    });
    expect(loginResponse.status()).toBe(200);
}

function verifyPrimaryKeys(input: any, keys: string[]) {
        expect(input).toBeTruthy();
        let target = Array.isArray(input) ? input[0] : input;

        let hasData = false;
        if (target) {
            for (const property in target) {
                hasData = true;
                break; 
            }
        }

        if (hasData) {
            for (const key of keys) {
                expect(target[key]).toBeDefined();
            }
        } else {
            console.log("No data present to verify keys; skipping.");
        }
}

function verifySpecificFields(input: any, parentField: string, fields: string[]) {
    expect(input).toBeTruthy();
    const target = Array.isArray(input) ? input[0] : input;

    const specificField = target[parentField];
    expect(specificField).toBeDefined();
    expect(typeof specificField).toBe('object');

    if (specificField) {
        for (const field of fields) {
            expect(specificField[field]).toBeDefined();
        }
    }
}

const baseUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/";

test("Users list endpoint validation", async({request})=>{
    //Step 1: Login to OrangeHRM
    await loginGetSession(request);

    //Step 2: Get list of users by sending GET request to /admin/users endpoint
    const url = `${baseUrl}admin/users`;
    const response = await request.get(url);
    const responseJSON = await response.json();
    const expectedUserFields:string[] = [
        "id", "userName", "deleted", "status", "employee", "userRole"
    ];
    
    expect(response.status()).toBe(200);
    verifyPrimaryKeys(responseJSON.data, expectedUserFields)
    verifySpecificFields(responseJSON.data, "employee", ["empNumber","employeeId","firstName","middleName","lastName","terminationId"]);
    verifySpecificFields(responseJSON.data, "userRole",["id","name","displayName"]);
});

test("Users list endpoint filtering validation", async({request})=> {
    //Step 1: Login to OrangeHRM
    await loginGetSession(request);

    //Step 2: Get list of users and apply filter (ex. username filter set to "Admin")
    const url = `${baseUrl}admin/users?username=Admin`
    const response = await request.get(url);
    const responseJSON = await response.json();
    const expectedUserFields:string[] = [
        "id", "userName", "deleted", "status", "employee", "userRole"
    ];
    expect(response.status()).toBe(200);
    verifyPrimaryKeys(responseJSON.data, expectedUserFields);
    expect(responseJSON.data[0]["userName"]).toBe("Admin");
});

test.describe.serial('Test Case 3 runs before Test Case 4', () => {
    let empNumberReusable:number;
    let usernameReusable:string;
    test("Add user endpoint validation (happy path)", async({request})=>{
        //Step 1: Login to OrangeHRM
        await loginGetSession(request);

        //Step 2: Get list of users to extract empNumber from current user
        const url = `${baseUrl}admin/users`;
        const responseGet = await request.get(url);
        const responseGetJson = await responseGet.json();
        const empNumber:number = responseGetJson.data[0]["employee"]["empNumber"];
        empNumberReusable = empNumber;
        expect(responseGet.status()).toBe(200);
        expect(empNumber).toBeDefined();

        //Step 3: Send POST request to /admin/users to create new user
        const time = new Date().toLocaleTimeString('en-GB');
        const userName:string = `qa_api<${time}>`;
        usernameReusable = userName;
        const responsePost = await request.post(url, {
            data: {
                "username": userName,
                "password": "Test_Password_1234",
                "status": true,                
                "userRoleId": 1,               
                "empNumber": empNumber                
            }
        });
        const responsePostJson = await responsePost.json();
        expect(responsePost.status()).toBe(200);
        expect(responsePostJson.data.userName).toBe(userName);
        expect(responsePostJson.data.userRole.id).toBe(1);

        //Step 4: Validate persistence of newly created user
        const responseGet2 = await request.get(`${baseUrl}admin/users`);
        const responseGet2Json = await responseGet2.json();
        const persistedUser = responseGet2Json.data.find((u:any)=>u.userName === userName);
        
        expect(responseGet2.status()).toBe(200);
        expect(persistedUser).toBeDefined();
        expect(persistedUser.userName).toBe(userName);
    })

    test("Duplicate username validation (negative test)", async({request})=>{
        //Step 1: Login to OrangeHRM
        await loginGetSession(request);

        //Step 2: Get list of users to extract empNumber from current user
        const url = `${baseUrl}admin/users`;
        const responseGet = await request.get(url);
        const responseGetJson = await responseGet.json();
        expect(responseGet.status()).toBe(200);
        expect(empNumberReusable).toBeDefined();

        //Step 3: Send POST request to /admin/users with already existing username
        const responsePost = await request.post(url, {
            data: {
                "username": usernameReusable,
                "password": "Test_Password_1234",
                "status": true,                
                "userRoleId": 1,               
                "empNumber": empNumberReusable                
            }
        });
        const responsePostJson = await responsePost.json();
        expect(responsePost.status()).toBe(422);
        expect(responsePostJson.error.data.invalidParamKeys[0]).toBe("username");
    })  
})

test("Invalid password validation", async({request})=>{
    //Step 1: Login to OrangeHRM
    await loginGetSession(request);

    //Step 2: Get list of users to extract empNumber from current user
    const url = `${baseUrl}admin/users`;
    const responseGet = await request.get(url);
    const responseGetJson = await responseGet.json();
    const empNumber:number = responseGetJson.data[0]["employee"]["empNumber"];
    expect(responseGet.status()).toBe(200);
    expect(empNumber).toBeDefined();

    //Step 3: Send POST request to /admin/users with short password
    const time = new Date().toLocaleTimeString('en-GB');
    const userName:string = `qa_api<${time}>`;
    const responsePost1 = await request.post(url, {
        data: {
            "username": userName,
            "password": "test",
            "status": true,                
            "userRoleId": 1,               
            "empNumber": empNumber                
        }
    });
    const responsePostJson1 = await responsePost1.json();
    expect(responsePost1.status()).toBe(422);
    expect(responsePostJson1.error.data.invalidParamKeys[0]).toBe("password");

    //Step 4: Send POST request to /admin/users with numberless password
    const responsePost2 = await request.post(url, {
        data: {
            "username": userName,
            "password": "test_password_long",
            "status": true,                
            "userRoleId": 1,               
            "empNumber": empNumber                
        }
    });
    const responsePostJson2 = await responsePost2.json();
    expect(responsePost2.status()).toBe(422);
    expect(responsePostJson2.error.data.invalidParamKeys).toContain("password");
})

test("Invalid employee number validation", async({request})=>{
    //Step 1: Login to OrangeHRM
    await loginGetSession(request);

    //Step 2: Send POST request to /admin/users with invalid empNumber
    const url = `${baseUrl}admin/users`;
    const time = new Date().toLocaleTimeString('en-GB');
    const userName:string = `qa_api<${time}>`;
    const responsePost = await request.post(url, {
        data: {
            "username": userName,
            "password": "Test_Password_1234",
            "status": true,                
            "userRoleId": 1,               
            "empNumber": 1234567                
        }
    });
    const responsePostJson = await responsePost.json();
    expect(responsePost.status()).toBe(422);
    expect(responsePostJson.error.data.invalidParamKeys).toContain("empNumber");
})

test("Invalid status validation", async({request})=>{
    //Step 1: Login to OrangeHRM
    await loginGetSession(request);

    //Step 2: Get list of users to extract empNumber from current user
    const url = `${baseUrl}admin/users`;
    const responseGet = await request.get(url);
    const responseGetJson = await responseGet.json();
    const empNumber:number = responseGetJson.data[0]["employee"]["empNumber"];
    expect(responseGet.status()).toBe(200);
    expect(empNumber).toBeDefined();

    //Step 3: Send POST request to /admin/users with invalid status 
    const time = new Date().toLocaleTimeString('en-GB');
    const userName:string = `qa_api<${time}>`;
    const responsePost1 = await request.post(url, {
        data: {
            "username": userName,
            "password": "Test_Password_1234",
            "status": 2,                
            "userRoleId": 1,               
            "empNumber": empNumber                
        }
    });
    const responsePostJson1 = await responsePost1.json();
    expect(responsePost1.status()).toBe(422);
    expect(responsePostJson1.error.data.invalidParamKeys).toContain("status");
})



