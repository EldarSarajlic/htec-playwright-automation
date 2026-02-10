import {test, expect} from '@playwright/test'

    const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php/auth";
    const loginURL = `${baseURL}/login`;
    const validateURL = `${baseURL}/validate`;

test('Valid login - happy path', async({request})=>{
    //Step 1 - send GET request to /auth/login
    const response = await request.get(`${loginURL}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(':token');

    //Step 2 - verify session cookie from response headers
    const cookie = (await request.storageState()).cookies.find(c => c.name === 'orangehrm');
    expect(cookie).toBeDefined();

    //Step 3 - extract token from response body
    const html:string = await response.text();  
    const token =  html.split(':token="&quot;')[1].split('&quot;')[0];

    //Step 4 - send post request to /auth/validate with captured token, cookie and valid credentials
    const loginResponse = await request.post(`${validateURL}`, {
        form: {
            "_token": token,
            "username": "Admin",
            "password": "admin123"
        }
    });

    // Step 5 - Verify it worked
    expect(loginResponse.status()).toBe(200);
    expect(loginResponse.url()).toContain('/dashboard/index');
})

test('Invalid username', async({request})=>{
    //Step 1 - send GET request to /auth/login
    const response = await request.get(`${loginURL}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(':token');

    //Step 2 - verify session cookie from response headers
    const cookie = (await request.storageState()).cookies.find(c => c.name === 'orangehrm');
    expect(cookie).toBeDefined();

    //Step 3 - extract token from response body
    const html:string = await response.text();  
    const token =  html.split(':token="&quot;')[1].split('&quot;')[0];

    //Step 4 - send post request to /auth/validate with captured token, cookie and valid credentials
    const loginResponse = await request.post(`${validateURL}`, {
        form: {
            "_token": token,
            "username": "NotAdminUser",
            "password": "admin123"
        }
    });

    //Verify status 200 and error message in response body
    expect(loginResponse.status()).toBe(200);
    expect((await loginResponse.text()).split('message&quot;:&quot;')[1].split('&quot;')[0]).toContain('Invalid credentials');
})

test('Invalid password', async({request})=>{
    //Step 1 - send GET request to /auth/login
    const response = await request.get(`${loginURL}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(':token');

    //Step 2 - verify session cookie from response headers
    const cookie = (await request.storageState()).cookies.find(c => c.name === 'orangehrm');
    expect(cookie).toBeDefined();

    //Step 3 - extract token from response body
    const html:string = await response.text();  
    const token =  html.split(':token="&quot;')[1].split('&quot;')[0];

    //Step 4 - send post request to /auth/validate with captured token, cookie and valid credentials
    const loginResponse = await request.post(`${validateURL}`, {
        form: {
            "_token": token,
            "username": "Admin",
            "password": "wrongPassword123"
        }
    });

    //Verify status 200 and error message in response body
    expect(loginResponse.status()).toBe(200);
    expect((await loginResponse.text()).split('message&quot;:&quot;')[1].split('&quot;')[0]).toContain('Invalid credentials');
})

test('Empty fields', async({request})=>{
    //Step 1 - send GET request to /auth/login
    const response = await request.get(`${loginURL}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(':token');

    //Step 2 - verify session cookie from response headers
    const cookie = (await request.storageState()).cookies.find(c => c.name === 'orangehrm');
    expect(cookie).toBeDefined();

    //Step 3 - extract token from response body
    const html:string = await response.text();  
    const token =  html.split(':token="&quot;')[1].split('&quot;')[0];

    //Step 4 - send post request to /auth/validate with captured token, cookie and valid credentials
    const loginResponse = await request.post(`${validateURL}`, {
        form: {
            "_token": token,
            "username": "",
            "password": ""
        }
    });

    //Verify status 200 and error message in response body
    expect(loginResponse.status()).toBe(200);
    expect((await loginResponse.text()).split('message&quot;:&quot;')[1].split('&quot;')[0]).toContain('Invalid credentials');
})