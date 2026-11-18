# LAB 3 · API contracts for the six microservices

This reference documents the e-commerce API operations in the format of the [example from class](https://gist.github.com/BeattieM/324063512d166122ba5c). Each operation links to the corresponding schema. The legacy routes keep HTTP `200` for compatibility with LAB 2.

[Authentication](#authentication) · [Catalog](#catalog) · [Inventory](#inventory) · [Orders](#orders) · [Payments](#payments) · [Shipping](#shipping) · [Schemas](#schemas)

## Authentication

**Base URL** · `http://127.0.0.1:8081` · [OpenAPI](../contracts/auth.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/auth/register`

Create an account.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [Register](#register).

**Headers**

- `Content-Type: application/json` for a JSON body.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [User](#user)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/auth/login`

Start a session.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [Login](#login).

**Headers**

- `Content-Type: application/json` for a JSON body.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Session](#session)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/auth/me`

Get the identity associated with the session.

**URL Params**

None.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [User](#user)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/auth/logout`

Revoke the session.

**URL Params**

None.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Success](#success)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

## Catalog

**Base URL** · `http://127.0.0.1:8082` · [OpenAPI](../contracts/catalog.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /products`

List products with numeric prices in MAD.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → array of [ProductV1](#productv1)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /products/{productId}`

Get a product using the legacy MAD price format.

**URL Params**

- `productId` · required · `integer` · min. 1 · Resource ID.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [ProductV1](#productv1)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **404** · Resource not found. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/v2/products`

List products with price.amount and price.currency.

**URL Params**

None.

**Data Params**

- `currency` · optional · `string` · allowed values `MAD`, `EUR`, `USD` · Currency for the fixed demonstration price list.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → array of [ProductV2](#productv2)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/v2/products/{productId}`

Get a product with a structured price.

**URL Params**

- `productId` · required · `integer` · min. 1 · Resource ID.

**Data Params**

- `currency` · optional · `string` · allowed values `MAD`, `EUR`, `USD` · Currency for the fixed demonstration price list.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [ProductV2](#productv2)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

## Inventory

**Base URL** · `http://127.0.0.1:8083` · [OpenAPI](../contracts/inventory.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/inventory/{productId}`

Get available stock.

**URL Params**

- `productId` · required · `integer` · min. 1 · Resource ID.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Stock](#stock)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **404** · Resource not found. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/inventory/check`

Check availability for all line items before reservation.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [StockRequest](#stockrequest).

**Headers**

- `Content-Type: application/json` for a JSON body.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Availability](#availability)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/inventory/reserve`

Reserve all stock in one transaction.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [Reservation](#reservation).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [ReservationResult](#reservationresult)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /api/inventory/release`

Release a reservation at most once.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [Release](#release).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Success](#success)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

## Orders

**Base URL** · `http://127.0.0.1:8084` · [OpenAPI](../contracts/orders.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/orders`

List orders for the owner.

**URL Params**

None.

**Data Params**

- `userId` · optional · `string` · Must match the owner for external requests.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → array of [Order](#order)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /api/orders`

Create an order in MAD using Catalog prices and reserve stock.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [OrderRequest](#orderrequest).

**Headers**

- `Idempotency-Key` · optional · `string` · maximum length 149 · For one user, the same key and request body identify the same order.
- `Content-Type: application/json` for a JSON body.
- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Order](#order)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `GET /api/orders/{orderId}`

Get an order the caller is allowed to access.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Order](#order)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `PATCH /api/orders/{orderId}/status`

Confirm an order state that has already been reached. Clients cannot force a transition.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [OrderStatus](#orderstatus).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Order](#order)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /api/orders/{orderId}/cancel`

Cancel before shipping, refund any payment, and release stock.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Order](#order)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /internal/orders/{orderId}/action`

Coordinate payment, shipping, or cancellation.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [OrderAction](#orderaction).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → exactly one of [Order](#order), [Payment](#payment), [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

## Payments

**Base URL** · `http://127.0.0.1:8085` · [OpenAPI](../contracts/payments.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/payments`

List the user’s payments.

**URL Params**

None.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → array of [Payment](#payment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /api/payments`

Simulate payment for the order total.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [PaymentRequest](#paymentrequest).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Payment](#payment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `GET /api/payments/order/{orderId}`

Get the payment for an order the caller is allowed to access.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Payment](#payment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /internal/payments/{orderId}/capture`

Capture a simulated payment once.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [Capture](#capture).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Payment](#payment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /internal/payments/{orderId}/refund`

Refund a simulated payment idempotently.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Success](#success)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

## Shipping

**Base URL** · `http://127.0.0.1:8086` · [OpenAPI](../contracts/shipping.openapi.json)

### `GET /health`

Check that the service is running.

**URL Params**

None.

**Data Params**

None.

**Headers**

No required request headers.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Health](#health)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Internal server error. · Body application/json → [Error](#error)

### `GET /api/shipments`

List the user’s shipments.

**URL Params**

None.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → array of [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /api/shipments`

Prepare shipment for a paid order.

**URL Params**

None.

**Data Params**

- Body `application/json` · required · [ShipmentRequest](#shipmentrequest).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `GET /api/shipments/order/{orderId}`

Get the shipment for an order the caller is allowed to access.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `PATCH /api/shipments/{shipmentId}/status`

Advance the shipment through an allowed transition.

**URL Params**

- `shipmentId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [ShipmentStatus](#shipmentstatus).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `Authorization: Bearer <token>` or `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **401** · Missing or invalid session. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)
- **503** · A dependency is unavailable. · Body application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/prepare`

Prepare a shipment idempotently.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [Prepare](#prepare).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/advance`

Validate a shipping transition.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

- Body `application/json` · required · [Advance](#advance).

**Headers**

- `Content-Type: application/json` for a JSON body.
- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Invalid input or malformed JSON. · Body application/json → [Error](#error)
- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **404** · Resource not found. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **413** · Request body too large. · Body application/json → [Error](#error)
- **415** · Content-Type must be application/json. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/cancel`

Cancel preparation before shipment.

**URL Params**

- `orderId` · required · `string` · Resource ID.

**Data Params**

None.

**Headers**

- `X-Internal-Key: <internal key>`.

**Success Response**

- **200** · OK. The success status remains 200 for LAB 2 compatibility. · Body application/json → exactly one of [Success](#success), [Shipment](#shipment)
  - Response header `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **403** · The caller does not have permission. · Body application/json → [Error](#error)
- **409** · Business rule conflict or unavailable price. · Body application/json → [Error](#error)
- **500** · Internal server error. · Body application/json → [Error](#error)

## Schemas

The tables specify each field’s type, format, and constraints. Referenced schemas describe nested objects and array elements.

### Advance

| Field | Presence | Type and constraints |
|---|---|---|
| `status` | Required | `string` · allowed values `SHIPPED`, `IN_TRANSIT`, `DELIVERED` |

### Availability

| Field | Presence | Type and constraints |
|---|---|---|
| `available` | Required | `boolean` |

### Capture

| Field | Presence | Type and constraints |
|---|---|---|
| `order` | Required | [Order](#order) |
| `method` | Required | `string` · allowed values `CARD`, `CASH` |

### Customer

| Field | Presence | Type and constraints |
|---|---|---|
| `name` | Required | `string` · minimum length 1 |
| `address` | Required | `string` · minimum length 1 |
| `city` | Required | `string` · minimum length 1 |

### Error

| Field | Presence | Type and constraints |
|---|---|---|
| `message` | Required | `string` |
| `requestId` | Required | `string` (format `uuid`) |

### Health

| Field | Presence | Type and constraints |
|---|---|---|
| `service` | Required | `string` |
| `status` | Required | `string` · allowed values `UP` |

### Line

| Field | Presence | Type and constraints |
|---|---|---|
| `productId` | Required | `integer` · min. 1 |
| `quantity` | Required | `integer` · min. 1 · max. 10000 |

### Login

| Field | Presence | Type and constraints |
|---|---|---|
| `email` | Required | `string` (format `email`) |
| `password` | Required | `string` |

### Money

| Field | Presence | Type and constraints |
|---|---|---|
| `amount` | Required | `number` · min. 0 |
| `currency` | Required | `string` · allowed values `MAD`, `EUR`, `USD` |

Additional fields are rejected.

### Order

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `string` |
| `userId` | Required | `string` |
| `customer` | Required | [Customer](#customer) |
| `items` | Required | array of [PricedLine](#pricedline) |
| `total` | Required | `number` · min. 0 |
| `status` | Required | `string` · allowed values `CREATING`, `REJECTED`, `PENDING_PAYMENT`, `PAID`, `CANCELLING`, `CANCELLED`, `SHIPPED`, `DELIVERED` |
| `createdAt` | Required | `string` (format `date-time`) |

### OrderAction

exactly one of `object`, `object`.

### OrderRequest

| Field | Presence | Type and constraints |
|---|---|---|
| `userId` | Required | `string` |
| `customer` | Required | [Customer](#customer) |
| `items` | Required | array of [Line](#line) · minimum items 1 · maximum items 100 |

### OrderStatus

| Field | Presence | Type and constraints |
|---|---|---|
| `status` | Required | `string` · allowed values `CREATING`, `REJECTED`, `PENDING_PAYMENT`, `PAID`, `CANCELLING`, `CANCELLED`, `SHIPPED`, `DELIVERED` |

### Payment

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `string` |
| `orderId` | Required | `string` |
| `userId` | Required | `string` |
| `amount` | Required | `number` · min. 0 |
| `method` | Required | `string` · allowed values `CARD`, `CASH` |
| `status` | Required | `string` · allowed values `SUCCESS`, `REFUNDED` |
| `createdAt` | Required | `string` (format `date-time`) |

### PaymentRequest

| Field | Presence | Type and constraints |
|---|---|---|
| `orderId` | Required | `string` |
| `method` | Required | `string` · allowed values `CARD`, `CASH` |

### Prepare

| Field | Presence | Type and constraints |
|---|---|---|
| `order` | Required | [Order](#order) |

### PricedLine

| Field | Presence | Type and constraints |
|---|---|---|
| `productId` | Required | `integer` · min. 1 |
| `quantity` | Required | `integer` · min. 1 |
| `name` | Required | `string` |
| `price` | Required | `number` · min. 0 |

### ProductV1

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `integer` · min. 1 |
| `name` | Required | `string` |
| `category` | Required | `string` |
| `image` | Required | `string` |
| `description` | Required | `string` |
| `price` | Required | `number` · min. 0 |

### ProductV2

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `integer` · min. 1 |
| `name` | Required | `string` |
| `category` | Required | `string` |
| `image` | Required | `string` |
| `description` | Required | `string` |
| `price` | Required | [Money](#money) |

### Register

| Field | Presence | Type and constraints |
|---|---|---|
| `name` | Required | `string` · minimum length 1 |
| `email` | Required | `string` (format `email`) |
| `password` | Required | `string` · minimum length 6 |

### Release

| Field | Presence | Type and constraints |
|---|---|---|
| `items` | Required | array of [Line](#line) · minimum items 1 · maximum items 100 |
| `reservationId` | Required | `string` · maximum length 149 |

### Reservation

| Field | Presence | Type and constraints |
|---|---|---|
| `items` | Required | array of [Line](#line) · minimum items 1 · maximum items 100 |
| `reservationId` | Optional | `string` · maximum length 149 |

### ReservationResult

| Field | Presence | Type and constraints |
|---|---|---|
| `success` | Required | `boolean` · allowed values `true` |
| `reservationId` | Required | `string` |

### Session

| Field | Presence | Type and constraints |
|---|---|---|
| `user` | Required | [User](#user) |
| `token` | Required | `string` |

### Shipment

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `string` |
| `orderId` | Required | `string` |
| `userId` | Required | `string` |
| `address` | Required | [Customer](#customer) |
| `trackingNumber` | Required | `string` |
| `status` | Required | `string` · allowed values `PREPARING`, `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` |
| `createdAt` | Required | `string` (format `date-time`) |
| `updatedAt` | Required | `string` (format `date-time`) |

### ShipmentRequest

| Field | Presence | Type and constraints |
|---|---|---|
| `orderId` | Required | `string` |
| `address` | Required | [Customer](#customer) |

### ShipmentStatus

| Field | Presence | Type and constraints |
|---|---|---|
| `status` | Required | `string` · allowed values `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` |

### Stock

| Field | Presence | Type and constraints |
|---|---|---|
| `productId` | Required | `integer` · min. 1 |
| `stock` | Required | `integer` · min. 0 |

### StockRequest

| Field | Presence | Type and constraints |
|---|---|---|
| `items` | Required | array of [Line](#line) · minimum items 1 · maximum items 100 |

### Success

| Field | Presence | Type and constraints |
|---|---|---|
| `success` | Required | `boolean` · allowed values `true` |

### User

| Field | Presence | Type and constraints |
|---|---|---|
| `id` | Required | `string` |
| `name` | Required | `string` |
| `email` | Required | `string` (format `email`) |
| `role` | Required | `string` · allowed values `CUSTOMER`, `SYSTEM` |

## Example error response

Error responses use the [Error](#error) schema. For example, `GET /api/orders/{orderId}` returns HTTP `404` with this body for a missing order:

```json
{
  "message": "Order not found",
  "requestId": "30ea4adf-8768-4835-affa-737c2b32d982"
}
```

## Verification

- [Postman collection](../postman/LAB3.postman_collection.json)
- [Newman results](../evidence/postman-results.json)
