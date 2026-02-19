import {test} from '../../../../fixtures/pages'
test.beforeEach(async ({ pages }) => {
    await pages.adminUserManagementPage.goToUserManagementPage();
});

test("Successful navigation to admin-user management page", async({pages})=>{
   await pages.adminUserManagementPage.verifySidebarItemIsActive();
})

test("All admin related tabs are displayed on 'Admin' page", async({pages})=>{
    await pages.adminUserManagementPage.verifySidebarItemIsActive();
})

test("All 'System users' filters, action buttons and table headers are displayed", async({pages})=>{
    await test.step("Filters visibility validation", async() => {
        await pages.adminUserManagementPage.verifyUsernameFilterVisibility();
        await pages.adminUserManagementPage.verifiyEmployeeNameFilterVisibility();
        await pages.adminUserManagementPage.verifyUserRoleFilterVisibility();
        await pages.adminUserManagementPage.verifyStatusFilterVisibility();
    });
    
    await test.step("Buttons visibility validation", async() => {
        await pages.adminUserManagementPage.verifyAddButton();
        await pages.adminUserManagementPage.verifySearchButton();
        await pages.adminUserManagementPage.verifyResetButton();
    });
    

    await pages.adminUserManagementPage.verifyTableColumnHeaders();    
})

test("User list table records are filtered correctly after searching", async({pages})=>{
    await test.step("Search by username", async() => {
        await pages.adminUserManagementPage.fillUsernameFilter();
        await pages.adminUserManagementPage.clickSearchButton();
        await pages.adminUserManagementPage.verifyAndResetUsernameFilter();
    });

    await test.step("Search by employee name", async() => {
        await pages.adminUserManagementPage.fillEmployeeNameFilter();
        await pages.adminUserManagementPage.chooseValidEmployeeName();
        await pages.adminUserManagementPage.clickSearchButton();
        await pages.adminUserManagementPage.verifyAndResetEmployeeNameFilter();

    });

    await test.step("Search by user role", async() => {
        await pages.adminUserManagementPage.clickUserRoleDropdown();
        await pages.adminUserManagementPage.chooseUserRole();
        await pages.adminUserManagementPage.clickSearchButton();
        await pages.adminUserManagementPage.verifyAndResetUserRoleFilter(); 
    });

    await test.step("Search by status", async() => {
        await pages.adminUserManagementPage.clickStatusDropdown();
        await pages.adminUserManagementPage.chooseStatus();
        await pages.adminUserManagementPage.clickSearchButton();
        await pages.adminUserManagementPage.verifyAndResetStatusFilter(); 
    });
 
})

test("New user is succesfuly created and persists in the user list", async({pages})=> {
    let EMPLOYEE_NAME = await pages.adminUserManagementPage.getValidEmployeeName();
    await pages.adminUserManagementPage.clickAddButton();
    await pages.adminAddUserPage.verifyAddUserHeader();

    await test.step("Select user role for new user", async() => {
        await pages.adminAddUserPage.chooseUserRole();
        await pages.adminAddUserPage.verifyUserRole();
    });

    await test.step("Select status for new user", async() => {
        await pages.adminAddUserPage.chooseStatus();
        await pages.adminAddUserPage.verifyStatus();
    });

    await test.step("Enter valid username", async() => {
        await pages.adminAddUserPage.enterValidUsername();
        await pages.adminAddUserPage.verifyUsernameInput();
    });

    await test.step("Enter valid employee name", async() => {
        await pages.adminAddUserPage.enterValidEmployeeName(EMPLOYEE_NAME);
        await pages.adminAddUserPage.chooseEmployeeName();  
    });

    await test.step("Enter valid password", async() => {
        await pages.adminAddUserPage.enterValidPassword();
    })

    await pages.adminAddUserPage.clickSave();
    await pages.adminUserManagementPage.verifiyHeaderVisibility();
    
    await test.step("Search by username", async() => {
        await pages.adminUserManagementPage.fillUsernameFilter(await pages.adminAddUserPage.getUsername());
        await pages.adminUserManagementPage.clickSearchButton();
        await pages.adminUserManagementPage.verifyAndResetUsernameFilter();
    });
})