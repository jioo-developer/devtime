/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    setLoggedInState(options?: { profileComplete?: boolean }): Chainable<void>;
  }
}
