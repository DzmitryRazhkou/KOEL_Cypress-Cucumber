/// <reference types="cypress" />
export {};
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      token(email: string, psw: string): Chainable<void>;
      insertTokenIntoBrowser(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("token", (email: string, psw: string) => {
  cy.request("POST", "/api/me", {
    email: email,
    password: psw,
    failOnStatus: false,
  }).then((response) => {
    expect(response.status).to.equal(200);
    Cypress.env("api-token", response.body.token);
  });
});

Cypress.Commands.add("insertTokenIntoBrowser", () => {
  cy.visit(Cypress.env("baseUrl"), {
    onBeforeLoad: (window) => {
      window.localStorage.setItem("api-token", Cypress.env("api-token"));
    },
  });
});
