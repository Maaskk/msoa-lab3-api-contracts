# LAB 3 - Designing an API Contract

Microservice-oriented Architectures · Master Big Data & Data Science · Professor Zouheir BANOU

This project extends the LAB 2 e-commerce application with six REST API contracts, a runnable Postman collection, and a backward-compatible Catalog price format.

## Deliverables

- [English API contract for the six services](docs/03_Contrats_API.md)
- [Six OpenAPI 3.0.3 specifications](contracts/)
- [Answers to questions 1–6](docs/01_Analyse_et_Decisions.md)
- [Index of the 36 REST operations](docs/02_Endpoints.md)
- [Postman collection](postman/LAB3.postman_collection.json) and [local environment](postman/Local.postman_environment.json)
- [Newman results](evidence/postman-results.json) and [price compatibility evidence](evidence/pricing-compatibility.json)
- [Group report](reports/LAB3_Rapport_Groupe.pdf)

## Run and verify

Use Node.js 24 or newer and npm.

```sh
npm ci
npm test
npm start
```

Stop any running services before `npm test`. The tests use the same ports and isolated temporary databases. `npm start` starts the six APIs and generates a shared internal key in memory. Ctrl+C stops the processes.

| Service | Port | Assigned owner |
|---|---:|---|
| Authentication | 8081 | Elhaddaji Hamza |
| Catalog | 8082 | Sekkat Israa |
| Inventory | 8083 | Mouhcine Ayar |
| Orders | 8084 | ASHAD Ossama |
| Payments | 8085 | Rahil Msouhli |
| Shipping | 8086 | Karany Mohamed Amine |

Each service exposes `GET /health`. During normal operation, demo data is stored in `backend/data`.

The supplied React frontend lives in `frontend/`. To start it, run the following in another terminal:

```sh
cd frontend
npm ci
npm run dev
```

The local demo account is `demo@msoa.shop` with password `demo123`. The Postman tests register a temporary user.

## Legacy and v2 price formats

```sh
curl http://127.0.0.1:8082/products/1
curl http://127.0.0.1:8082/api/v2/products/1
curl 'http://127.0.0.1:8082/api/v2/products/1?currency=EUR'
```

The legacy route returns `price: 8499` as a number in MAD. The v2 route returns `price: { amount: 8499, currency: "MAD" }` by default and accepts EUR and USD using fixed demonstration price lists. An unsupported currency returns HTTP 400. Existing frontend and Orders flows continue using MAD.

## Postman and automated checks

Import the collection and the local environment, select that environment, start the APIs with `npm start`, and run the collection in order. Login populates the token and identifiers automatically.

```sh
npm run validate:contracts
npm run test:legacy
npm run test:api
```

These commands validate the six specifications, rerun the 25 LAB 2 integration scenarios, and use Newman to exercise 47 requests and 106 assertions. They include success and error schemas and both price formats.

## Scope

The project uses Node.js, HTTP, and SQLite with one instance per service. Payment and shipping are simulated. Orders uses process-local locks. Cross-service consistency relies on idempotent operations and compensating actions. The frontend is based on [ZOUHEIRBN/MSOA-E-com-Demo](https://github.com/ZOUHEIRBN/MSOA-E-com-Demo/tree/baee7d79828a4883c8c7158e41ac4b1a878bf12a).
