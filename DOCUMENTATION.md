# Yaksha Automation — Full Documentation

This documents the final, working test automation (10/10 passing). It reflects
every change made to get the tests green.

---

## 1. How it works

Each application module has a **page object class** in `src/pages/` holding the
element locators and the action methods. The spec file (`yaksha.spec.ts`) logs
in before every test (`beforeEach`), then calls one page method per test and
runs a URL/visibility assertion.

**You only edit the page object files.** The spec, the JSON data files, and
`commonMethods.ts` are part of the assessment and are not modified.

---

## 2. Which file handles which test

| TC | Page File | Method | Assertion the spec runs |
|----|-----------|--------|-------------------------|
| TS-1 | PharmacyPage | `handlingAlertOnRadiology()` | URL contains `/Pharmacy/Order/GoodsReceiptList` |
| TS-2 | PharmacyPage | `verifyPrintReceipt()` | URL contains `/Pharmacy/Order/GoodsReceiptList` |
| TS-3 | RadiologyPage | `verifyDataWithinLastThreeMonths()` | URL contains `/Radiology/ImagingRequisitionList` |
| TS-4 | MedicalRecordsPage | `keywordMatching()` | URL contains `/Medical-records/OutpatientList` |
| TS-5 | LoginPage | `performLoginWithInvalidCredentials()` | "Invalid credentials !" is visible |
| TS-6 | SubStorePage | `captureInventoryRequisitionScreenshot()` | URL contains `/Inventory/InventoryRequisitionList` |
| TS-7 | LoginPage | `verifyLogoutFunctionality()` | `#login` button is visible |
| TS-8 | MaternityPage | `verifyMaternityAllowanceReport()` | URL contains `/Maternity/Reports/MaternityAllowance` |
| TS-9 | DoctorsPage | `performInpatientImagingOrder()` | "Active Orders" element is visible |
| TS-10 | RadiologyPage | `filterListRequestsByDateAndType()` | URL contains `/Radiology/ImagingRequisitionList` |

---

## 3. Key techniques used (and why)

These are the patterns that made the tests reliable. They are the most useful
part of this document.

### a) Navigate with `goto` instead of clicking collapsed menu tabs
Many module sub-tabs live inside collapsed menus, so clicking them fails with
"element is not visible." Navigating straight to the Angular route avoids this
entirely and lands on exactly the page the test asserts.

```ts
await this.page.goto("https://healthapp.yaksha.com/Home/Index#/Maternity/Reports");
```

Used in: Maternity (TS-8), Medical Records (TS-4), SubStore (TS-6),
Doctors (TS-9), Radiology (TS-3, TS-10), Pharmacy (TS-1, TS-2).

### b) Resolve "strict mode violation" with a unique locator or `.first()`
When a locator matches multiple elements, Playwright refuses to act.
- The admin dropdown matched 4 toggles → use the username span:
  `page.locator("span.username", { hasText: "admin" })`
- The two date inputs share `id="date"` → `.first()` (From) and `.last()` (To)
- The Doctors search box has 3 copies (collapsed panels) → use `:visible`:
  `page.locator("#quickFilterInput:visible")`

### c) Date fields are `type="date"` → format `YYYY-MM-DD`
The JSON stores dates as `DD-MM-YYYY`, so a small helper converts them.
**The template literal must use backticks**, not quotes:

```ts
private toInputDate(ddmmyyyy: string): string {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  return `${yyyy}-${mm}-${dd}`;   // backticks — "..." would fill literal text
}
```

The Pharmacy expiry date is `type="month"` → format `YYYY-MM` (e.g. `2031-09`).

### d) Full URL routes matter
`#/Pharmacy/Order` is an invalid route ("page not found"). The working route is
`#/Pharmacy/Order/GoodsReceiptList`.

### e) Attribute-selector quoting
`a[danphe-grid-action='imaging']` with `.first()` produced a CSS parse error.
Fix: single quotes outside, double inside — `'a[danphe-grid-action="imaging"]'`.

### f) Exact placeholder text
The order-item search placeholder is `"search order items"` (trailing **s**).
A one-letter mismatch means the element is never found.

### g) Invalid login must reset first
The `beforeEach` logs in with valid credentials, so TS-5 first navigates back to
the login page before attempting the invalid login.

### h) Browser alerts need a listener before the click
For TS-1, register `page.on("dialog", ...)` **before** clicking the button that
triggers the alerts, then `dialog.accept()`.

---

## 4. Test data (JSON)

| File | Keys |
|------|------|
| login.json | `ValidLogin.ValidUserName/ValidPassword`, `InvalidLogin.*` |
| pharmacy.json | `Fields.ItemName/BatchNoField/ItemQtyField/RateField/SupplierNameField` |
| doctor.json | `patientName`, `Dropdown.Option`, `Dropdown.searchOrderItem` |
| maternity.json | `DateRange.FromDate` |
| medicalRecord.json | `DateRange.FromDate`, `PatientGender.Gender`, `DoctorName.Doctor` |
| radiology.json | `FilterDropdown.Filter`, `DateRange.FromDate/ToDate` |
| subStore.json | `SubStore.TargetInventory/ItemName` |

---

## 5. Export styles (must match the spec's imports)

- **Named** (`export class X`): LoginPage, SubStorePage, DoctorsPage
- **Default** (`export default class X`): PharmacyPage, RadiologyPage,
  MedicalRecordsPage, MaternityPage

---

## 6. Common issues & fixes (reference)

| Problem | Fix |
|---------|-----|
| `Cannot find module '@playwright/test'` | `npm install` |
| Syntax error / "No tests found" | fix braces; one bad file blocks the suite |
| "resolved to N elements" (strict mode) | unique locator, `.first()`, or `:visible` |
| "element is not visible" on a tab | use `page.goto(route)` |
| "Malformed value" on a date fill | use backticks in `toInputDate` |
| Autocomplete doesn't select | `waitForTimeout` then `keyboard.press("Enter")` |
| CSS parse error on attribute selector | single quotes outside, double inside |
| Page not found on a route | use the full route (e.g. add `/GoodsReceiptList`) |

---

*Final result: 10 / 10 passing.*
