import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";

const apiData = require("../../fixtures/apiData.json");
const API_BASE_URL = Cypress.env("baseUrl");

let PLAYLIST_ID: string;
let PLAYLIST_NAME: string;
let UPDATED_PLAYLIST_NAME: string;
let TOKEN: string;

const createPlaylist = (name: string) => {
  cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/playlist`,
    headers: apiData.headers.headersContentType,
    body: {
      name: name,
      songs: apiData.bodyCreatePlaylist.songs,
      rules: apiData.bodyCreatePlaylist.rules,
    },
  });
};

Given("User Generates Token", () => {
  cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/me`,
    headers: {
      "Content-Type": apiData.headers.contentType,
    },
    body: {
      email: apiData.token.email,
      password: apiData.token.password,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    TOKEN = response.body.token;
    cy.log(" =====> THE GENERATED TOKEN IS: " + TOKEN + " <===== ");
  });
});

When("User Creates New Playlist", () => {
  const name = faker.company.name();
  cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/playlist`,
    headers: {
      "Content-Type": apiData.headers.contentType,
      Authorization: "Bearer " + TOKEN,
    },
    body: {
      name: name,
      songs: apiData.bodyCreatePlaylist.songs,
      rules: apiData.bodyCreatePlaylist.rules,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    PLAYLIST_NAME = response.body.name;
    PLAYLIST_ID = response.body.id;
    cy.log(
      " =====> THE CREATED PLAYLIST NAME IS: '" + PLAYLIST_NAME + "' <===== "
    );
    cy.log(" =====> THE CREATED PLAYLIST ID IS: '" + PLAYLIST_ID + "' <===== ");
  });
});

Then("User Gets Created Playlist", () => {
  cy.request({
    method: "GET",
    url: `${API_BASE_URL}/api/playlist`,
    headers: {
      "Content-Type": apiData.headers.contentType,
      Authorization: "Bearer " + TOKEN,
    },
  }).then((resp) => {
    let count = resp.body.length;
    let listOfIdArray: any = [];

    for (let i = 0; i < count; i++) {
      let listOfId = resp.body[i].id;
      listOfIdArray.push(listOfId);
    }

    if (listOfIdArray.includes(PLAYLIST_ID)) {
      cy.log(
        " =====> THE RECEIVED PLAYLIST ID IS: '" + PLAYLIST_ID + "' <===== "
      );
    } else {
      cy.log(" =====> SOMETHING WENT WRONG <===== ");
    }

    let listOfNameArray: any = [];

    for (let i = 0; i < count; i++) {
      let listOfName = resp.body[i].name;
      listOfNameArray.push(listOfName);
    }

    if (listOfNameArray.includes(PLAYLIST_NAME)) {
      cy.log(
        " =====> THE RECEIVED PLAYLIST NAME IS: '" + PLAYLIST_NAME + "' <===== "
      );
    } else {
      cy.log(" =====> SOMETHING WENT WRONG <===== ");
    }
  });
});

Then("User Updates Playlist", () => {
  const name = faker.company.name();
  cy.request({
    method: "PUT",
    url: `${API_BASE_URL}/api/playlist/` + PLAYLIST_ID,
    headers: {
      "Content-Type": apiData.headers.contentType,
      Authorization: "Bearer " + TOKEN,
    },
    body: {
      name: name,
      songs: apiData.bodyCreatePlaylist.songs,
      rules: apiData.bodyCreatePlaylist.rules,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    UPDATED_PLAYLIST_NAME = response.body.name;
    PLAYLIST_ID = response.body.id;
    cy.log(
      " =====> THE UPDATED PLAYLIST NAME IS: '" +
        UPDATED_PLAYLIST_NAME +
        "' <===== "
    );
    cy.log(" =====> THE PLAYLIST ID STILL IS: '" + PLAYLIST_ID + "' <===== ");
  });
});

Then("User Deletes Playlist", () => {
  cy.request({
    method: "DELETE",
    url: `${API_BASE_URL}/api/playlist/` + PLAYLIST_ID,
    headers: {
      "Content-Type": apiData.headers.contentType,
      Authorization: "Bearer " + TOKEN,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    cy.log(
      " =====> THE PLAYLIST WITH ID: '" +
        PLAYLIST_ID +
        "' HAS BEEN DELETED <===== "
    );
  });
});
