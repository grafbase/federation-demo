import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";
import schema from "./user.graphql" with { type: "text" };

const users = [
  { email: "info@converse.com", name: "Converse", totalProductsCreated: 1100 },
  { email: "info@vans.com", name: "Van Doren", totalProductsCreated: 1100 },
];

const resolvers = {
  User: {
    __resolveReference: (reference) => {
      return users.find((u) => u.email == reference.email);
    },
  },
};

async function main() {
  const yoga: any = createYoga({
    schema: buildSubgraphSchema({
      typeDefs: parse(schema),
      resolvers,
    }),
  });

  const listenHost = "0.0.0.0";
  const listenPort = 4000;

  Bun.serve({
    port: listenPort,
    hostname: listenHost,
    fetch: yoga,
  });

  console.log(`Server running on ${listenHost}:${listenPort}`);
}

main().catch(console.error);
