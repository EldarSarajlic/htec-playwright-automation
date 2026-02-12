import {test} from '../../../../fixtures/pages'

test("Successful navigation to admin-user management page", async({pages})=>{
   await pages.adminUserManagementPage.goToUserManagementPage()
   await pages.adminUserManagementPage.verifySidebarItemIsActive();
})

test("All admin related tabs are displayed on 'Admin' page", async({pages})=>{
    await pages.adminUserManagementPage.goToUserManagementPage()
    await pages.adminUserManagementPage.verifySidebarItemIsActive();
})