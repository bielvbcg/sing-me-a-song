import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker"
import { Recommendation } from "@prisma/client";

import { recommendationService, CreateRecommendationData } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

const recommendation: CreateRecommendationData = {
  name: faker.lorem.words(4),
  youtubeLink: "https://www.youtube.com/watch?v=e5MAg_yWsq8"
}

jest.mock("../../src/repositories/recommendationRepository")

afterEach(async () => jest.restoreAllMocks())

describe("recommendationsService test suite", () => {

  it("should create a recommendation", async () => {

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { })
    jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { })

    await recommendationService.insert(recommendation)

    expect(recommendationRepository.findByName).toBeCalled()
    expect(recommendationRepository.create).toBeCalled()
  })

  it("should not create dulplicate recommendation", async () => {

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: 0
    }))

    const promisse = recommendationService.insert(recommendation)
    expect(promisse).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" })
  })

  it("should register a upvote", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: 0
    }))
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { })

    await recommendationService.upvote(1)

    expect(recommendationRepository.updateScore).toHaveBeenCalled()
  })

  it("should register a downvote", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: 0
    }))
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: -1
    }))

    await recommendationService.downvote(1)

    expect(recommendationRepository.updateScore).toHaveBeenCalled()
  })

  it("should delete the recommendation", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: -5
    }))
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => ({
      ...recommendation,
      id: 1,
      score: -6
    }))
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { })

    await recommendationService.downvote(1)

    expect(recommendationRepository.remove).toHaveBeenCalled()
  })

  it("should not register an vote given invalid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { })

    const promisse = recommendationService.upvote(10)

    expect(promisse).rejects.toEqual({ message: "", type: "not_found" })
  })

  it("should get all recommendations", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { })

    await recommendationService.get()

    expect(recommendationRepository.findAll).toBeCalledTimes(1)
  })

  it("should get top recommendations", async () => {
    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => { })

    await recommendationService.getTop(10)

    expect(recommendationRepository.getAmountByScore).toBeCalled()
  })

  it("should get a random recommentadion with score above 10", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => 0.8)
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => ([{
      ...recommendation,
      id: 1,
      score: 10
    }]))

    await recommendationService.getRandom()

    expect(recommendationRepository.findAll).toBeCalledTimes(1)
  })

  it("should get a random recommentadion with score below 10", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => 0.5)
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => ([{
      ...recommendation,
      id: 1,
      score: 5
    }]))

    await recommendationService.getRandom()

    expect(recommendationRepository.findAll).toBeCalledTimes(1)
  })

  it("should get a random recommentadion with any score if filter doesn't match", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => 0.3)
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => ({}))
      .mockImplementationOnce((): any => ([{
        ...recommendation,
        id: 1,
        score: 5
      }]))

    await recommendationService.getRandom()

    expect(recommendationRepository.findAll).toBeCalledTimes(2)
  })

  it("should throw not_found if theres no recommendations", async () => {
    jest.spyOn(Math, "random").mockImplementation((): any => 0.1)
    jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => ([]))

    try {
      await recommendationService.getRandom()
    }
    catch (error) {
      expect(error.type).toEqual("not_found")
    }
    expect(recommendationRepository.findAll).toBeCalledTimes(2)
  })

  it("should delete the database", async () => {
    jest.spyOn(recommendationRepository, "deleteAll").mockImplementationOnce((): any => { })

    await recommendationService.deleteAll()

    expect(recommendationRepository.deleteAll).toBeCalled()
  })

})