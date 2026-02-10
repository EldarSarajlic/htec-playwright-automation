import {test, expect, APIRequestContext} from '@playwright/test'

async function loginAndGetSession(request: APIRequestContext) {
    const loginURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    const validateURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate';

    const response = await request.get(loginURL);
    const html = await response.text();
    const token = html.split(':token="&quot;')[1].split('&quot;')[0];

    const loginResponse = await request.post(validateURL, {
        form: {
            "_token": token,
            "username": "Admin",
            "password": "admin123"
        }
    });
}

test('Widgets load on dashboard page with appropriate primary key values', async({request})=>{
    const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/";

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
    const date = new Date().toLocaleDateString('en-CA');
    let time:Date = new Date();
    time.setMinutes(time.getMinutes()-time.getTimezoneOffset());
    const LocalTime = time.toISOString().split('T')[1].substring(0,5);
    //Step 1: Login to OrangeHRM
    await loginAndGetSession(request);

    //Step 2: Verify '/shortcuts' endpoint works and returns primary key values
    const shortcutsResponse = await request.get(`${baseURL}dashboard/shortcuts`);
    const shortcutsJSON = await shortcutsResponse.json();
    const expectedShortcuts = [
        'leave.assign_leave',
        'leave.leave_list',
        'leave.apply_leave',
        'leave.my_leave',
        'time.employee_timesheet',
        'time.my_timesheet'
    ];

    expect(shortcutsResponse.status()).toBe(200);
    verifyPrimaryKeys(shortcutsJSON.data,expectedShortcuts);
    
    //Step 3: Verify '/employees/action-summary' endpoint works and returns primary key values
    const actionSummaryResponse = await request.get(`${baseURL}dashboard/employees/action-summary`);
    const actionSummaryJSON = await actionSummaryResponse.json();
    const expectedActions = [
        'id',
        'group',
        'pendingActionCount'
    ];
    expect(actionSummaryResponse.status()).toBe(200);
    verifyPrimaryKeys(actionSummaryJSON.data,expectedActions);

    //Step 4: Verify '/employees/leaves' endpoint works and returns primary key values
    const leavesResponse = await request.get(`${baseURL}dashboard/employees/leaves?date=${date}`);
    const leavesJSON = await leavesResponse.json();
    const expectedLeavesData = [
        'id',
        'date',
        'lengthHours',
        'employee',
        'duration',
        'endTime',
        'startTime',
        'leaveType'
    ]
    const expectedLeavesMeta = [
        'total',
        'leavePeriodDefined',
    ];
    expect(leavesResponse.status()).toBe(200);
    verifyPrimaryKeys(leavesJSON.data,expectedLeavesData);
    verifyPrimaryKeys(leavesJSON.meta,expectedLeavesMeta);

    //Step 5: Verify '/employees/time-at-work' endpoint works and returns primary key values
    const timeAtWorkResponse = await request.get(`${baseURL}dashboard/employees/time-at-work?timezoneOffset=1&currentDate=${date}&currentTime=${LocalTime}`);
    const timeAtWorkJSON = await timeAtWorkResponse.json();
    const expectedTimeAtWorkData = [
        'workDay',
        'totalTime'
    ];
    const expectedTimeAtWorkMeta = [
        'currentUser'
    ];
    expect(timeAtWorkResponse.status()).toBe(200);
    verifyPrimaryKeys(timeAtWorkJSON.data,expectedTimeAtWorkData);
    verifyPrimaryKeys(timeAtWorkJSON.meta,expectedTimeAtWorkMeta);

    //Step 6: Verify '/buzz/feed' endpoint works and returns primary key values
    const feedResponse = await request.get(`${baseURL}buzz/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc`);
    const feedJSON = await feedResponse.json();
    const feedData = [
        'id',
        'post',
        'type',
        'liked',
        'text',
        'employee',
        'stats',
        'createdDate',
        'createdTime',
        'originalPost',
        'permission'
    ];
    const feedMeta = [
        'total'
    ];
    expect(feedResponse.status()).toBe(200);
    verifyPrimaryKeys(feedJSON.data,feedData);
    verifyPrimaryKeys(feedJSON.meta,feedMeta);
    
    //Step 7: Verify 'dashboard/employees/subunit' endpoint works and returns primary key values
    const subunitResponse = await request.get(`${baseURL}dashboard/employees/subunit`);
    const subunitJSON = await subunitResponse.json();
    const subunitData = [
        'subunit',
        'count'
    ];
    const subunitMeta = [
        'otherEmployeeCount',
        'unassignedEmployeeCount',
        'totalSubunitCount'
    ];
    expect(subunitResponse.status()).toBe(200);
    verifyPrimaryKeys(subunitJSON.data,subunitData);
    verifyPrimaryKeys(subunitJSON.meta,subunitMeta);

    //Step 8: Verify 'dashboard/employees/locations' endpoint works and returns primary key values
    const locationsResponse = await request.get(`${baseURL}dashboard/employees/locations`);
    const locationsJSON = await locationsResponse.json();
    const locationsData = [
        'location',
        'count'
    ];
    const locationsMeta = [
        'otherEmployeeCount',
        'unassignedEmployeeCount',
        'totalLocationCount'
    ];
    expect(locationsResponse.status()).toBe(200);
    verifyPrimaryKeys(locationsJSON.data,locationsData);
    verifyPrimaryKeys(locationsJSON.meta,locationsMeta);
})

test('Dashboard endpoints return 401 when user is not logged in', async({request})=>{
    const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/";

    const testShortcutsResponse = await request.get(`${baseURL}dashboard/shortcuts`)
    expect(testShortcutsResponse.status()).toBe(401);
})