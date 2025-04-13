import { createRouteHandler } from "uploadthing/next";

// eslint-disable-next-line boundaries/element-types
import { fileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
});
