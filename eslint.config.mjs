import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // plugins: ["boundaries"],
    // settings: {
    //   "boundaries/include": ["src/**/*"],
    //   "boundaries/elements": [
    //     {
    //       mode: "full",
    //       type: "shared",
    //       pattern: [
    //         "src/components/**/*",
    //         "src/db/**/*",
    //         "src/lib/**/*",
    //         "src/actions/**/*",
    //       ],
    //     },
    //     {
    //       mode: "full",
    //       type: "feature",
    //       capture: ["featureName"],
    //       pattern: ["src/features/*/**/*"],
    //     },
    //     {
    //       mode: "full",
    //       type: "app",
    //       capture: ["_", "fileName"],
    //       pattern: ["src/app/**/*"],
    //     },
    //     {
    //       mode: "full",
    //       type: "neverImport",
    //       pattern: ["src/*"],
    //     },
    //   ],
    // },
    // rules: {
    //   "boundaries/no-unknown": ["error"],
    //   "boundaries/no-unknown-files": ["error"],
    //   "boundaries/element-types": [
    //     "error",
    //     {
    //       default: "disallow",
    //       rules: [
    //         {
    //           from: ["shared"],
    //           allow: ["shared"],
    //         },
    //         {
    //           from: ["feature"],
    //           allow: [
    //             "shared",
    //             ["feature", { featureName: "${from.featureName}" }],
    //           ],
    //         },
    //         {
    //           from: ["app", "neverImport"],
    //           allow: ["shared", "feature"],
    //         },
    //         {
    //           from: ["app"],
    //           allow: [["app", { fileName: "*.css" }]],
    //         },
    //       ],
    //     },
    //   ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
];

export default eslintConfig;
