/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

const recommendation1 = {
  name: faker.lorem.words(4),
  youtubeLink: "https://www.youtube.com/watch?v=pjd3E426dWQ",
  id: 1
}
const recommendation2 = {
  name: faker.lorem.words(4),
  youtubeLink: "https://www.youtube.com/watch?v=Kp7eSUU9oy8",
  id: 2
}
const recommendation3 = {
  name: faker.lorem.words(4),
  youtubeLink: "https://www.youtube.com/watch?v=iTTEBn_gze0&ab_channel=Poppy",
  id: 3
}

describe("recommendations tests", () => {

  beforeEach(() => cy.resetRecommendations())

  it("should create a recommendation", () => {

    cy.visit(URL)
    cy.intercept("GET", "/recommendations").as("getRecommendations")
    cy.wait("@getRecommendations")

    cy.get("input").first().type(recommendation1.name)
    cy.get("input").last().type(recommendation1.youtubeLink)
    cy.get("button").click()

    cy.contains("article", recommendation1.name).should("be.visible")
  })

  it("should register the votes", () => {

    cy.createRecommendation(recommendation1)
    cy.createRecommendation(recommendation2)
    cy.createRecommendation(recommendation3)

    cy.visit(URL)
    cy.intercept("GET", "/recommendations").as("getRecommendations")
    cy.wait("@getRecommendations")

    cy.get("article").then(($articles) => {

      cy.get($articles[0]).find("div svg").first().then(div => {
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
      })

      cy.get($articles[1]).find("div svg").last().then(div => {
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
      })

      cy.get($articles[2]).find("div svg").last().then(div => {
        cy.get(div).click()
        cy.get(div).click()
        cy.get(div).click()
      })

    })

    cy.get("article").should($articles => {
      expect($articles[0]).to.contain(9)
      expect($articles[1]).to.contain(-3)
      expect($articles).to.not.contain(recommendation2.name)
    })
  })

  it("should display the recommendations in the correct order", () => {

    cy.createRecommendationWithVotes(recommendation1, 5)
    cy.createRecommendationWithVotes(recommendation2, -3)
    cy.createRecommendationWithVotes(recommendation3, 2)

    cy.visit(`${URL}/top`)
    cy.intercept("GET", "/recommendations/top/10").as("getTopRecommendations")
    cy.wait("@getTopRecommendations")

    cy.get("article").should($articles => {
      expect($articles).to.have.length(3)
      expect($articles[0]).to.contain(recommendation1.name)
      expect($articles[1]).to.contain(recommendation3.name)
      expect($articles[2]).to.contain(recommendation2.name)
    })
  })

  it("should display a random recommendation", () => {

    cy.createRecommendation(recommendation1)
    cy.createRecommendation(recommendation2)
    cy.createRecommendation(recommendation3)

    cy.visit(`${URL}/random`)
    cy.intercept("GET", "/recommendations/random").as("getRandomRecommendation")
    cy.wait("@getRandomRecommendation")

    cy.get("article").should("exist").and("be.visible").and("have.length", 1)
  })

})