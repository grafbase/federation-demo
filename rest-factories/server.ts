// REST API server for inventory service
// Uses the same port and data structure as the original GraphQL implementation

// Data sources
const factoriesData = [
  {
    lat: 12893,
    lng: 12948,
    productId: "converse-1",
  },
  {
    lat: 43289,
    lng: 3328,
    productId: "vans-1",
  },
];

async function main() {
  const listenHost = "0.0.0.0";
  const listenPort = 4001;

  Bun.serve({
    port: listenPort,
    hostname: listenHost,
    fetch: async (request) => {
      const url = new URL(request.url);
      const path = url.pathname;

      // Handle GET /factories
      if (path.startsWith("/factories")) {
        return new Response(JSON.stringify(factoriesData), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Root endpoint with API information
      if (path === "/") {
        return new Response(
          JSON.stringify({
            service: "Inventory API",
            endpoints: ["/product/:id"],
            description: "REST API for inventory data",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      // Handle 404 for all other routes
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  console.log(`REST API Server running on ${listenHost}:${listenPort}`);
}

main().catch(console.error);
