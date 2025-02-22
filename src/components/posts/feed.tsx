import { prisma } from "@/lib/prisma";
import Post from "./post";
import { PostDataInclude } from "@/lib/types";

const Feed = async () => {
  const posts = await prisma.post.findMany({
    include: PostDataInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
