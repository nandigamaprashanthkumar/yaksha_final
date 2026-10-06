# Yaksha Healthcare App — Playwright + TypeScript Automation

Automated UI test suite for the Yaksha (Danphe EMR) healthcare application, built with **Playwright + TypeScript** using the **Page Object Model**.

**Application Under Test:** https://healthapp.yaksha.com
**Result:** 10 / 10 test cases passing ✅

---

## Test Cases

| TC | Description | Page File | Method |
|----|-------------|-----------|--------|
| TS-1 | Handle alert on Pharmacy module | `PharmacyPage.ts` | `handlingAlertOnRadiology()` |
| TS-2 | Validation on print receipt without details | `PharmacyPage.ts` | `verifyPrintReceipt()` |
| TS-3 | Filter data range by "Last 3 Months" | `RadiologyPage.ts` | `verifyDataWithinLastThreeMonths()` |
| TS-4 | Keyword matching in Medical Records | `MedicalRecordsPage.ts` | `keywordMatching()` |
| TS-5 | Login with invalid credentials | `LoginPage.ts` | `performLoginWithInvalidCredentials()` |
| TS-6 | Screenshot of Inventory Requisition | `SubStorePage.ts` | `captureInventoryRequisitionScreenshot()` |
| TS-7 | Verify logout functionality | `LoginPage.ts` | `verifyLogoutFunctionality()` |
| TS-8 | Maternity Allowance Report is visible | `MaternityPage.ts` | `verifyMaternityAllowanceReport()` |
| TS-9 | Add Imaging/lab order successfully | `DoctorsPage.ts` | `performInpatientImagingOrder()` |
| TS-10 | Filter records by X-RAY | `RadiologyPage.ts` | `filterListRequestsByDateAndType()` |

Every test also depends on `LoginPage.performLogin()`, which runs in the spec's `beforeEach`.

---

## Setup

```bash
npm install
npx playwright install
```

## Run

```bash
# all tests
npx playwright test

# a single test
npx playwright test -g "TS-3"

# watch the browser
npx playwright test -g "TS-3" --headed

# view the HTML report
npx playwright show-report
```

---

## Project Structure

```
src/
├── Data/          JSON test data (read-only)
├── pages/         Page Object classes (the automation logic)
└── tests/
    ├── PL1_testcases/yaksha.spec.ts   spec (calls page methods + assertions)
    └── commonMethods.ts               highlightElement helper
```

See `DOCUMENTATION.md` for the full write-up of each test case and the key techniques used.
