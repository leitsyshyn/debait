import { PrismaClient } from "@prisma/client";
import { subYears, differenceInMilliseconds } from "date-fns";

const prisma = new PrismaClient();

// Choose a gentle exponent for a milder skew.
const skewExponent = 1.5;

function getSkewedRandomDate() {
  const now = new Date();
  const oneYearAgo = subYears(now, 1);
  const rangeInMs = differenceInMilliseconds(now, oneYearAgo);

  const r = Math.random();
  const skewedFraction = 1 - Math.pow(r, skewExponent);

  const randomMs = rangeInMs * skewedFraction;
  return new Date(oneYearAgo.getTime() + randomMs);
}

// 20% - 80% upvotes
const randomUpvoteRatio = 0.2 + 0.6 * Math.random();

function getRandomVoteValue() {
  return Math.random() < randomUpvoteRatio ? 1 : -1;
}

async function main() {
  // 1) Clear existing seed data in correct order
  await prisma.vote.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.post.deleteMany({});
  console.log("Cleared previous seed data.");

  // 2) Create a sample post (with an author)
  const post = await prisma.post.create({
    data: {
      user: {
        create: {
          name: "Post Author",
          username: "post_author",
          email: "post_author@example.com",
        },
      },
      content: "Sample post for random vote testing.",
      status: "OPEN",
    },
  });
  console.log(`Created post with ID: ${post.id}`);

  // 3) Create 2,000 unique users with one createMany() call
  const userCount = 2000;
  const usersData = Array.from({ length: userCount }, (_, i) => ({
    email: `testuser_${i}@example.com`,
    name: `Random User ${i}`,
    username: `random_user_${i}`,
  }));

  await prisma.user.createMany({
    data: usersData,
  });
  console.log(`Created ${userCount} users.`);

  // 4) Fetch the users so we have their generated IDs
  const users = await prisma.user.findMany();

  // 5) Create votes in bulk for the single post (each user votes once)
  const voteData = users.map((user) => ({
    userId: user.id,
    postId: post.id,
    value: getRandomVoteValue(),
    createdAt: getSkewedRandomDate(),
  }));

  await prisma.vote.createMany({
    data: voteData,
  });
  console.log(`Created ${voteData.length} votes for post ID: ${post.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
