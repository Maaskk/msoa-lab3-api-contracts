# LAB 3 - Designing an API Contract

Microservice-oriented Architectures, Master Big Data & Data Science.
Professeur : Zouheir BANOU.

Ce dépôt poursuit l'application e-commerce du LAB2. Il contient les six services REST, leurs contrats OpenAPI, une collection Postman exécutable et une évolution compatible du prix du catalogue.

## Remise

- [Réponses aux questions 1 à 6](docs/01_Analyse_et_Decisions.md).
- [Répertoire des 36 opérations REST](docs/02_Endpoints.md).
- [Six contrats OpenAPI](contracts/).
- [Collection Postman](postman/LAB3.postman_collection.json) et [environnement local](postman/Local.postman_environment.json).
- [Résultats Postman réellement exécutés](evidence/postman-results.json).
- [Preuve de compatibilité des prix](evidence/pricing-compatibility.json).
- [Rapport PDF](reports/LAB3_Rapport_Groupe.pdf).

## Démarrer et vérifier

Prérequis : Node.js 24 ou plus récent et npm.

```sh
npm ci
npm test
npm start
```

Arrêter les services avant npm test : les tests utilisent les mêmes ports, mais des bases temporaires isolées. npm start lance les six APIs et génère une clé interne commune en mémoire. Ctrl+C arrête les processus.

| Service | Port | Responsabilité attribuée |
|---|---|---|
| Orders | 8084 | ASHAD Ossama |
| Authentication | 8081 | Elhaddaji Hamza |
| Catalog | 8082 | Sekkat Israa |
| Inventory | 8083 | Mouhcine Ayar |
| Payments | 8085 | Rahil Msouhli |
| Shipping | 8086 | Karany Mohamed Amine |

Chaque API expose GET /health. Les données de démonstration persistent dans backend/data lors du lancement normal. Les bases et sessions locales ne sont pas déposées sur GitHub.

Le frontend du LAB2 est conservé dans frontend/. Pour le lancer dans un autre terminal :

```sh
cd frontend
npm ci
npm run dev
```

Compte pédagogique du frontend : demo@msoa.shop / demo123. Ce compte sert uniquement à la démonstration locale. Les tests Postman créent leur propre utilisateur temporaire.

## Ancienne et nouvelle représentation

```sh
curl http://127.0.0.1:8082/products/1
curl http://127.0.0.1:8082/api/v2/products/1
curl 'http://127.0.0.1:8082/api/v2/products/1?currency=EUR'
```

La route historique renvoie price: 8499, toujours en MAD. La route v2 renvoie price: { amount: 8499, currency: "MAD" }. Elle accepte aussi EUR et USD à partir de listes de prix fixes de démonstration. Une devise non prise en charge produit 400.

Le changement est volontairement limité au contrat Catalog : le frontend existant et Orders continuent à utiliser la représentation historique en MAD. Le paiement dans une devise étrangère n'est pas annoncé comme implémenté. Les montants EUR/USD ne sont ni des taux de change actuels ni des tarifs commerciaux réels.

## Importer dans Postman

Importer les deux fichiers du dossier postman, sélectionner l'environnement local, lancer npm start, puis exécuter la collection complète dans l'ordre. La connexion renseigne automatiquement le jeton et les identifiants nécessaires. Pour un résultat reproductible sans modifier les données de démonstration, préférer npm run test:api : il démarre ses propres services avec une base temporaire.

```sh
npm run validate:contracts
npm run test:legacy
npm run test:api
```

Le premier contrôle valide les six documents OpenAPI. Le second reprend les 25 scénarios du LAB2. Le troisième exécute Newman et vérifie les réponses réelles contre les schémas, ainsi que le cas de rupture du prix et les erreurs 400/415.

## Lecture et limites

Les schémas détaillent les champs obligatoires, paramètres, formats, en-têtes, autorisations et codes HTTP. Les opérations héritées conservent leur code de succès 200 pour ne pas modifier le contrat du LAB2.

Ce prototype utilise HTTP natif, SQLite et une instance par service. Les paiements et le transport sont simulés. Les verrous Orders sont locaux au processus ; aucune transaction distribuée ni reprise automatique après chaque panne n'est fournie. Le backend ne présente pas de paiement bancaire réel.

Le frontend de référence provient de ZOUHEIRBN/MSOA-E-com-Demo, commit baee7d79828a4883c8c7158e41ac4b1a878bf12a. Les responsabilités du tableau correspondent à la répartition du groupe et ne prétendent pas constituer un historique de contributions individuelles.
