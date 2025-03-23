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
  //    If you have relationships or foreign key constraints,
  //    always delete from the 'child' side to the 'parent' side.
  //    For example, if a Post has many Votes, delete Votes first, then Posts.

  await prisma.vote.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.post.deleteMany({});

  // Alternatively, for PostgreSQL, you could do a TRUNCATE CASCADE:
  // await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Vote", "User", "Post" RESTART IDENTITY CASCADE`)

  console.log("Cleared previous seed data.");

  // 2) Create your new data
  const post = await prisma.post.create({
    data: {
      user: {
        create: {
          name: "Post Author",
          email: "post_author@example.com",
        },
      },
      content: "Sample post for random vote testing.",
      status: "OPEN",
    },
  });
  console.log(`Created post with ID: ${post.id}`);

  // Create 10,000 unique users for random voting
  const userCount = 50000;
  const userPromises = [];
  for (let i = 0; i < userCount; i++) {
    userPromises.push(
      prisma.user.create({
        data: {
          email: `testuser_${i}@example.com`,
          name: `Random User ${i}`,
        },
      })
    );
  }
  const users = await Promise.all(userPromises);
  console.log(`Created ${users.length} users.`);

  // Create votes for the single post: each user votes exactly once
  const votePromises = users.map((user) => {
    return prisma.vote.create({
      data: {
        userId: user.id,
        postId: post.id,
        value: getRandomVoteValue(),
        createdAt: getSkewedRandomDate(),
      },
    });
  });
  const votes = await Promise.all(votePromises);
  console.log(`Created ${votes.length} votes for post ID: ${post.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
