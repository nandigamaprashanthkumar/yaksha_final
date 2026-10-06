import { Page, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import radiologyData from "../Data/radiology.json";

export default class RadiologyPage {
  readonly page: Page;
  private filterDropdown: Locator;
  private fromDate: Locator;
  private toDate: Locator;
  private okButton: Locator;
  private dateRangeDropdown: Locator;
  private last3MonthsOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterDropdown = page.locator("select.cstm-select");
    // Both date inputs share id="date": first = From, last = To
    this.fromDate = page.locator("#date").first();
    this.toDate = page.locator("#date").last();
    this.okButton = page.locator("button.btn.green.btn-success", { hasText: "OK" });
    this.dateRangeDropdown = page.locator("span.icon-range-ddl");
    this.last3MonthsOption = page.locator("ul.dropdown-menu li a", {
      hasText: "Last 3 Months",
    });
  }

  // Convert "DD-MM-YYYY" (from JSON) to "YYYY-MM-DD" (needed by type="date")
  private toInputDate(ddmmyyyy: string): string {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * @Test3 Opens the Imaging Requisition list, selects "Last 3 Months"
   * from the date-range preset dropdown, and clicks OK.
   */
  async verifyDataWithinLastThreeMonths() {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Radiology/ImagingRequisitionList"
    );
    await this.page.waitForTimeout(2000);

    await CommonMethods.highlightElement(this.dateRangeDropdown);
    await this.dateRangeDropdown.click();
    await this.page.waitForTimeout(500);

    await CommonMethods.highlightElement(this.last3MonthsOption);
    await this.last3MonthsOption.click();

    await CommonMethods.highlightElement(this.okButton);
    await this.okButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * @Test10 Filters the Imaging Requisition list by selecting X-RAY from the
   * Filter dropdown, entering the From/To dates, and clicking OK.
   */
  async filterListRequestsByDateAndType() {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Radiology/ImagingRequisitionList"
    );
    await this.page.waitForTimeout(2000);

    await CommonMethods.highlightElement(this.filterDropdown);
    await this.filterDropdown.selectOption({ label: radiologyData.FilterDropdown.Filter });
    await this.page.waitForTimeout(500);

    await CommonMethods.highlightElement(this.fromDate);
    await this.fromDate.fill(this.toInputDate(radiologyData.DateRange.FromDate));

    await CommonMethods.highlightElement(this.toDate);
    await this.toDate.fill(this.toInputDate(radiologyData.DateRange.ToDate));

    await CommonMethods.highlightElement(this.okButton);
    await this.okButton.click();
    await this.page.waitForTimeout(1000);
  }
}
