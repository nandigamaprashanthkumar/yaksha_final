import { Page, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import pharmacyData from "../Data/pharmacy.json";

export default class PharmacyPage {
  readonly page: Page;
  private addNewGoodReceiptButton: Locator;
  private printReceiptButton: Locator;
  private addNewItemButton: Locator;
  private itemNameField: Locator;
  private batchNoField: Locator;
  private itemQtyField: Locator;
  private rateField: Locator;
  private expiryDateField: Locator;
  private saveButton: Locator;
  private supplierNameField: Locator;
  private invoiceField: Locator;
  private successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addNewGoodReceiptButton = page.getByText("Add New Good Receipt", { exact: true });
    this.printReceiptButton = page.locator("#saveGr");
    this.addNewItemButton = page.locator("#btn_AddNew");
    this.itemNameField = page.locator("#txt_ItemName");
    this.batchNoField = page.locator("#txt_BatchNo");
    this.itemQtyField = page.locator("#ItemQTy");
    this.rateField = page.locator("#GRItemPrice");
    this.expiryDateField = page.locator("#ExpiryDate");
    this.saveButton = page.locator("#btn_Save");
    this.supplierNameField = page.locator("#SupplierName");
    this.invoiceField = page.locator("#InvoiceId");
    this.successMessage = page.getByText("Goods Receipt is Generated and Saved");
  }

  /**
   * @Test1 Navigates to the Pharmacy Goods Receipt list, opens a new Good
   * Receipt and clicks Print without filling details so the validation
   * alerts fire; the dialog listener accepts them.
   */
  async handlingAlertOnRadiology() {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Pharmacy/Order/GoodsReceiptList"
    );
    await this.page.waitForTimeout(2000);

    await this.addNewGoodReceiptButton.click();
    await this.page.waitForTimeout(1500);

    // Register the dialog listener BEFORE the click that triggers the alerts
    const messages: string[] = [];
    this.page.on("dialog", async (dialog) => {
      messages.push(dialog.message());
      await dialog.accept();
    });

    await this.printReceiptButton.click();
    await this.page.waitForTimeout(2000);
    console.log("Alerts:", messages);
  }

  /**
   * @Test2 Adds a new Good Receipt by filling all item details (item name,
   * batch, qty, rate, expiry), saving the item modal, then filling supplier
   * and invoice and printing the receipt.
   */
  async verifyPrintReceipt() {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Pharmacy/Order/GoodsReceiptList"
    );
    await this.page.waitForTimeout(2000);

    await this.addNewGoodReceiptButton.click();
    await this.page.waitForTimeout(1500);

    await this.addNewItemButton.waitFor({ state: "visible" });
    await this.addNewItemButton.click();
    await this.page.waitForTimeout(1000);

    // Item name (danphe autocomplete)
    await this.itemNameField.fill(pharmacyData.Fields.ItemName);
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press("Enter");

    await this.batchNoField.fill(pharmacyData.Fields.BatchNoField);
    await this.itemQtyField.fill(pharmacyData.Fields.ItemQtyField);
    await this.rateField.fill(pharmacyData.Fields.RateField);
    // Expiry date is a type="month" input -> format YYYY-MM
    await this.expiryDateField.fill("2031-09");

    // Save the item modal
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);

    // Close the modal if it is still open
    const closeX = this.page.locator("a[title='Cancel']");
    if (await closeX.isVisible()) {
      await closeX.click();
    }
    await this.page.waitForTimeout(1000);

    // Supplier (autocomplete) + Invoice on the main receipt page
    await this.supplierNameField.fill(pharmacyData.Fields.SupplierNameField);
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press("Enter");
    await this.invoiceField.fill("777");

    // Print / save the receipt
    await this.printReceiptButton.click();
    await this.page.waitForTimeout(2000);
  }
}
