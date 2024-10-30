import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

const typeDefinitions = /* GraphQL */ `
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

  type Order @key(fields: "id") {
    id: ID!
    customerName: String!
    items: [OrderItem!]!
    total: Float!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
  }

  type Product @key(fields: "id") {
    id: ID!
  }

  type Query {
    order(id: ID!): Order
    orders: [Order]
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }
`;

// Data sources
const orders = [
  {
    id: "order-1",
    customerName: "John Doe",
    items: [
      { productId: "converse-1", quantity: 2 },
      { productId: "vans-1", quantity: 1 },
    ],
    total: 169.97,
  },
];

const resolvers = {
  Query: {
    order: (_, args) => {
      return orders.find((o) => o.id === args.id);
    },
    orders: () => {
      return orders;
    },
  },
  Order: {
    __resolveReference: (reference) => {
      return orders.find((o) => o.id === reference.id);
    },
  },
  OrderItem: {
    product: (orderItem) => {
      return { __typename: "Product", id: orderItem.productId };
    },
  },
};

async function main() {
  const yoga = createYoga({
    schema: buildSubgraphSchema({
      typeDefs: parse(typeDefinitions),
      resolvers,
    }),
  });

  const listenHost = "0.0.0.0";
  const listenPort = 4002;

  Bun.serve({
    port: listenPort,
    hostname: listenHost,
    fetch: yoga,
  });

  console.log(`Server running on ${listenHost}:${listenPort}`);
}

main().catch(console.error);
