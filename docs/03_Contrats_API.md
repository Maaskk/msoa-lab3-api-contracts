# LAB 3 · Contrats API des six microservices

Contrats de la plateforme e-commerce, présentés par opération dans le format du [Gist du cours](https://gist.github.com/BeattieM/324063512d166122ba5c). Les schémas et codes proviennent des spécifications OpenAPI du dépôt. Les routes historiques conservent le code de succès `200` pour rester compatibles avec le LAB 2.

[Authentication](#authentication) · [Catalog](#catalog) · [Inventory](#inventory) · [Orders](#orders) · [Payments](#payments) · [Shipping](#shipping) · [Schémas](#schémas)

## Authentication

**URL de base** · `http://127.0.0.1:8081` · [OpenAPI](../contracts/auth.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/auth/register`

Creer un compte

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [Register](#register).

**Headers**

- `Content-Type: application/json` pour le corps JSON.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [User](#user)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/auth/login`

Ouvrir une session

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [Login](#login).

**Headers**

- `Content-Type: application/json` pour le corps JSON.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Session](#session)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/auth/me`

Lire lidentite de la session

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [User](#user)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/auth/logout`

Revoquer la session

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Success](#success)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

## Catalog

**URL de base** · `http://127.0.0.1:8082` · [OpenAPI](../contracts/catalog.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /products`

Lister les produits avec prix numerique en MAD

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → tableau de [ProductV1](#productv1)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /products/{productId}`

Lire un produit historique en MAD

**URL Params**

- `productId` · obligatoire · `integer` · min. 1 · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [ProductV1](#productv1)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/v2/products`

Lister les produits avec price.amount et price.currency

**URL Params**

Aucun.

**Data Params**

- `currency` · facultatif · `string` · valeurs `MAD`, `EUR`, `USD` · Devise de la liste de prix fixe de demonstration. Aucun taux de change temps reel.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → tableau de [ProductV2](#productv2)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/v2/products/{productId}`

Lire un produit avec prix structure

**URL Params**

- `productId` · obligatoire · `integer` · min. 1 · Identifiant de la ressource

**Data Params**

- `currency` · facultatif · `string` · valeurs `MAD`, `EUR`, `USD` · Devise de la liste de prix fixe de demonstration. Aucun taux de change temps reel.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [ProductV2](#productv2)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

## Inventory

**URL de base** · `http://127.0.0.1:8083` · [OpenAPI](../contracts/inventory.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/inventory/{productId}`

Lire le stock disponible

**URL Params**

- `productId` · obligatoire · `integer` · min. 1 · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Stock](#stock)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/inventory/check`

Precontroler la disponibilite de toutes les lignes

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [StockRequest](#stockrequest).

**Headers**

- `Content-Type: application/json` pour le corps JSON.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Availability](#availability)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/inventory/reserve`

Reserver le stock atomiquement

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [Reservation](#reservation).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [ReservationResult](#reservationresult)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /api/inventory/release`

Liberer une reservation une seule fois

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [Release](#release).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Success](#success)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

## Orders

**URL de base** · `http://127.0.0.1:8084` · [OpenAPI](../contracts/orders.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/orders`

Lister les commandes du proprietaire

**URL Params**

Aucun.

**Data Params**

- `userId` · facultatif · `string` · Doit correspondre au proprietaire sauf appel interne

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → tableau de [Order](#order)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /api/orders`

Creer une commande en MAD avec prix autoritaire et reservation

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [OrderRequest](#orderrequest).

**Headers**

- `Idempotency-Key` · facultatif · `string` · longueur max. 149 · Meme cle et meme contenu : meme commande pour un utilisateur
- `Content-Type: application/json` pour le corps JSON.
- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Order](#order)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `GET /api/orders/{orderId}`

Lire une commande autorisee

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Order](#order)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `PATCH /api/orders/{orderId}/status`

Confirmer un etat deja atteint ; le client ne peut pas forcer une transition

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [OrderStatus](#orderstatus).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Order](#order)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /api/orders/{orderId}/cancel`

Annuler avant expedition, rembourser et liberer le stock

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Order](#order)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /internal/orders/{orderId}/action`

Coordonner paiement, transport ou annulation

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [OrderAction](#orderaction).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → un seul des schémas suivants, [Order](#order), [Payment](#payment), [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

## Payments

**URL de base** · `http://127.0.0.1:8085` · [OpenAPI](../contracts/payments.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/payments`

Lister les paiements de lutilisateur

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → tableau de [Payment](#payment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /api/payments`

Simuler un paiement avec le montant de la commande

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [PaymentRequest](#paymentrequest).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Payment](#payment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `GET /api/payments/order/{orderId}`

Lire le paiement dune commande autorisee

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Payment](#payment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /internal/payments/{orderId}/capture`

Capturer un paiement simule une seule fois

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [Capture](#capture).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Payment](#payment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /internal/payments/{orderId}/refund`

Rembourser un paiement simule de facon idempotente

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Success](#success)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

## Shipping

**URL de base** · `http://127.0.0.1:8086` · [OpenAPI](../contracts/shipping.openapi.json)

### `GET /health`

Verifier que le processus repond

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

Aucun en-tête de requête obligatoire.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Health](#health)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **500** · Erreur interne · Corps application/json → [Error](#error)

### `GET /api/shipments`

Lister les expeditions de lutilisateur

**URL Params**

Aucun.

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → tableau de [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /api/shipments`

Preparer une expedition pour une commande payee

**URL Params**

Aucun.

**Data Params**

- Corps `application/json` · obligatoire · [ShipmentRequest](#shipmentrequest).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `GET /api/shipments/order/{orderId}`

Lire lexpedition dune commande autorisee

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `PATCH /api/shipments/{shipmentId}/status`

Faire progresser la livraison dans lordre autorise

**URL Params**

- `shipmentId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [ShipmentStatus](#shipmentstatus).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `Authorization: Bearer <jeton>` ou `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **401** · Session absente ou invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)
- **503** · Service dependant indisponible · Corps application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/prepare`

Preparer une expedition idempotente

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [Prepare](#prepare).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/advance`

Valider une transition de transport

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

- Corps `application/json` · obligatoire · [Advance](#advance).

**Headers**

- `Content-Type: application/json` pour le corps JSON.
- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **400** · Entree ou JSON invalide · Corps application/json → [Error](#error)
- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **404** · Ressource inexistante · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **413** · Corps trop volumineux · Corps application/json → [Error](#error)
- **415** · Content-Type doit etre application/json · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

### `POST /internal/shipments/{orderId}/cancel`

Annuler une preparation avant expedition

**URL Params**

- `orderId` · obligatoire · `string` · Identifiant de la ressource

**Data Params**

Aucun.

**Headers**

- `X-Internal-Key: <clé interne>`.

**Success Response**

- **200** · Succes. 200 est conserve pour les contrats herites du LAB2. · Corps application/json → un seul des schémas suivants, [Success](#success), [Shipment](#shipment)
  - En-tête `X-Request-Id` · `string` (format `uuid`).

**Error Response**

- **403** · Acteur non autorise · Corps application/json → [Error](#error)
- **409** · Conflit metier ou prix indisponible · Corps application/json → [Error](#error)
- **500** · Erreur interne · Corps application/json → [Error](#error)

## Schémas

Les champs sont décrits avec leur type, leur format et leurs contraintes. Les tableaux et les objets référencés sont détaillés dans les sections correspondantes.

### Advance

| Champ | Présence | Type et contraintes |
|---|---|---|
| `status` | Obligatoire | `string` · valeurs `SHIPPED`, `IN_TRANSIT`, `DELIVERED` |

### Availability

| Champ | Présence | Type et contraintes |
|---|---|---|
| `available` | Obligatoire | `boolean` |

### Capture

| Champ | Présence | Type et contraintes |
|---|---|---|
| `order` | Obligatoire | [Order](#order) |
| `method` | Obligatoire | `string` · valeurs `CARD`, `CASH` |

### Customer

| Champ | Présence | Type et contraintes |
|---|---|---|
| `name` | Obligatoire | `string` · longueur min. 1 |
| `address` | Obligatoire | `string` · longueur min. 1 |
| `city` | Obligatoire | `string` · longueur min. 1 |

### Error

| Champ | Présence | Type et contraintes |
|---|---|---|
| `message` | Obligatoire | `string` |
| `requestId` | Obligatoire | `string` (format `uuid`) |

### Health

| Champ | Présence | Type et contraintes |
|---|---|---|
| `service` | Obligatoire | `string` |
| `status` | Obligatoire | `string` · valeurs `UP` |

### Line

| Champ | Présence | Type et contraintes |
|---|---|---|
| `productId` | Obligatoire | `integer` · min. 1 |
| `quantity` | Obligatoire | `integer` · min. 1 · max. 10000 |

### Login

| Champ | Présence | Type et contraintes |
|---|---|---|
| `email` | Obligatoire | `string` (format `email`) |
| `password` | Obligatoire | `string` |

### Money

| Champ | Présence | Type et contraintes |
|---|---|---|
| `amount` | Obligatoire | `number` · min. 0 |
| `currency` | Obligatoire | `string` · valeurs `MAD`, `EUR`, `USD` |

Les champs supplémentaires sont refusés.

### Order

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `string` |
| `userId` | Obligatoire | `string` |
| `customer` | Obligatoire | [Customer](#customer) |
| `items` | Obligatoire | tableau de [PricedLine](#pricedline) |
| `total` | Obligatoire | `number` · min. 0 |
| `status` | Obligatoire | `string` · valeurs `CREATING`, `REJECTED`, `PENDING_PAYMENT`, `PAID`, `CANCELLING`, `CANCELLED`, `SHIPPED`, `DELIVERED` |
| `createdAt` | Obligatoire | `string` (format `date-time`) |

### OrderAction

un seul des schémas suivants, `object`, `object`.

### OrderRequest

| Champ | Présence | Type et contraintes |
|---|---|---|
| `userId` | Obligatoire | `string` |
| `customer` | Obligatoire | [Customer](#customer) |
| `items` | Obligatoire | tableau de [Line](#line) · nombre min. 1 · nombre max. 100 |

### OrderStatus

| Champ | Présence | Type et contraintes |
|---|---|---|
| `status` | Obligatoire | `string` · valeurs `CREATING`, `REJECTED`, `PENDING_PAYMENT`, `PAID`, `CANCELLING`, `CANCELLED`, `SHIPPED`, `DELIVERED` |

### Payment

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `string` |
| `orderId` | Obligatoire | `string` |
| `userId` | Obligatoire | `string` |
| `amount` | Obligatoire | `number` · min. 0 |
| `method` | Obligatoire | `string` · valeurs `CARD`, `CASH` |
| `status` | Obligatoire | `string` · valeurs `SUCCESS`, `REFUNDED` |
| `createdAt` | Obligatoire | `string` (format `date-time`) |

### PaymentRequest

| Champ | Présence | Type et contraintes |
|---|---|---|
| `orderId` | Obligatoire | `string` |
| `method` | Obligatoire | `string` · valeurs `CARD`, `CASH` |

### Prepare

| Champ | Présence | Type et contraintes |
|---|---|---|
| `order` | Obligatoire | [Order](#order) |

### PricedLine

| Champ | Présence | Type et contraintes |
|---|---|---|
| `productId` | Obligatoire | `integer` · min. 1 |
| `quantity` | Obligatoire | `integer` · min. 1 |
| `name` | Obligatoire | `string` |
| `price` | Obligatoire | `number` · min. 0 |

### ProductV1

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `integer` · min. 1 |
| `name` | Obligatoire | `string` |
| `category` | Obligatoire | `string` |
| `image` | Obligatoire | `string` |
| `description` | Obligatoire | `string` |
| `price` | Obligatoire | `number` · min. 0 |

### ProductV2

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `integer` · min. 1 |
| `name` | Obligatoire | `string` |
| `category` | Obligatoire | `string` |
| `image` | Obligatoire | `string` |
| `description` | Obligatoire | `string` |
| `price` | Obligatoire | [Money](#money) |

### Register

| Champ | Présence | Type et contraintes |
|---|---|---|
| `name` | Obligatoire | `string` · longueur min. 1 |
| `email` | Obligatoire | `string` (format `email`) |
| `password` | Obligatoire | `string` · longueur min. 6 |

### Release

| Champ | Présence | Type et contraintes |
|---|---|---|
| `items` | Obligatoire | tableau de [Line](#line) · nombre min. 1 · nombre max. 100 |
| `reservationId` | Obligatoire | `string` · longueur max. 149 |

### Reservation

| Champ | Présence | Type et contraintes |
|---|---|---|
| `items` | Obligatoire | tableau de [Line](#line) · nombre min. 1 · nombre max. 100 |
| `reservationId` | Facultatif | `string` · longueur max. 149 |

### ReservationResult

| Champ | Présence | Type et contraintes |
|---|---|---|
| `success` | Obligatoire | `boolean` · valeurs `True` |
| `reservationId` | Obligatoire | `string` |

### Session

| Champ | Présence | Type et contraintes |
|---|---|---|
| `user` | Obligatoire | [User](#user) |
| `token` | Obligatoire | `string` |

### Shipment

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `string` |
| `orderId` | Obligatoire | `string` |
| `userId` | Obligatoire | `string` |
| `address` | Obligatoire | [Customer](#customer) |
| `trackingNumber` | Obligatoire | `string` |
| `status` | Obligatoire | `string` · valeurs `PREPARING`, `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` |
| `createdAt` | Obligatoire | `string` (format `date-time`) |
| `updatedAt` | Obligatoire | `string` (format `date-time`) |

### ShipmentRequest

| Champ | Présence | Type et contraintes |
|---|---|---|
| `orderId` | Obligatoire | `string` |
| `address` | Obligatoire | [Customer](#customer) |

### ShipmentStatus

| Champ | Présence | Type et contraintes |
|---|---|---|
| `status` | Obligatoire | `string` · valeurs `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` |

### Stock

| Champ | Présence | Type et contraintes |
|---|---|---|
| `productId` | Obligatoire | `integer` · min. 1 |
| `stock` | Obligatoire | `integer` · min. 0 |

### StockRequest

| Champ | Présence | Type et contraintes |
|---|---|---|
| `items` | Obligatoire | tableau de [Line](#line) · nombre min. 1 · nombre max. 100 |

### Success

| Champ | Présence | Type et contraintes |
|---|---|---|
| `success` | Obligatoire | `boolean` · valeurs `True` |

### User

| Champ | Présence | Type et contraintes |
|---|---|---|
| `id` | Obligatoire | `string` |
| `name` | Obligatoire | `string` |
| `email` | Obligatoire | `string` (format `email`) |
| `role` | Obligatoire | `string` · valeurs `CUSTOMER`, `SYSTEM` |

## Exemple de réponse d’erreur

La réponse d’erreur utilise le schéma [Error](#error). Le message varie selon la cause.

```json
{
  "message": "<message d’erreur>",
  "requestId": "30ea4adf-8768-4835-affa-737c2b32d982"
}
```

## Vérification

- [Collection Postman](../postman/LAB3.postman_collection.json)
- [Résultats Newman](../evidence/postman-results.json)
