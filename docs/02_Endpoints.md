# Q2 - Répertoire des opérations REST

Tous les corps non vides exigent Content-Type: application/json. Les réponses sont en JSON. Les schémas précis, champs obligatoires, paramètres et erreurs sont dans les six contrats OpenAPI. Les ressources conservent 200 pour respecter LAB2.

| Service | Méthode | Route | But | Codes |
|---|---|---|---|---|
| auth | GET | /health | Verifier que le processus repond | 200, 500 |
| auth | POST | /api/auth/register | Creer un compte | 200, 400, 409, 413, 415, 500 |
| auth | POST | /api/auth/login | Ouvrir une session | 200, 400, 401, 413, 415, 500 |
| auth | GET | /api/auth/me | Lire lidentite de la session | 200, 401, 500 |
| auth | POST | /api/auth/logout | Revoquer la session | 200, 401, 500 |
| catalog | GET | /health | Verifier que le processus repond | 200, 500 |
| catalog | GET | /products | Lister les produits avec prix numerique en MAD | 200, 500 |
| catalog | GET | /products/{productId} | Lire un produit historique en MAD | 200, 404, 500 |
| catalog | GET | /api/v2/products | Lister les produits avec price.amount et price.currency | 200, 400, 409, 500 |
| catalog | GET | /api/v2/products/{productId} | Lire un produit avec prix structure | 200, 400, 404, 409, 500 |
| inventory | GET | /health | Verifier que le processus repond | 200, 500 |
| inventory | GET | /api/inventory/{productId} | Lire le stock disponible | 200, 404, 500 |
| inventory | POST | /api/inventory/check | Precontroler la disponibilite de toutes les lignes | 200, 400, 413, 415, 500 |
| inventory | POST | /api/inventory/reserve | Reserver le stock atomiquement | 200, 400, 403, 409, 413, 415, 500 |
| inventory | POST | /api/inventory/release | Liberer une reservation une seule fois | 200, 400, 403, 404, 409, 413, 415, 500 |
| orders | GET | /health | Verifier que le processus repond | 200, 500 |
| orders | GET | /api/orders | Lister les commandes du proprietaire | 200, 401, 403, 500, 503 |
| orders | POST | /api/orders | Creer une commande en MAD avec prix autoritaire et reservation | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| orders | GET | /api/orders/{orderId} | Lire une commande autorisee | 200, 401, 403, 404, 500, 503 |
| orders | PATCH | /api/orders/{orderId}/status | Confirmer un etat deja atteint ; le client ne peut pas forcer une transition | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| orders | POST | /api/orders/{orderId}/cancel | Annuler avant expedition, rembourser et liberer le stock | 200, 401, 403, 404, 409, 500, 503 |
| orders | POST | /internal/orders/{orderId}/action | Coordonner paiement, transport ou annulation | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| payments | GET | /health | Verifier que le processus repond | 200, 500 |
| payments | GET | /api/payments | Lister les paiements de lutilisateur | 200, 401, 500, 503 |
| payments | POST | /api/payments | Simuler un paiement avec le montant de la commande | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| payments | GET | /api/payments/order/{orderId} | Lire le paiement dune commande autorisee | 200, 401, 403, 404, 500, 503 |
| payments | POST | /internal/payments/{orderId}/capture | Capturer un paiement simule une seule fois | 200, 400, 403, 409, 413, 415, 500 |
| payments | POST | /internal/payments/{orderId}/refund | Rembourser un paiement simule de facon idempotente | 200, 403, 500 |
| shipping | GET | /health | Verifier que le processus repond | 200, 500 |
| shipping | GET | /api/shipments | Lister les expeditions de lutilisateur | 200, 401, 500, 503 |
| shipping | POST | /api/shipments | Preparer une expedition pour une commande payee | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| shipping | GET | /api/shipments/order/{orderId} | Lire lexpedition dune commande autorisee | 200, 401, 403, 404, 500, 503 |
| shipping | PATCH | /api/shipments/{shipmentId}/status | Faire progresser la livraison dans lordre autorise | 200, 400, 401, 403, 404, 409, 413, 415, 500, 503 |
| shipping | POST | /internal/shipments/{orderId}/prepare | Preparer une expedition idempotente | 200, 400, 403, 409, 413, 415, 500 |
| shipping | POST | /internal/shipments/{orderId}/advance | Valider une transition de transport | 200, 400, 403, 404, 409, 413, 415, 500 |
| shipping | POST | /internal/shipments/{orderId}/cancel | Annuler une preparation avant expedition | 200, 403, 409, 500 |
