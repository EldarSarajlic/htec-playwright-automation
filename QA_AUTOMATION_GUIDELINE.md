# QA Automation Guideline — OrangeHRM Playwright Project

> **Purpose:** This document serves as a reference for generating and maintaining Playwright automation tests for the OrangeHRM demo application. It codifies the architecture, conventions, and step-by-step process that must be followed when automating any new scenario.

---

## 1. Tech Stack

| Tool | Version / Detail |
|---|---|
| **Framework** | Playwright |
| **Language** | TypeScript |
| **Runner** | `@playwright/test` |
| **Node** | ≥ 18 |
| **Env vars** | `dotenv` (`.env.dev`) |


---

## 2. Project Structure

```text
├── constants/                          # Shared constant values (widgets, tabs, headers)
│   ├── dashboard-constants.ts
│   └── adminUserManagement-constants.ts
├── fixtures/
│   └── pages.ts                        # Custom Playwright fixtures (page object injection)
├── helpers/
│   ├── auth-validator.ts               # Validates saved auth session
│   ├── dataHelper.ts                   # Generates test data (usernames, etc.)
│   └── navigationHelper.ts             # URL navigation & validation
├── pages/                              # Page Object Model classes
│   ├── BasePage.ts                     # Shared locators, waits, validations
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── AdminUserManagementPage.ts
│   └── AdminAddUserPage.ts
├── tests/
│   ├── OrangeHRM - Automation tasks/
│   │   ├── authenticated/              # Tests that reuse saved auth (storageState)
│   │   │   ├── admin-userManagement/
│   │   │   └── dashboard/
│   │   └── unauthenticated/            # Tests that handle their own login or are API-based
│   │       ├── Login page/
│   │       ├── Dashboard page/
│   │       ├── User management-Users page/
│   │       └── API tests/
├── global-setup.ts                     # Authenticates once and saves storageState
├── global-teardown.ts                  # Cleans up auth file
├── playwright.config.ts                # Project configuration
├── .env.dev                            # Environment variables (gitignored)
├── package.json
└── README.md
```

---

## 3. Authentication Flow

```
global-setup.ts
    │
    ├─ Check: Does playwright/.auth/admin.json exist AND is session valid?
    │   ├─ YES → Skip login, reuse auth
    │   └─ NO  → Launch browser → Login via LoginPage → Save storageState
    │
playwright.config.ts
    │
    ├─ "authenticated" project  → storageState: 'playwright/.auth/admin.json'
    └─ "unauthenticated" project → no storageState (handles its own login)
```

### Key files:

- **`global-setup.ts`** — Performs login, saves `playwright/.auth/admin.json`.
- **`helpers/auth-validator.ts`** — Validates existing session by making a real API call; deletes stale auth.
- **`global-teardown.ts`** — Deletes the auth file after test run (optional, currently commented out).

### Environment variables (`.env.dev`):

```
LOGIN_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
DASHBOARD_URL=https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
USERMANAGEMENT_URL=https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
USER_ROLE=Admin
STATUS=Enabled
VALID_PASSWORD=Testing_Password_12345
```

---

## 4. Page Object Model (POM) Conventions

### 4.1 BasePage

All page objects extend `BasePage`, which provides:

- **`navHelper`** — URL navigation and validation (`navigate()`, `validateUrlPartition()`).
- **`waitForSpinnerToDisappear()`** — Waits for `.oxd-table-loader` to be hidden.
- **`waitForSearchToFinish()`** — Waits for "Searching...." option to disappear.
- **Generic validators:** `validateInput()`, `validateByText()`, `validateTextboxByName()`, `validateButtonByName()`, `validateDropdownsAndSubItems()`.

### 4.2 POM Rules

1. **All selectors live in POM classes only.** Tests never contain raw locators.
2. **Locators are `private readonly`** and initialized in the constructor.
3. **Always load the DOM first.** Never guess selectors — inspect the actual page DOM before writing any locator. See Section 11 for the full locator strategy.
4. **Strictly use Playwright built-in locators** (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, etc.). Raw CSS/XPath is forbidden unless every Playwright locator has been proven insufficient, with a comment explaining why.
5. **Cache dynamic data** (e.g., `cachedUsername`, `cachedEmployeeName`) to avoid redundant lookups.
6. **Group related methods** with `#region` / `#endregion` comments for readability.
7. **Expose granular methods** — one action per method (e.g., `clickSearchButton()`, `fillUsernameFilter()`).
8. **Verification methods** should use `expect()` assertions from `@playwright/test`.

### 4.3 POM Template

```typescript
import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
// import constants if needed

export class ExamplePage extends BasePage {
    readonly page: Page;
    private readonly someElement: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.someElement = page.getByRole('link', { name: 'Example' });
    }

    async goToPage() {
        await this.navigate(process.env.EXAMPLE_URL!);
        await this.navHelper.validateUrlPartition('example');
    }

    async verifySomething() {
        await expect(this.someElement).toBeVisible();
    }
}
```

---

## 5. Fixture Conventions

### 5.1 Structure

Fixtures inject all page objects into tests via a single `pages` object:

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
// ... import all page objects

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    // ... add new page objects here
};

const testPages = base.extend<{ pages: Pages }>({
    pages: async ({ page }, use) => {
        const pages: Pages = {
            loginPage: new LoginPage(page),
            dashboardPage: new DashboardPage(page),
            // ... instantiate new page objects here
        };
        await use(pages);
    }
});

export const test = testPages;
```

### 5.2 Rules

- When a **new page object** is created, it **must** be added to: the `Pages` type, the `pages` object inside the fixture, and the import list.
- Tests import `test` from the fixtures file, **not** from `@playwright/test`.

---

## 6. Test File Conventions

### 6.1 Rules

1. **Import `test` from fixtures**, not from `@playwright/test`.
2. **Tests only call page object methods** — no direct locators or `page.*` calls in test files.
3. Use `test.beforeEach()` for shared navigation/setup within a file.
4. Use `test.step()` to group logically related actions within a single test.
5. **File naming:** `<feature>-<page>-using-fixture.spec.ts` (for fixture-based tests).
6. **File location:** Under `tests/OrangeHRM - Automation tasks/authenticated/` or `unauthenticated/` depending on auth needs.

### 6.2 Test Template

```typescript
import { test } from '../../../../fixtures/pages';

test.beforeEach(async ({ pages }) => {
    await pages.examplePage.goToPage();
});

test('Verify page loads correctly', async ({ pages }) => {
    await pages.examplePage.verifySomething();
});

test('Complex scenario with steps', async ({ pages }) => {
    await test.step('Step 1 description', async () => {
        await pages.examplePage.doActionOne();
        await pages.examplePage.verifyActionOne();
    });

    await test.step('Step 2 description', async () => {
        await pages.examplePage.doActionTwo();
        await pages.examplePage.verifyActionTwo();
    });
});
```

---

## 7. Constants

Shared data arrays and objects live in `constants/` and are imported by POM classes:

```typescript
// constants/example-constants.ts
export const EXPECTED_ITEMS = [
    'Item A',
    'Item B',
    'Item C'
] as const;

export const TAB_STRUCTURE = {
    'Tab Name': ['Sub Item 1', 'Sub Item 2'],
} as const;
```

---

## 8. Helpers

| Helper | Purpose |
|---|---|
| `NavigationHelper` | `navigate(url)`, `validateUrlPartition(urlPart)` |
| `DataHelper` | `generateValidUsername()` — timestamp-based unique usernames |
| `auth-validator` | `isAuthValid(path)` — checks cookie existence + API call to verify session |

---

## 9. Expected Prompt Format

Scenarios will be provided in the following format:

> **On OrangeHRM, go to page `{{page}}`, cover the following test case: `{{test_case}}`**

### How to interpret the prompt:

- **`{{page}}`** — The OrangeHRM page to navigate to (e.g., "PIM > Employee List", "Admin > User Management", "Leave > Apply"). This determines:
  - Which POM class to create or update.
  - Which URL / environment variable is needed.
  - Whether it falls under `authenticated/` or `unauthenticated/`.
- **`{{test_case}}`** — The specific scenario to automate. This can be a single action, a full end-to-end flow, or a list of verifications. It determines:
  - Which locators and methods are needed in the POM.
  - Whether constants are required (e.g., expected table headers, widget names).
  - How the test file should be structured (single test, multiple tests, `test.step()` grouping).

### Example prompts:

| Prompt | Interpretation |
|---|---|
| *"Go to **Admin > Job > Job Titles**, cover: verify all job titles are listed in a table with correct headers"* | Authenticated test → new `AdminJobTitlesPage` POM → verify table headers → constants file for expected headers |
| *"Go to **PIM > Employee List**, cover: search for an employee by name and verify results"* | Authenticated test → new `PimEmployeeListPage` POM → fill filter, click search, assert table row |
| *"Go to **Leave > Apply**, cover: apply for leave and verify it appears in the leave list"* | Authenticated test → new `LeaveApplyPage` POM → fill form, submit, navigate to list, verify entry |
| *"Go to **Login page**, cover: verify password field masks input"* | Unauthenticated test → update existing `LoginPage` POM → add verification method |

### What to deliver for every prompt:

1. **Test file** (`.spec.ts`) — clean, only POM method calls
2. **Page Object file(s)** (`.ts`) — new or updated
3. **Constants file** (`.ts`) — if expected values are introduced
4. **Fixtures update** (`fixtures/pages.ts`) — if a new POM was created
5. **Env update** (`.env.dev`) — if new URLs are needed

Full code for **every** file that was created or modified must be shown.

---

## 10. Step-by-Step: Automating a New Scenario

When given a new scenario to automate, follow this exact checklist:

### Step 1 — Analyze the scenario
- Identify which page(s) are involved.
- Identify which elements need to be interacted with or verified.
- Determine if it's authenticated or unauthenticated.

### Step 2 — Load the page and inspect the DOM
- Navigate to the target page in a browser or use Playwright's `codegen` tool.
- Inspect each element that needs a locator: check its ARIA role, accessible name, label, placeholder, and text content.
- Record the correct Playwright locator for each element **before** writing any code.
- **Never skip this step.** Guessing selectors without inspecting the DOM leads to broken tests.

### Step 3 — Create or update Page Object(s)
- If the page already has a POM class, add new locators and methods.
- If not, create a new POM class extending `BasePage`.
- All locators go in the constructor as `private readonly`.
- All locators must use Playwright built-in methods based on what was observed in the DOM (see Section 11).
- All actions/verifications are public async methods.

### Step 4 — Create or update constants (if needed)
- If the test verifies a list of expected values (widgets, headers, tabs), put them in a constants file.

### Step 5 — Update fixtures (if a new POM was created)
- Add the import.
- Add the type to `Pages`.
- Instantiate in the `pages` object.

### Step 6 — Write the test file
- Import `test` from fixtures.
- Use `beforeEach` for repeated navigation.
- Use `test.step()` for multi-phase tests.
- Only call POM methods — zero raw locators in tests.

### Step 7 — Update `.env.dev` (if new URLs are needed)
- Add any new environment variable URLs.

### Step 8 — Verify config
- Ensure `playwright.config.ts` includes the correct `testDir` for the new test's project (`authenticated` vs `unauthenticated`).

---

## 11. Locator Strategy

### STRICT RULE: Always Load the DOM First

**Never guess or assume selectors.** Before writing any locator in a POM class, the actual page DOM **must** be loaded and inspected to capture the correct selectors. This means:

1. **Navigate to the target page** in a browser (or use Playwright's `codegen` / DevTools).
2. **Inspect the actual DOM elements** — check their roles, accessible names, labels, text content, and attributes.
3. **Only then write the locator** in the POM class, using what was observed in the DOM.

Guessing selectors based on assumptions about the HTML structure will lead to flaky or broken tests. If the DOM cannot be inspected at the time of writing, flag it and revisit once access is available.

### Strictly Use Playwright Built-in Locators

All selectors **must** use Playwright's built-in locator methods. Raw CSS and XPath selectors are **not permitted** unless every Playwright locator has been exhausted and proven insufficient for a specific element.

**Priority order (mandatory):**

| Priority | Locator | When to Use |
|---|---|---|
| 1 | `page.getByRole('role', { name: '...' })` | Buttons, links, headings, textboxes, checkboxes, options — **always try this first** |
| 2 | `page.getByLabel('...')` | Form fields associated with a `<label>` |
| 3 | `page.getByPlaceholder('...')` | Inputs with placeholder text |
| 4 | `page.getByText('...')` | Visible text content on the page |
| 5 | `page.getByTitle('...')` | Elements with a `title` attribute |
| 6 | `page.getByAltText('...')` | Images with `alt` text |
| 7 | `page.getByTestId('...')` | Elements with `data-testid` attributes |
| 8 | `page.locator('...').filter({ hasText: /^...$/ })` | OrangeHRM custom dropdowns or compound elements — only when roles/labels don't resolve |

**What is NOT permitted (unless all above fail):**

- Raw CSS selectors like `page.locator('#myId')` or `page.locator('.my-class')`
- XPath selectors like `page.locator('//div[@class="..."]')`
- Positional-only selectors like `page.locator('div > span:nth-child(3)')` without semantic context

If a raw CSS or XPath selector is truly unavoidable, it **must** include a comment explaining why no Playwright built-in locator works for that element.

### Locator Validation Checklist

Before finalizing any locator in a POM class, verify:

- [ ] The DOM was loaded and the element was inspected
- [ ] The locator uses the highest-priority Playwright method available
- [ ] The locator is resilient (not tied to fragile DOM position or generated class names)
- [ ] The locator resolves to exactly one element (or is intentionally broad, e.g., for table rows)

---

## 12. Handling OrangeHRM-Specific Patterns

### Custom Dropdowns (not native `<select>`)

OrangeHRM uses custom dropdown components. The pattern is:

```typescript
// Click the dropdown trigger
await this.dropdownLocator.click();

// Wait for options to appear
await this.tempTextSelect.waitFor({ state: 'visible' });

// Loop through options and select the matching one
for (let option of await this.page.getByRole('option').all()) {
    if ((await option.innerText()).includes(targetValue)) {
        await option.click();
        break;
    }
}
```

### Autocomplete Fields (Employee Name)

```typescript
// Type into the field
await this.employeeNameInput.fill(name);

// Wait for "Searching...." to disappear
await this.tempTextSearching.waitFor({ state: 'hidden' });

// Select the first matching option
await this.page.getByRole('option').first().click();
```

### Table Spinner

Always wait for the table loading spinner before interacting with table data:

```typescript
await this.waitForSpinnerToDisappear(); // from BasePage
```

### Filter → Search → Verify → Reset Pattern

```typescript
async fillSomeFilter() {
    await this.waitForSpinnerToDisappear();
    await this.someFilter.fill(await this.getValidValue());
}

async verifyAndResetSomeFilter() {
    await this.waitForSpinnerToDisappear();
    await expect(this.page.getByRole('cell').nth(N)).toContainText(await this.getValidValue());
    await this.resetFilters(this.someFilter);
}
```

---

## 13. API Test Conventions (OrangeHRM)

- Located in `tests/OrangeHRM - Automation tasks/unauthenticated/API tests/`.
- Login is performed via a helper function that extracts CSRF token from the login page HTML and POSTs to `/auth/validate`.
- Reusable validation functions: `verifyPrimaryKeys()`, `verifySpecificFields()`.
- Tests are grouped with `test.describe.serial()` when order matters (e.g., create then duplicate).

---

## 14. Playwright Config Highlights

```typescript
export default defineConfig({
    timeout: 60000,
    testDir: './tests',
    fullyParallel: true,
    reporter: 'html',
    globalSetup: require.resolve('./global-setup'),

    use: {
        actionTimeout: 15000,
        navigationTimeout: 30000,
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'authenticated',
            testDir: './tests/OrangeHRM - Automation tasks/authenticated',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/admin.json',
            },
        },
        {
            name: 'unauthenticated',
            testDir: './tests/OrangeHRM - Automation tasks/unauthenticated',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});
```

---

## 15. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Test file | `<feature>-using-fixture.spec.ts` | `dashboard-page-using-fixture.spec.ts` |
| Page object | `<PageName>Page.ts` (PascalCase) | `AdminUserManagementPage.ts` |
| Constants file | `<feature>-constants.ts` (kebab) | `adminUserManagement-constants.ts` |
| Helper file | `<name>Helper.ts` (camelCase) | `dataHelper.ts` |
| Test descriptions | Descriptive sentence | `"New user is successfully created and persists in the user list"` |
| Step descriptions | Short action phrase | `"Search by username"` |

---

## 16. Quick Reference — File Delivery Checklist

When automating a new scenario, **always deliver**:

- [ ] **Test file** (`.spec.ts`) — clean, readable, only POM method calls
- [ ] **Page Object file(s)** (`.ts`) — new or updated, all selectors here
- [ ] **Constants file** (`.ts`) — if new expected values are introduced
- [ ] **Fixtures update** (`fixtures/pages.ts`) — if a new POM was created
- [ ] **Env update** (`.env.dev`) — if new URLs are needed

---

*This guideline should be consulted before generating any new test automation code for this project.*
