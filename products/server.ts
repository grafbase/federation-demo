import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

const typeDefinitions = /* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@shareable", "@inaccessible", "@override", "@external"]
    )

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    brand: String!
    size: Float!
    color: String!
    price: Float!
    latestCustomer: Customer!
  }

  type Customer @key(fields: "email") {
    email: String!
  }

  type Query {
    product(id: ID!): Product
    products: [Product]
  }
`;

// Data sources
const products = [
  {
    id: "converse-1",
    name: "Converse Chuck Taylor",
    brand: "Converse",
    size: 9.5,
    color: "Black",
    price: 59.99,
    latestCustomer: { email: "sophia.w@example.com" },
  },
  {
    id: "vans-1",
    name: "Vans Classic Sneaker",
    brand: "Vans",
    size: 10,
    color: "White",
    price: 49.99,
    latestCustomer: { email: "john.smith@example.com" },
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
      typeDefs: parse(typeDefinitions),
      resolvers,
    }),
    // Disable @link URL validation
    validationRules: {
      skipValidation: true,
    },
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
