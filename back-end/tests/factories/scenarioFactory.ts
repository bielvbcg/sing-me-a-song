import { prisma } from "./../../src/database.js";

import { faker } from "@faker-js/faker"

export const recommendation = {
  name: faker.lorem.words(4),
  youtubeLink: "https://www.youtube.com/watch?v=pjd3E426dWQ"
}

export const wrongRecommendation = {
  nome: faker.lorem.words(4),
  link: "https://www.youtube.com/watch?v=pjd3E426dWQ"
}

export async function createRecommendation() {
  await prisma.recommendation.create({
    data: recommendation,
  });
}

export async function deleteAllData() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY CASCADE;`
}