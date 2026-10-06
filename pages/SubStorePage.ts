import { Page } from "@playwright/test";

export class SubStorePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * @Test6 Opens the Inventory Requisition list and captures a full-page
   * screenshot, saving it in the Screenshots folder.
   */
  async captureInventoryRequisitionScreenshot() {
    // Navigate directly to the Inventory Requisition list (avoids clicking
    // through SubStore -> Accounts -> Inventory tabs which are collapsed menus)
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/WardSupply/Inventory/InventoryRequisitionList"
    );
    await this.page.waitForTimeout(2500);

    await this.page.screenshot({
      path: "Screenshots/InventoryRequisition.png",
      fullPage: true,
    });
  }
}
