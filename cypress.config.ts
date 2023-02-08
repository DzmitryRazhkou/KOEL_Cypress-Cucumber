import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import browserify from "@badeball/cypress-cucumber-preprocessor/browserify";
import { faker } from "@faker-js/faker";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    browserify(config, {
      typescript: require.resolve("typescript"),
    })
  );

  on("task", {
    emailRegistration() {
      let user = {
        email: faker.internet.email(),
      };
      return user;
    },
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  env: {
    baseUrl: "https://bbb.testpro.io",
  },

  retries: {
    runMode: 1,
  },

  e2e: {
    specPattern: "cypress/integration/BDD/*.feature",
    setupNodeEvents,
  },
});
