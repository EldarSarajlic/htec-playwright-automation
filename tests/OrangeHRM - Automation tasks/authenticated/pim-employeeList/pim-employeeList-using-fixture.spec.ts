import { test } from '../../../../fixtures/pages';

test.beforeEach(async ({ pages }) => {
    await pages.pimEmployeeListPage.goToPage();
});

test('New employee is successfully created and persists in the employee list', async ({ pages }) => {
    await test.step('Click Add and verify redirect to Add Employee page', async () => {
        await pages.pimEmployeeListPage.clickAddButton();
        await pages.pimAddEmployeePage.verifyAddEmployeeHeader();
    });

    await test.step('Fill in valid employee details', async () => {
        await pages.pimAddEmployeePage.enterFirstName();
        await pages.pimAddEmployeePage.enterLastName();
        await pages.pimAddEmployeePage.captureEmployeeId();
    });

    await test.step('Save new employee', async () => {
        await pages.pimAddEmployeePage.clickSave();
        await pages.pimAddEmployeePage.verifyPersonalDetailsPageLoaded();
    });

    await test.step('Verify employee persists in the employee list', async () => {
        await pages.pimEmployeeListPage.goToPage();
        await pages.pimEmployeeListPage.fillEmployeeIdFilterWithValue(await pages.pimAddEmployeePage.getEmployeeId());
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyEmployeeByIdAndReset(await pages.pimAddEmployeePage.getEmployeeId());
    });
});

test('All PIM Employee List filters are successfully applied', async ({ pages }) => {
    await test.step('Employee Name filter — fill, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.fillEmployeeNameFilter();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetEmployeeNameFilter();
    });

    await test.step('Employee Id filter — fill, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.fillEmployeeIdFilter();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetEmployeeIdFilter();
    });

    await test.step('Employment Status filter — select, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.clickEmploymentStatusDropdown();
        await pages.pimEmployeeListPage.selectEmploymentStatus();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetEmploymentStatusFilter();
    });

    await test.step('Include filter — select Current and Past Employees, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.clickIncludeDropdown();
        await pages.pimEmployeeListPage.selectCurrentAndPastEmployees();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetIncludeFilter();
    });

    await test.step('Supervisor Name filter — fill, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.fillSupervisorNameFilter();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetSupervisorNameFilter();
    });

    await test.step('Job Title filter — select, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.clickJobTitleDropdown();
        await pages.pimEmployeeListPage.selectJobTitle();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetJobTitleFilter();
    });

    await test.step('Sub Unit filter — select, search, verify and reset', async () => {
        await pages.pimEmployeeListPage.clickSubUnitDropdown();
        await pages.pimEmployeeListPage.selectFirstSubUnit();
        await pages.pimEmployeeListPage.clickSearchButton();
        await pages.pimEmployeeListPage.verifyAndResetSubUnitFilter();
    });
});
