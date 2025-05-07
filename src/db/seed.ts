import { PrismaClient, PostStatus, CommentType } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Configurable constants (override via environment variables if desired)
const NUM_USERS = Number(process.env.NUM_USERS) || 100;
const POSTS_PER_USER = Number(process.env.POSTS_PER_USER) || 10;
const COMMENTS_PER_POST = Number(process.env.COMMENTS_PER_POST) || 2;
const VOTES_PER_POST = Number(process.env.VOTES_PER_POST) || 90;
const COMMENT_VOTES_PER_COMMENT =
  Number(process.env.COMMENT_VOTES_PER_COMMENT) || 10;
const FOLLOWS_PER_USER = Number(process.env.FOLLOWS_PER_USER) || 25;

// Define the time range for our one-year span.
const now = new Date();
const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

/**
 * Returns a random date between the provided start and end dates.
 */
const randomDateBetween = (start: Date, end: Date): Date => {
  return faker.date.between({ from: start, to: end });
};

async function main() {
  console.log(`Seeding data:
  - ${NUM_USERS} users with join dates in the past year
  - Each user: ${POSTS_PER_USER} posts (interleaved randomly)
  - Each post: ${COMMENTS_PER_POST} comments
  - Each post: up to ${VOTES_PER_POST} votes (max one vote per user)
  - Each comment: up to ${COMMENT_VOTES_PER_COMMENT} votes (max one vote per user)
  - Each user: follows ${FOLLOWS_PER_USER} other users`);

  // --- Create Users ---
  // Store each created user along with its joinDate
  const users: Array<{ id: string; createdAt: Date }> = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const joinDate = randomDateBetween(oneYearAgo, now);
    const userData = {
      name: faker.name.fullName(),
      username: faker.internet.userName(), // unique
      bio: faker.lorem.sentence(),
      email: faker.internet.email(), // unique
      image: faker.image.avatar(),
      emailVerified: faker.datatype.boolean() ? faker.date.past() : null,
      hashedPassword: faker.internet.password(),
      createdAt: joinDate, // simulate that the user joined at this time
      // role, plan, two-factor and updatedAt use defaults.
    };

    const user = await prisma.user.create({ data: userData });
    users.push({ id: user.id, createdAt: joinDate });
  }
  console.log(`Created ${users.length} users.`);

  // --- Generate Posts Data for All Users ---
  type PostSeedData = {
    userId: string;
    content: string;
    status: PostStatus;
    createdAt: Date;
  };

  const allPostsData: PostSeedData[] = [];
  for (const user of users) {
    for (let i = 0; i < POSTS_PER_USER; i++) {
      const wordCount = faker.number.int({ min: 10, max: 200 });
      const content = faker.lorem.words(wordCount);
      const status = faker.helpers.arrayElement([
        PostStatus.OPEN,
        PostStatus.CLOSED,
      ]);
      // Ensure the post is created after the user joined.
      const postDate = randomDateBetween(user.createdAt, now);

      allPostsData.push({
        userId: user.id,
        content,
        status,
        createdAt: postDate,
      });
    }
  }
  // Shuffle posts so they are interleaved among users
  const shuffledPostsData = faker.helpers.shuffle(allPostsData);

  // --- Insert Posts ---
  // Store posts with their creation dates for further seeding.
  const posts: Array<{ id: string; userId: string; createdAt: Date }> = [];
  for (const postData of shuffledPostsData) {
    const post = await prisma.post.create({
      data: postData,
    });
    posts.push({
      id: post.id,
      userId: postData.userId,
      createdAt: postData.createdAt,
    });
  }
  console.log(`Created ${posts.length} posts.`);

  // --- Create Comments for Each Post ---
  // Save created comments to seed comment votes later.
  const comments: Array<{ id: string; postId: string; createdAt: Date }> = [];
  for (const post of posts) {
    for (let i = 0; i < COMMENTS_PER_POST; i++) {
      const wordCount = faker.number.int({ min: 2, max: 50 });
      const commentContent = faker.lorem.words(wordCount);
      // Comments should be created between the post's creation time and now.
      const commentDate = randomDateBetween(post.createdAt, now);
      // Select a random user (may be different from the post's author)
      const randomUser = faker.helpers.arrayElement(users);

      const comment = await prisma.comment.create({
        data: {
          userId: randomUser.id,
          postId: post.id,
          content: commentContent,
          type: faker.helpers.arrayElement([
            CommentType.SUPPORT,
            CommentType.OPPOSE,
            CommentType.CLARIFY,
          ]),
          createdAt: commentDate,
        },
      });
      comments.push({
        id: comment.id,
        postId: post.id,
        createdAt: commentDate,
      });
    }
  }
  console.log(`Created ${comments.length} comments.`);

  // --- Create Votes for Each Post ---
  for (const post of posts) {
    // Shuffle users list and limit to available votes per post.
    const shuffledUsers = faker.helpers.shuffle(users);
    const numVotes = Math.min(VOTES_PER_POST, shuffledUsers.length);
    for (let i = 0; i < numVotes; i++) {
      const voter = shuffledUsers[i];
      const voteDate = randomDateBetween(post.createdAt, now);
      const value = faker.helpers.arrayElement([1, -1]);
      await prisma.vote.create({
        data: {
          userId: voter.id,
          postId: post.id,
          value,
          createdAt: voteDate,
        },
      });
    }
  }
  console.log(`Created votes for posts.`);

  // --- Create Comment Votes ---
  for (const comment of comments) {
    // Shuffle users list and limit to available votes per comment.
    const shuffledUsers = faker.helpers.shuffle(users);
    const numVotes = Math.min(COMMENT_VOTES_PER_COMMENT, shuffledUsers.length);
    for (let i = 0; i < numVotes; i++) {
      const voter = shuffledUsers[i];
      const voteDate = randomDateBetween(comment.createdAt, now);
      const value = faker.helpers.arrayElement([1, -1]);
      await prisma.commentVote.create({
        data: {
          userId: voter.id,
          commentId: comment.id,
          value,
          createdAt: voteDate,
        },
      });
    }
  }
  console.log(`Created votes for comments.`);

  // --- Create Follow Relationships ---
  for (const user of users) {
    // Exclude the current user from the potential follow list.
    const potentialFollows = users.filter((u) => u.id !== user.id);
    const numFollows = Math.min(FOLLOWS_PER_USER, potentialFollows.length);
    const followingUsers = faker.helpers
      .shuffle(potentialFollows)
      .slice(0, numFollows);

    for (const followee of followingUsers) {
      await prisma.follow.create({
        data: {
          follower: { connect: { id: user.id } },
          following: { connect: { id: followee.id } },
        },
      });
    }
  }
  console.log(`Created follow relationships.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
