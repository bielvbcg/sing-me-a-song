import app from '../src/app.js'
import supertest from 'supertest'
import { prisma } from "../src/database.js"
import * as scenarioFactory from "./factories/scenarioFactory.js"

beforeEach(async () => {
  await scenarioFactory.deleteAllData()
})

describe("POST /recommendations ", () => {

  it("should return 201 when test is created", async () => {
    const recommendation = scenarioFactory.recommendation

    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation)

    expect(response.statusCode).toBe(201)
  })

  it("should return 409 when recommendation name already exists", async () => {
    await scenarioFactory.createRecommendation()
    const recommendation = scenarioFactory.recommendation

    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation)

    expect(response.statusCode).toBe(409)
  })

  it("should return 422 given wrong body format", async () => {
    const recommendation = scenarioFactory.wrongRecommendation

    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation)

    expect(response.statusCode).toBe(422)
  })
})

afterAll(async () => {
  await prisma.$disconnect();
});