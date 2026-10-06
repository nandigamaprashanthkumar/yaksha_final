import { Page, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import maternityData from "../Data/maternity.json";

export default class MaternityPage {
  readonly page: Page;
  public maternity: {
    maternityAllowanceReport: Locator;
    dateFrom: Locator;
    showReportBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.maternity = {
      maternityAllowanceReport: this.page.locator("div.rpt-link-container", {
        hasText: "Maternity Allowance",
      }),
      dateFrom: this.page.locator("#date").first(),
      showReportBtn: this.page.locator("button.btn.green.btn-success", {
        hasText: "Show Report",
      }),
    };
  }

  // Convert "DD-MM-YYYY" (from JSON) to "YYYY-MM-DD" (needed by type="date")
  private toInputDate(ddmmyyyy: string): string {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * @Test8 Opens the Maternity Reports section, clicks the Maternity Allowance
   * report card, enters the From date, and clicks Show Report.
   */
  public async verifyMaternityAllowanceReport() {
    // Navigate directly to Maternity Reports (avoids the collapsed-menu
    // "element not visible" problem from clicking the tab)
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Maternity/Reports"
    );
    await this.page.waitForTimeout(2000);

    await CommonMethods.highlightElement(this.maternity.maternityAllowanceReport);
    await this.maternity.maternityAllowanceReport.click();
    await this.page.waitForTimeout(1500);

    await CommonMethods.highlightElement(this.maternity.dateFrom);
    await this.maternity.dateFrom.fill(this.toInputDate(maternityData.DateRange.FromDate));

    await CommonMethods.highlightElement(this.maternity.showReportBtn);
    await this.maternity.showReportBtn.click();
    await this.page.waitForTimeout(1500);
  }
}
