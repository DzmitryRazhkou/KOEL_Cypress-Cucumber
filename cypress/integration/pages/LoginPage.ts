export class LoginPage {
  loginPageLocators = {
    EMAIL_FIELD: () => cy.get("input[type='email']"),
    PSW_FIELD: () => cy.get("input[type='password']"),
    LOGIN_BTN: () => cy.get("button"),
    ERROR_FRAME: () => cy.get(".error"),
    REGISTRATION_BTN: () => cy.get("#hel"),
    EMAIL_FIELD_REGISTRATION_PAGE: () => cy.get("#email"),
    REGISTER_BTN: () => cy.get("#button"),
    REGISTRATION_SUCCESSFULL_MSG: () => cy.get("h3"),
    LOGOUT_BTN: () => cy.get("i[class='fa fa-sign-out']"),
  };

  doLoginThruAPICall(email: string, psw: string) {
    cy.token(email, psw).then(() => {
      cy.insertTokenIntoBrowser();
    });
  }

  validateTitlePage(titlePage: any): any {
    cy.title().should("equal", titlePage);
    cy.log(" =====> " + titlePage.toUpperCase() + " <===== ");
    return this;
  }

  doLogin(email: string, password: string): void {
    this.loginPageLocators
      .EMAIL_FIELD()
      .type(email)
      .should("have.value", email);
    this.loginPageLocators
      .PSW_FIELD()
      .type(password)
      .should("have.value", password);
    this.loginPageLocators.LOGIN_BTN().should("be.visible").click();
  }

  generateString(length: any): any {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomStr = "";
    for (let i = 0; i < length; i++) {
      let randomInt = Math.floor(Math.random() * characters.length);
      randomStr += characters[randomInt];
    }
    return randomStr;
  }

  errorFrame() {
    this.loginPageLocators.ERROR_FRAME().should("have.class", "error");
  }

  clickOnRegistrationBtn() {
    this.loginPageLocators.REGISTRATION_BTN().should("be.visible").click();
  }

  register(email: string) {
    this.loginPageLocators
      .EMAIL_FIELD_REGISTRATION_PAGE()
      .type(email)
      .should("have.value", email);
    this.loginPageLocators.REGISTER_BTN().should("be.visible").click();
  }

  validateRegisteration(successMessage: string): void {
    this.loginPageLocators.REGISTRATION_SUCCESSFULL_MSG().then((el) => {
      const msg = el.text();
      cy.log(" =====> " + msg + " <===== ");
      expect(msg).to.be.include(successMessage);
    });
  }

  doLogOut() {
    this.loginPageLocators.LOGOUT_BTN().should("be.visible").click();
    cy.log(" =====> LOG OUT FROM KOEL <===== ");
  }

  doLogOutThruAPI() {
    cy.wait(100);
    cy.clearLocalStorage("api-token");
    cy.reload();
    cy.log(" =====> TOKEN HAS BEEN REMOVED FROM LOCAL STORAGE <===== ");
  }
}
