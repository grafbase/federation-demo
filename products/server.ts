import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";
import schema from "./products.graphql" with { type: "text" };

// Data sources
const products = [
  {
    id: "converse-1",
    name: "Converse Chuck Taylor",
    brand: "Converse",
    size: 9.5,
    color: "Black",
    price: 59.99,
  },
  {
    id: "vans-1",
    name: "Vans Classic Sneaker",
    brand: "Vans",
    size: 10,
    color: "White",
    price: 49.99,
  },
];

const resolvers = {
  Query: {
    product: (_, args) => {
      return products.find((p) => p.id === args.id);
    },
    products: () => {
      return products;
    },
  },
  Product: {
    __resolveReference: (reference) => {
      return products.find((p) => p.id === reference.id);
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
  const listenPort = 4000;

  Bun.serve({
    port: listenPort,
    hostname: listenHost,
    fetch: yoga,
  });

  console.log(`Server running on ${listenHost}:${listenPort}`);
}

main().catch(console.error);
