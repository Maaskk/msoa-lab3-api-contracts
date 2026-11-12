# LAB3 - Analyse et décisions

## Q1 - Interactions entre les services

| Fournisseur | Consommateur | Informations échangées et rôle |
|---|---|---|
| Auth | Orders, Payments, Shipping | Session Bearer vers /api/auth/me ; retour de l'identité publique et du rôle. Chaque service contrôle ensuite la propriété de sa ressource. |
| Catalog | Orders | Identifiant, nom et prix numérique en MAD via /products/{id}. Orders relit le prix et ignore un montant envoyé par le navigateur. |
| Inventory | Orders | Liste de productId/quantity et reservationId. Réservation atomique, puis libération idempotente en cas d'annulation. |
| Orders | Payments | Lecture de la commande et de son propriétaire, puis demande d'action PAY. Le montant ne vient pas du client. |
| Payments | Orders | Capture interne du montant de la commande et remboursement simulé. L'identifiant de commande permet de dédupliquer. |
| Orders | Shipping | Lecture de la commande payée et de l'adresse ; demandes PREPARE, SHIP, TRANSIT ou DELIVER. |
| Shipping | Orders | Préparation interne, progression du suivi ou annulation avant expédition. |

Le navigateur utilise directement les APIs publiques : Auth pour la session, Catalog pour les produits, Inventory pour le stock, puis Orders, Payments et Shipping pour le parcours d'achat. Il ne reçoit jamais la clé interne. Aucun service ne lit la base SQLite d'un autre service.

Le contrôle de stock du navigateur est indicatif. Seule la réservation atomique d'Inventory autorise la commande. Les deux directions Orders/Payments et Orders/Shipping ne forment pas une récursion : l'action de coordination appelle un endpoint interne qui n'appelle pas à nouveau Orders.

## Q2 - Opérations REST

Le [répertoire des endpoints](02_Endpoints.md) contient les 36 opérations, avec leur méthode, route, rôle et codes HTTP. Les documents contracts/*.openapi.json précisent leurs paramètres, corps et réponses. Les six services ont un endpoint GET /health.

Les identifiants de produit sont des entiers positifs. Les identifiants de commande, paiement et expédition sont des chaînes. Les dates de réponse sont des chaînes ISO 8601. Une ligne d'achat contient productId et quantity, tous deux entiers strictement positifs. Un prix historique ou un total de commande est un nombre en MAD.

## Q3 - Contrats, implémentation et vérification

Les contrats utilisent OpenAPI 3.0.3, un document par service. Ce format décrit l'accord indépendamment de Node.js et permet à un membre de réimplémenter son service avec une autre technologie.

| Exigence du sujet | Emplacement dans les contrats |
|---|---|
| a, b, c : opérations, méthodes, buts | paths, operationId, summary et description |
| d : paramètres de route | parameters, in: path, required: true |
| e : paramètres et formats | parameters et components.schemas |
| f : en-têtes | requestBody.content application/json ; securitySchemes Bearer et X-Internal-Key ; Idempotency-Key ; X-Request-Id dans les réponses |
| g : structure du corps et champs requis | requestBody.required, properties, type, required, minimum, enum et format |
| h et i : succès et réponses | responses.200.content.application/json.schema |
| j : erreurs | responses 400/401/403/404/409/413/415/500/503 selon l'opération, avec Error |

Une erreur possède message et requestId. Les requêtes avec un corps non vide doivent annoncer Content-Type: application/json. Un JSON mal formé produit 400, un type de contenu incorrect 415. Une dépendance inaccessible est traduite en 503. Les prix, propriétaires et transitions sont contrôlés côté serveur.

Les opérations héritées gardent 200, y compris la création, car les modifier fait aussi évoluer le contrat. Une nouvelle API pourrait retenir 201 avec Location ; ce TP donne la priorité au maintien des comportements du LAB2 et les documente explicitement.

La collection Postman exécute 47 requêtes dans l'ordre : santé des six APIs, identité, catalogue v1/v2, stock, commande, paiement, livraison et annulation. Chaque réponse est vérifiée contre le schéma OpenAPI développé dans la collection. Newman réalise la même exécution sans intervention manuelle. Les tests du LAB2 sont conservés séparément.

## Q4 - Pourquoi le JSON reste valide mais casse les consommateurs

Le nom price n'a pas changé, mais son type passe de number à object. La syntaxe JSON n'impose aucune compatibilité sémantique entre deux documents. Un client qui attend un nombre ne sait pas automatiquement choisir price.amount ou interpréter price.currency.

Dans le frontend, price.toFixed(2) sur un objet lève TypeError. Une multiplication directe donne NaN ; selon le traitement, cela casse le panier ou affiche un montant invalide. Dans Orders, le calcul du total et les prix figés deviennent incorrects. Le paiement dépend de ce total et la commande peut alors être bloquée ou incohérente. Les tests, SDK ou autres clients liés au schéma numérique sont aussi concernés.

Le test de compatibilité utilise la réponse v2 réelle : elle est un JSON valide et satisfait ProductV2, mais échoue avec ProductV1. Il vérifie aussi que l'ancien calcul numérique ne fonctionne pas avec cet objet. La preuve figure dans evidence/pricing-compatibility.json.

## Q5 - Comparaison des solutions

| Solution | Intérêt | Coût ou risque |
|---|---|---|
| Ajouter priceDetails et conserver price numérique | Migration additive très simple pour les anciens clients | Deux représentations à garder cohérentes ; ambiguïté possible sur la devise du champ ancien |
| Ajouter une route v2 et conserver la route historique | Le client choisit explicitement son contrat ; déploiements indépendants et rollback simple | Deux versions à maintenir temporairement |
| Négocier par Accept ou un en-tête de version | Une même URI représente plusieurs versions | Configuration des clients et caches plus complexe ; documentation de Vary indispensable |
| Remplacer la réponse sur place avec mise à jour simultanée | Un seul format après bascule | Dépendance à un déploiement coordonné de tous les consommateurs ; risque élevé pour les clients oubliés |

Le groupe retient la route v2. L'application a déjà deux consommateurs indépendants du prix historique : le frontend et Orders. Conserver leur route existante évite de les modifier pour une évolution destinée aux nouveaux clients. Une adaptation dans Orders seulement ne suffirait pas à réparer le frontend.

## Q6 - Stratégie mise en œuvre

1. La route /products et son détail gardent price numérique en MAD. Aucun changement n'est imposé aux consommateurs du LAB2.
2. /api/v2/products et /api/v2/products/{productId} renvoient price.amount et price.currency. currency est un paramètre facultatif, MAD par défaut ; MAD, EUR et USD sont les seules valeurs acceptées.
3. Le prix MAD provient toujours du produit du catalogue. EUR et USD viennent de listes de prix fixes de démonstration dans backend/seed/pricebook.json. Aucune conversion financière ni donnée bancaire n'est simulée comme réelle.
4. Les contrats ProductV1 et ProductV2 sont distincts. Un objet price n'est jamais renvoyé sur une route historique en fonction d'une option implicite.
5. La validation OpenAPI, les 25 scénarios historiques et les 106 assertions Postman s'exécutent avant publication. Le parcours commande/paiement/livraison reste opérationnel pendant que Catalog v2 est disponible.
6. Chaque futur consommateur migre explicitement après avoir adapté ses calculs et ses tests. La suppression de v1 demandera un inventaire des consommateurs, une décision du groupe et une période annoncée. Aucune date de retrait fictive n'est fixée dans ce TP.

**Périmètre précis :** les nouveaux clients peuvent consulter les prix structurés dans trois devises. Le checkout historique continue en MAD. Le paiement d'une commande en EUR/USD exigerait un contrat financier versionné dans Orders et Payments ; ce dépôt ne prétend pas l'avoir réalisé. Cette séparation permet d'introduire le nouveau contrat sans modifier silencieusement la signification d'un ancien total.

## Résultats reproductibles

Les fichiers evidence/contracts-validation.json, evidence/postman-results.json et preuves/integration.json sont produits par les outils. La collection a exécuté 47 requêtes et 106 assertions, sans échec. Les 25 scénarios historiques ont passé. Le test de rupture vérifie les deux schémas opposés sur les réponses HTTP réelles. Les services de test utilisent des données temporaires, puis s'arrêtent.

La compatibilité frontend est établie par la conservation de ses sources et du contrat numérique qu'il utilise ; l'exécution de npm test ne constitue pas, à elle seule, un test graphique du navigateur. Le code frontend est fourni pour la démonstration manuelle.

## Références

- [OpenAPI 3.0.3](https://spec.openapis.org/oas/v3.0.3.html) : structure des contrats, schémas, réponses et sécurité.
- [Newman](https://github.com/postmanlabs/newman) : exécution reproductible des collections Postman.
- [Swagger Parser](https://github.com/APIDevTools/swagger-parser) : validation des documents OpenAPI.
- Sujet LAB3 fourni par le professeur et livrable LAB2 du groupe.
