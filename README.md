# Grafbase Federation Demo

This demo repository showcases Grafbase extensions and how they enable easy composition and schema consistency across different types of subgraphs: GraphQL subgraphs (products), databases (PostgreSQL), message queues (NATS), and REST APIs (rest-factories).

## Services Overview

This demo includes the following services:

- **Products**: GraphQL subgraph for product management
- **Inventory**: GraphQL subgraph for inventory tracking
- **Orders**: GraphQL subgraph for order processing
- **Orders-PG**: PostgreSQL database exposed as a GraphQL subgraph via Grafbase PostgreSQL extension
- **Sales**: NATS message queue exposed as a GraphQL subgraph via Grafbase NATS extension
- **REST Factories**: REST API exposed as a GraphQL subgraph via Grafbase REST extension
- **gRPC Services**: A separate demo setup with gRPC-based subgraphs (see [grpc/README.md](grpc/README.md))

## Getting Started

### Prerequisites

Install the Grafbase CLI using one of the following methods:

```bash
# Using npx
npx grafbase

# Using curl
curl -fsSL https://grafbase.com/downloads/gateway | bash

# Or see full installation instructions
# https://grafbase.com/docs/gateway/installation
```

### Running the Demo

1. Start all services with Docker Compose:
   ```bash
   docker compose up
   ```

2. Run the Grafbase development server:
   ```bash
   grafbase dev
   ```

3. Access the `grafbase dev` UI at [http://localhost:5000](http://localhost:5000)

### Example queries

Simple query to the products subgraph:

```graphql
query ListProducts {
  products {
    brand
    name
  }
}
```

Postgres query:

```graphql
query OrdersSortedByAmount {
  orders(
    first: 5
    orderBy: [{ totalAmount: DESC }]
  ) {
    edges {
      node {
        orderId
        orderDate
        status
        totalAmount
        customer {
          name
          email
        }
        orderItems(first: 2) {
          edges {
            node {
              productName
              quantity
              unitPrice
            }
          }
        }
      }
    }
  }
}
```

Join from REST (factories) to GraphQL (products) to Postgres (orders):

```graphql
query RestToGraphQLToPostgres {
  factories {
    lng
    lat
    product {
      brand
      color
      latestCustomer {
        address
      }
    }
  }
}
```

Post to NATS:

```graphql
mutation SellProduct {
  sellProduct(input: { productId: "converse-1", price: 200 })
}
```

To subscribe to the sales NATS topic defined in the sales subgraph, use the `subscription.sh` script. It starts a Server Sent Events based GraphQL subscription against `localhost:5000/graphql` with curl. You should see the event from the mutation above when running this.

## Repository Structure

- `/gateway` - Gateway configuration for deployment to Fly.io (ignore this in local setups)
- `/grpc` - Separate demo with gRPC-based subgraphs
- `/products`, `/inventory`, `/orders` - GraphQL subgraphs
- `/orders-pg` - PostgreSQL backed subgraph with an orders database
- `/sales` - NATS message queue subgraph
- `/rest-factories` - REST API service

## Learn More

- [Grafbase Documentation](https://grafbase.com/docs)
- Open source extensions [marketplace](https://grafbase.com/extensions) and [repository](https://github.com/grafbase/extensions)
