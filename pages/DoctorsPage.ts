import { Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import doctorData from "../Data/doctor.json";

export class DoctorsPage {
  readonly page: Page;
  private searchBar: Locator;
  private orderDropdown: Locator;
  private imagingActionButton: Locator;
  private searchOrderItem: Locator;
  private proceedButton: Locator;
  private signButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // ":visible" picks the search box actually shown on screen (there are
    // several #quickFilterInput inputs, most inside collapsed panels)
    this.searchBar = page.locator("#quickFilterInput:visible");
    // Single quotes outside, double inside — avoids the CSS parse error
    this.imagingActionButton = page.locator('a[danphe-grid-action="imaging"]').first();
    this.orderDropdown = page.locator("select.form-control").first();
    // Placeholder is "search order items" (note the trailing s)
    this.searchOrderItem = page.locator("input[placeholder='search order items']");
    this.proceedButton = page.locator("button", { hasText: "Proceed" });
    this.signButton = page.locator("button.btn-primary", { hasText: "Sign" });
  }

  /**
   * @Test9 Opens In Patient Department, searches for the patient, clicks the
   * Imaging action icon, selects the Imaging order type, searches and selects
   * the order item, then clicks Proceed and Sign.
   */
  async performInpatientImagingOrder() {
    // Navigate directly to In Patient Department
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Doctors/InPatientDepartment"
    );
    await this.page.waitForTimeout(2500);

    // Search for the patient
    await CommonMethods.highlightElement(this.searchBar);
    await this.searchBar.fill(doctorData.patientName);
    await this.page.waitForTimeout(2000);

    // Click the Imaging action icon in the patient row
    await CommonMethods.highlightElement(this.imagingActionButton);
    await this.imagingActionButton.click();
    await this.page.waitForTimeout(2000);

    // Select "Imaging" from the New Order dropdown
    await CommonMethods.highlightElement(this.orderDropdown);
    await this.orderDropdown.selectOption(doctorData.Dropdown.Option);
    await this.page.waitForTimeout(1000);

    // Search and select the order item (autocomplete)
    await CommonMethods.highlightElement(this.searchOrderItem);
    await this.searchOrderItem.fill(doctorData.Dropdown.searchOrderItem);
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(1000);

    // Click "Proceed"
    await CommonMethods.highlightElement(this.proceedButton);
    await this.proceedButton.click();
    await this.page.waitForTimeout(2000);

    // Click "Sign"
    await CommonMethods.highlightElement(this.signButton);
    await this.signButton.click();
    await this.page.waitForTimeout(2000);
  }
}
