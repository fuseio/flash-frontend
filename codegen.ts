import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "graphql/generated/user-info.tsx": {
      schema:
        "https://api.studio.thegraph.com/query/78455/solid-frontend-staging/version/latest",
      documents: [
        "graphql/queries/user-info.ts",
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
