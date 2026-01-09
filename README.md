# Playwright Automation Scripts 🚀

This repository contains **Playwright automation scripts** developed during my **QA Automation Internship at HTEC**.  
The goal of this repository is to document my learning progress and practical experience in **manual and automated testing** using **Playwright with TypeScript**.

---

## 📌 Purpose of This Repository

During my internship, I follow this workflow:

1. **Manual testing** of the **OrangeHRM** web application  
2. Identifying:
   - Test scenarios
   - Edge cases
   - Bugs and UI/UX issues
3. **Automating test cases** using **Playwright + TypeScript**
4. Applying **best practices** in test automation

This repository serves as:
- A learning log 📖  
- A collection of reusable automation examples  
- A reference for Playwright concepts and patterns  

---

## 🧪 Application Under Test

- **OrangeHRM Demo Site**  
  🔗 https://opensource-demo.orangehrmlive.com/

The application is used for:
- Manual testing practice
- UI automation
- Functional test scenarios
- Automation challenges (dynamic elements, tables, dropdowns, etc.)

---

## 🛠️ Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **VS Code**
- **Git & GitHub**

---

## 📂 Project Structure (Example)

```text
├── tests/
│   ├── login/
│   ├── dashboard/
│   ├── pim/
│   └── examples/
├── fixtures/
├── playwright.config.ts
├── package.json
└── README.md
```

> The structure may evolve as new concepts and features are introduced during the internship.

---

## 🧠 Topics Covered

This repository includes automation examples for:

- Login & authentication
- Storage state (skip login)
- Dropdowns (custom & native)
- Tables (static & dynamic)
- Pagination
- Date pickers
- Dialogs & alerts
- Mouse actions
- Scrolling
- Locators & selectors
- Playwright built-in locators
- Fixtures & test hooks
- Assertions & waits

---

## ▶️ Running the Tests

### Install dependencies
```bash
npm install
```

### Run all tests
```bash
npx playwright test
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

### Open Playwright Test Report
```bash
npx playwright show-report
```

---

## 🎯 Learning Goals

- Strengthen **manual testing fundamentals**
- Gain confidence in **UI automation**
- Write **clean, maintainable test code**
- Understand real-world automation challenges
- Follow **industry-standard QA practices**

---

## 📈 Progress & Updates

This repository will be **continuously updated** throughout the internship as I:
- Learn new concepts
- Improve existing tests
- Refactor code
- Apply mentor feedback

---

## 🏢 Internship

- **Company:** HTEC  
- **Role:** QA Automation Intern  
- **Focus:** Manual Testing → Automation with Playwright

---

## 📜 Disclaimer

This repository is created **for learning and practice purposes only**.  
OrangeHRM is used as a demo application.
