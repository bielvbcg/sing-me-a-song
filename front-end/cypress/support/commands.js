Cypress.Commands.add("resetRecommendations", () => {
  cy.log("reseting recommendations");
  cy.request("POST", "http://localhost:5000/recommendations/reset");
})

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.request("POST", "http://localhost:5000/recommendations", {
    name: recommendation.name,
    youtubeLink: recommendation.youtubeLink
  })
    .then(() => true)
})

Cypress.Commands.add("createRecommendationWithVotes", (recommendation, votes) => {
  cy.request("POST", "http://localhost:5000/recommendations", {
    name: recommendation.name,
    youtubeLink: recommendation.youtubeLink
  })

    .then(() => {
      if (votes > 0) {
        for (let i = 0; i < votes; i++) {
          cy.request("POST", `http://localhost:5000/recommendations/${recommendation.id}/upvote`)
        }
      }

      if (votes < 0) {
        for (let i = 0; i < (votes < -5 ? 6 : (votes * -1)); i++) {
          cy.request("POST", `http://localhost:5000/recommendations/${recommendation.id}/downvote`)
        }
      }
    })
})