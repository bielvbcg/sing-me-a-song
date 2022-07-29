/// <reference types="cypress" />

const URL = "http://localhost:3000";

describe("app test", () => {

  beforeEach(() => cy.resetRecommendations())

  it("should display home page", () => {

    cy.visit(`${URL}/`)
    cy.intercept("GET", "/recommendations").as("getRecommendations")
    cy.wait("@getRecommendations")

    cy.contains("Sing me a Song").should("be.visible")
  })
})