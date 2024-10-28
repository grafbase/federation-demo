import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";
import schema from "./inventory.graphqls" with { type: "text" };

// Data sources
const inventoryData = [
  {
    id: "converse-1",
    stock: 100,
    location: "Warehouse A",
  },
  {
    id: "vans-1",
    stock: 200,
    location: "Warehouse B",
  },
];

const resolvers = {
  Query: {
    inventory: (_, args) => {
      return inventoryData.find((item) => item.id === args.productId);
    },
  },
  Product: {
    stock: (product) => {
      const inventoryItem = inventoryData.find(
        (item) => item.id === product.id,
      );
      return inventoryItem ? inventoryItem.stock : null;
    },
    location: (product) => {
      const inventoryItem = inventoryData.find(
        (item) => item.id === product.id,
      );
      return inventoryItem ? inventoryItem.location : null;
    },
    __resolveReference: (reference) => {
      return inventoryData.find((item) => item.id === reference.id);
    },
  },
};

async function main() {
  const yoga = createYoga({
    schema: buildSubgraphSchema({
      typeDefs: parse(schema),
      resolvers,
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
