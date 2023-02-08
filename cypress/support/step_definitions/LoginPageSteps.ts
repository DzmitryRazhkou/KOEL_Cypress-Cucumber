import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { Constants } from "../../utils/Constants";
import { LoginPage } from "../../integration/pages/LoginPage";
import { MainPage } from "../../integration/pages/MainPage";

const loginPage = new LoginPage();
const mainPage = new MainPage();

Given("User navigates login Page", () => {
  cy.clearLocalStorage();
  cy.clearCookies();

  cy.visit(Cypress.env("baseUrl"));
  cy.url().should("include", Constants.URL);
});

When("User types correct credentials", (table: any) => {
  table.hashes().forEach((row: any) => {
    const email = row.email; //table.rawTable[1][0]
    const psw = row.password; //table.rawTable[1][1]
    loginPage.doLogin(email, psw);
  });
});

Then("User successfully logs in {string}", (btn: any) => {
  mainPage.validateMainPage(btn);
});

Then("User navigates on the main page", () => {
  cy.url().should("include", Constants.HOME_URL);
});

When("User types incorrect credentials", (table: any) => {
  table.hashes().forEach((row: any) => {
    const email = row.email;
    const password = row.password;
    loginPage.doLogin(email, password);
  });
});

Then("Pop up error is showed up", () => {
  loginPage.errorFrame();
});

When("User provides correct credentials into POST Call body", (table: any) => {
  table.hashes().forEach((row: any) => {
    const email = row.email;
    const psw = row.password;
    loginPage.doLoginThruAPICall(email, psw);
  });
});

When("User clicks on the registration button", () => {
  loginPage.clickOnRegistrationBtn();
});

Then("User types email for registration", () => {
  cy.task("emailRegistration").then((obj: any) => {
    const email = obj.email;
    loginPage.register(email);
  });
});

Then("Successfull registration message should be {string}", (msg: string) => {
  loginPage.validateRegisteration(msg);
});

When("User clicks log out button", () => {
  loginPage.doLogOut();
});

Then("Login page title should be {string}", (pageTitle: string) => {
  loginPage.validateTitlePage(pageTitle);
});

Then("User logs out with using API Delete Call", () => {
  loginPage.doLogOutThruAPI();
});
