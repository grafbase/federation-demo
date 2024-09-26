import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";
import schema from "./inventory.graphqls" with { type: "text" };

async function main() {
  const yoga: any = createYoga({
    schema: buildSubgraphSchema({
      typeDefs: parse(schema),
      resolvers: {},
    }),
  });

  const listenHost = "0.0.0.0";
  const listenPort = 4001;

  Bun.serve({
    port: listenPort,
    hostname: listenHost,
    fetch: yoga,
  });

  console.log(`Server running on ${listenHost}:${listenPort}`);
}

main().catch(console.error);
