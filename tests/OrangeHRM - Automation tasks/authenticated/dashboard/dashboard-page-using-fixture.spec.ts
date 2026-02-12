import {test} from '../../../../fixtures/pages'

test("'Dashboard' item selected on 'Dashboard' page", async({pages})=>{
   await pages.dashboardPage.goToDashboardPage()
   await pages.dashboardPage.verifyDashboardItemIsActive();
})


test("Expected UI widgets are visible on 'Dashboard' page", async ({ pages }) => {
    await pages.dashboardPage.goToDashboardPage();
    await pages.dashboardPage.verifyDashboardItemIsActive();
    await pages.dashboardPage.verifyDashboardWidgets();
});