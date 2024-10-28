import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";
import schema from "./orders.graphql" with { type: "text" };

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
  Mutation: {
    createOrder: (_, { customerName, items }) => {
      const newOrder = {
        id: `order-${orders.length + 1}`,
        customerName,
        items,
        total: items.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0),
      };
      orders.push(newOrder);
      return newOrder;
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
      typeDefs: parse(schema),
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
