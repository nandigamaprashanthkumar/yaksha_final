import { Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import loginData from "../Data/login.json";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#username_id");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login");
    this.loginErrorMessage = page.locator(".alert.alert-danger");
    // Target the admin username span specifically to avoid matching
    // the other dropdown-toggles (notifications, version badge, etc.)
    this.admin = page.locator("span.username", { hasText: "admin" });
    this.logOut = page.getByText("Log Out");
  }

  /**
   * @Test0 Logs in with valid credentials, then dismisses the
   * counter-activation popup if it appears.
   */
  async performLogin() {
    const username = loginData.ValidLogin.ValidUserName;
    const password = loginData.ValidLogin.ValidPassword;

    await CommonMethods.highlightElement(this.usernameInput);
    await this.usernameInput.fill(username);

    await CommonMethods.highlightElement(this.passwordInput);
    await this.passwordInput.fill(password);

    await CommonMethods.highlightElement(this.loginButton);
    await this.loginButton.click();

    await this.handleCounterPopup();
  }

  /**
   * Closes the counter-activation popup that may appear after login.
   * Safe to call even when the popup doesn't appear (try/catch).
   */
  async handleCounterPopup() {
    try {
      const closeBtn = this.page.locator("a[title='Cancel']");
      await closeBtn.waitFor({ state: "visible", timeout: 5000 });
      await closeBtn.click();
    } catch {
      // popup didn't appear this time — carry on
    }
  }

  /**
   * @Test5 Navigates back to the login page (the beforeEach already logged
   * us in), then attempts login with invalid credentials and returns the
   * resulting error message.
   */
  async performLoginWithInvalidCredentials() {
    // Reset: go back to the login page since we're logged in from beforeEach
    await this.page.goto("https://healthapp.yaksha.com/");
    await this.page.waitForTimeout(2000);

    const username = loginData.InvalidLogin.InvalidUserName;
    const password = loginData.InvalidLogin.InvalidPassword;

    await CommonMethods.highlightElement(this.usernameInput);
    await this.usernameInput.fill(username);

    await CommonMethods.highlightElement(this.passwordInput);
    await this.passwordInput.fill(password);

    await CommonMethods.highlightElement(this.loginButton);
    await this.loginButton.click();

    const errorText = await this.loginErrorMessage.textContent();
    return errorText?.trim();
  }

  /**
   * @Test7 Verifies logout from the Admin dropdown.
   */
  async verifyLogoutFunctionality() {
    await CommonMethods.highlightElement(this.admin);
    await this.admin.click();

    await CommonMethods.highlightElement(this.logOut);
    await this.logOut.click();

    await this.usernameInput.waitFor({ state: "visible" });
  }
}
