import { generateReactHelpers } from "@uploadthing/react";

// eslint-disable-next-line boundaries/element-types
import { AppFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<AppFileRouter>();
