import { Page, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import medicalRecordData from "../Data/medicalRecord.json";

export default class MedicalRecordsPage {
  readonly page: Page;
  public medicalRecord: {
    okButton: Locator;
    fromDate: Locator;
    searchBar: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.medicalRecord = {
      okButton: page.locator("button.btn.green.btn-success", { hasText: "OK" }),
      searchBar: page.locator("#quickFilterInput"),
      fromDate: page.locator("#date").first(),
    };
  }

  // Convert "DD-MM-YYYY" (from JSON) to "YYYY-MM-DD" (needed by type="date")
  private toInputDate(ddmmyyyy: string): string {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * @Test4 Opens the MR Outpatient List, filters by the From date, clicks OK,
   * then searches by gender keyword.
   */
  async keywordMatching() {
    // Navigate directly to MR Outpatient List (avoids the collapsed-menu
    // "element not visible" problem from clicking the tab)
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Medical-records/OutpatientList"
    );
    await this.page.waitForTimeout(2000);

    await CommonMethods.highlightElement(this.medicalRecord.fromDate);
    await this.medicalRecord.fromDate.fill(
      this.toInputDate(medicalRecordData.DateRange.FromDate)
    );

    await CommonMethods.highlightElement(this.medicalRecord.okButton);
    await this.medicalRecord.okButton.click();
    await this.page.waitForTimeout(1500);

    // Enter gender ("Female") in the search bar
    await CommonMethods.highlightElement(this.medicalRecord.searchBar);
    await this.medicalRecord.searchBar.fill(medicalRecordData.PatientGender.Gender);
    await this.page.waitForTimeout(1000);
  }
}
