import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      const user = session?.user;

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      const avatarUrl = metadata.user.image;
      await db.user.update({
        where: { id: metadata.user.id },
        data: {
          image: avatarUrl,
        },
      });

      return { avatarUrl: avatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
