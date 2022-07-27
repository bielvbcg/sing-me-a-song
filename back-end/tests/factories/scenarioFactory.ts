import { prisma } from "./../../src/database.js";

export const recommendation = {
  name: "pericles paramore",
  youtubeLink: "https://www.youtube.com/watch?v=pjd3E426dWQ"
}

export const wrongRecommendation = {
  nome: "pericles paramore",
  link: "https://www.youtube.com/watch?v=pjd3E426dWQ"
}

export async function createRecommendation() {
  await prisma.recommendation.create({
    data: recommendation,
  });
}

export async function deleteAllData() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY;`
}