import app from '../src/app.js'
import supertest from 'supertest'
import { prisma } from "../src/database.js"

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY;`
})

describe("POST /recommendations ", () => {

  const recommendation = {
    name: "pericles paramore",
    youtubeLink: "https://www.youtube.com/watch?v=pjd3E426dWQ"
  }

  it("should return 201 when test is created", async () => {
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation)
    expect(response.status).toBe(201)
  })

  it("should return 409 when recommendation already exists", async () => {

  })

  it("should return 422 given wrong body format", async () => {

  })
})

afterAll(async () => {
  await prisma.$disconnect();
});