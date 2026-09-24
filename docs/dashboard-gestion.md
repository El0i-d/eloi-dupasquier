# Dashboard de gestion — cahier des charges technique

> Outil **mono-utilisateur** (moi seul) pour gérer ma micro-entreprise :
> prospects, clients, devis, factures, encaissements, suivi du CA.
> Accessible depuis le Mac/PC **et l'iPhone** (installable comme une app).
>
> Statut : **cadrage terminé, développement pas commencé.**
> Quand le dépôt du dashboard sera créé, copier ce fichier en `CLAUDE.md` à
> sa racine (avec la partie « Profil & conventions » du `CLAUDE.md` du site).

---

## 1. Décisions d'architecture (et pourquoi)

| Besoin | Choix | Pourquoi |
|---|---|---|
| Web + iPhone | **Application web responsive + PWA** | Une seule base de code. Sur iPhone : Safari → Partager → « Sur l'écran d'accueil » → s'ouvre en plein écran comme une app native. Pas d'App Store, pas d'Electron. |
| Framework | **Nuxt 4** (Vue 3 + TypeScript) | Je connais Vue. Front + API (`server/api/`) dans un seul projet, un seul process Node à déployer. |
| Base de données | **SQLite** (un fichier) | Un seul utilisateur, quelques milliers de lignes au plus : aucun serveur de BDD à gérer. Sauvegarde = copier un fichier. |
| Accès aux données | **Drizzle ORM** + `better-sqlite3` | Schéma typé en TypeScript, migrations SQL lisibles, léger. |
| Validation | **Zod** | Mêmes schémas côté formulaire et API. |
| Authentification | **nuxt-auth-utils** | Session en cookie chiffré, mot de passe haché, et **passkeys** (Face ID sur iPhone) en V2. Pas d'inscription : un seul compte, créé par script. |
| PDF devis/factures | **Gotenberg** (conteneur Docker) | Je fais le gabarit en HTML/CSS (mon point fort), Gotenberg le convertit en PDF. Il sait produire du **PDF/A-3 avec pièce jointe XML** → prêt pour Factur-X (facture électronique). |
| Style | **CSS natif** (variables), pas de framework UI | Reprendre les tokens du site vitrine (`styles.css` : sombre, monospace, accent `#c6f24e`) avec une variante claire pour les PDF. |
| Hébergement | **Mon VPS**, Docker Compose : `app` + `gotenberg` + `caddy` | Caddy = reverse proxy avec HTTPS automatique (Let's Encrypt), config de 3 lignes. |
| URL | `gestion.edupasquier.me` | Enregistrement DNS `A` vers l'IP du VPS. N'affecte pas le site vitrine (GitHub Pages). |
| Sauvegardes | `sqlite3 .backup` quotidien + **restic** vers un stockage externe | Obligation de conserver les factures **10 ans**. Tester la restauration. |

### Écarté volontairement

- **Logiciel tout fait** (Dolibarr, Invoice Ninja, Henrri, Abby…) : plus
  rapide à mettre en place, mais je veux un outil taillé pour moi, qui me
  sert aussi de projet vitrine. À reconsidérer si le dev dérape.
- **App desktop (Electron/Tauri)** : n'apporte rien de plus qu'une PWA et
  ne marche pas sur iPhone.
- **PostgreSQL / Supabase / Firebase** : surdimensionné pour un seul
  utilisateur, ou dépendance à un service tiers pour des données sensibles.
- **Envoi d'e-mails depuis l'app** (V1) : je télécharge le PDF et je l'envoie
  depuis Proton Mail. À ajouter plus tard si besoin (SMTP).

### Alternative d'accès (si je ne veux pas exposer l'app sur Internet)

Mettre le VPS et l'iPhone sur **Tailscale** (VPN gratuit) et servir l'app
uniquement sur le réseau Tailscale (`tailscale serve`, HTTPS inclus).
Inconvénient : un client ne pourra jamais accéder à un lien (ex. accepter un
devis en ligne). **Choix retenu par défaut : exposition publique +
authentification**, avec limitation des tentatives de connexion.

---

## 2. Fonctionnalités

### V1 — le minimum utile

1. **Contacts** (prospects et clients dans une même table, champ `statut`)
   - Pipeline prospect : `nouveau → contacté → devis envoyé → gagné / perdu`
   - Journal d'échanges (appel, e-mail, RDV…) avec date de **relance**
   - Particulier ou professionnel (SIREN, raison sociale)
2. **Devis**
   - Lignes (désignation, quantité, unité, prix unitaire), total
   - Catalogue de prestations pré-remplies (site vitrine, refonte,
     maintenance mensuelle…)
   - Statuts : `brouillon → envoyé → accepté / refusé / expiré`
   - PDF téléchargeable ; **conversion en facture** en un clic (acompte ou
     solde)
3. **Factures**
   - Numérotation automatique continue, statuts
     `brouillon → émise → payée partiellement → payée`
   - **Avoir** pour annuler/corriger une facture émise (jamais de suppression)
   - Enregistrement des **paiements** (date, montant, mode)
4. **Tableau de bord** (page d'accueil, pensée pour l'iPhone)
   - CA **encaissé** du mois / du trimestre / de l'année
   - Montant à déclarer à l'URSSAF pour la période en cours
   - Factures en retard, devis en attente de réponse, relances du jour
   - Jauges : CA de l'année vs seuil de franchise TVA et plafond micro
5. **Livre des recettes** (obligatoire en micro) : généré automatiquement à
   partir des paiements, export CSV/PDF par année.
6. **Paramètres** : identité de l'entreprise, SIRET, adresse, IBAN, logo,
   conditions de paiement par défaut, taux de cotisations URSSAF, seuils.

### V2 — ensuite

- Factures **récurrentes** (maintenance mensuelle) générées automatiquement
- **Passkey / Face ID** pour se connecter depuis l'iPhone
- Envoi des devis/factures par e-mail depuis l'app ; relances de paiement
- Lien public signé pour qu'un client **accepte un devis en ligne**
- Suivi des dépenses (facultatif en micro, utile pour piloter)
- Import de contacts depuis le formulaire Web3Forms du site

### V3 — facturation électronique (avant le 1ᵉʳ septembre 2027)

- Choisir une **Plateforme Agréée (PA)** proposant une API (plusieurs ont une
  offre gratuite pour les micro-entreprises).
- Générer les factures B2B au format **Factur-X** (PDF/A-3 + XML CII,
  profil EN 16931) et les transmettre à la PA par API.
- **E-reporting** des ventes aux particuliers et des encaissements via la PA.
- ⚠️ Depuis le **1ᵉʳ septembre 2026**, toute entreprise doit déjà pouvoir
  **recevoir** des factures électroniques : choisir une PA dès maintenant,
  indépendamment du dashboard.

---

## 3. Règles métier non négociables

Ces règles viennent de la loi : l'app doit les **garantir**, pas seulement
les permettre.

### Numérotation

- Factures : `F-AAAA-NNNN` (ex. `F-2026-0001`), séquence **continue, sans
  trou, chronologique**. Le numéro est attribué **au moment de l'émission**
  (un brouillon n'a pas de numéro), dans une transaction SQL.
- Avoirs : même séquence que les factures (ou `A-AAAA-NNNN`, au choix, mais
  continue), avec référence à la facture d'origine.
- Devis : `D-AAAA-NNN`, pas d'exigence légale de continuité mais on la garde.

### Immutabilité

- Une facture **émise** ne peut plus être modifiée ni supprimée (contrainte
  côté API **et** trigger SQLite). Correction = avoir + nouvelle facture.
- À l'émission : figer une copie des infos client et entreprise dans la
  facture (snapshot), générer le PDF, le stocker, enregistrer son **hash
  SHA-256**.

### Mentions obligatoires sur la facture

- Le mot « Facture », numéro, date d'émission
- Vendeur : « Eloi Dupasquier EI », adresse, **SIREN/SIRET**
- Client : nom ou raison sociale, adresse de facturation ; **SIREN du client**
  s'il est professionnel (nouvelle mention liée à la réforme)
- Adresse de livraison / d'exécution si différente
- **Nature de l'opération** : prestation de services
- Date ou période d'exécution de la prestation
- Pour chaque ligne : désignation précise, quantité, prix unitaire, total
- Total à payer ; « **TVA non applicable, art. 293 B du CGI** »
- **Date d'échéance** du paiement ; « pas d'escompte pour paiement anticipé »
- Taux des **pénalités de retard** ; pour un client pro :
  « **indemnité forfaitaire de 40 € pour frais de recouvrement** »
- Coordonnées bancaires (IBAN) — pratique, non obligatoire

### Mentions sur le devis

- « Devis », numéro, date, **durée de validité**
- Mêmes identités vendeur/client, détail des prestations, total
- « TVA non applicable, art. 293 B du CGI »
- Conditions : acompte éventuel, délai d'exécution, modalités de paiement
- Zone « Bon pour accord » : date + signature du client

### Calculs

- Tous les montants stockés en **centimes (entiers)**, jamais en flottants.
- Le CA micro se déclare **à l'encaissement** : les statistiques URSSAF et le
  livre des recettes se basent sur les **paiements**, pas sur les factures.
- Taux de cotisations et seuils = **paramètres** modifiables, jamais en dur
  (ils changent chaque année).

---

## 4. Modèle de données (première version)

```
settings        (clé/valeur : identité, SIRET, IBAN, taux URSSAF, seuils,
                 périodicité de déclaration, délais de paiement par défaut)

contacts        id, type (particulier|pro), statut (prospect|client|archivé),
                etape_pipeline, nom, prenom, raison_sociale, siren, email,
                telephone, adresse, code_postal, ville, pays, source, notes,
                created_at, updated_at

interactions    id, contact_id, date, canal (appel|email|rdv|autre), resume,
                relance_le (date|null), faite (bool)

prestations     id, libelle, description, unite (forfait|heure|jour|mois),
                prix_unitaire_cts, actif           ← catalogue

devis           id, numero, contact_id, date, validite_jours, statut,
                objet, conditions, acompte_pct, total_cts,
                accepte_le, created_at, updated_at

factures        id, numero (null tant que brouillon), type (facture|avoir),
                facture_origine_id, devis_id, contact_id,
                snapshot_client (JSON), snapshot_vendeur (JSON),
                date_emission, date_prestation_debut, date_prestation_fin,
                date_echeance, statut, total_cts, pdf_path, pdf_sha256,
                created_at, updated_at

lignes          id, document_type (devis|facture), document_id, position,
                designation, quantite (décimal ×100), unite,
                prix_unitaire_cts, total_cts

paiements       id, facture_id, date, montant_cts,
                mode (virement|cheque|especes|carte|autre), reference

sequences       nom (facture|devis|avoir), annee, dernier_numero
```

---

## 5. Structure du projet (Nuxt 4)

```
gestion/
├── app/
│   ├── pages/            index (dashboard), contacts, devis, factures,
│   │                     recettes, parametres, login
│   ├── components/
│   ├── assets/css/       tokens.css (repris du site vitrine), app.css
│   └── app.vue
├── server/
│   ├── api/              endpoints REST (contacts, devis, factures, …)
│   ├── db/
│   │   ├── schema.ts     schéma Drizzle
│   │   └── migrations/
│   ├── pdf/              gabarits HTML des devis/factures
│   └── utils/            numérotation, calculs, génération PDF
├── public/               manifest.webmanifest, icônes, apple-touch-icon
├── scripts/              create-user.ts, backup.sh
├── Dockerfile
├── compose.yaml          app + gotenberg + caddy
├── Caddyfile
├── .env.example
└── CLAUDE.md             ← ce document
```

Données persistées sur le VPS (volume Docker) : `data/gestion.sqlite` et
`data/pdf/AAAA/…`.

---

## 6. Déploiement sur le VPS

1. Prérequis : Docker + plugin Compose, pare-feu (ports 22, 80, 443
   seulement), connexion SSH par clé, mises à jour de sécurité automatiques.
2. DNS : `gestion.edupasquier.me` → `A` vers l'IP du VPS.
3. `Caddyfile` :
   ```
   gestion.edupasquier.me {
       reverse_proxy app:3000
   }
   ```
4. Déployer : `git pull && docker compose up -d --build` (V1, à la main).
   Plus tard : GitHub Actions → image sur GHCR → `docker compose pull`.
5. Secrets dans `.env` sur le VPS uniquement (`NUXT_SESSION_PASSWORD`,
   etc.) ; `.env.example` versionné.
6. Sauvegarde : cron quotidien → `sqlite3 gestion.sqlite ".backup …"` +
   dossier `pdf/` → `restic` vers un stockage externe (Backblaze B2, autre
   serveur…). Rétention longue (factures : 10 ans).

## 7. PWA / iPhone

- `manifest.webmanifest` : `display: standalone`, `theme_color`,
  `background_color`, icônes 192/512 ; `apple-touch-icon` 180×180.
- Balises `apple-mobile-web-app-capable` et `viewport-fit=cover` ;
  respecter les `safe-area-inset-*` (encoche, barre du bas).
- Navigation par barre d'onglets en bas sur mobile ; formulaires avec
  `inputmode` adaptés (numérique pour montants, e-mail, tél.).
- Pas de mode hors ligne en V1 (données toujours sur le serveur).

## 8. Points ouverts

- [ ] Specs du VPS (OS, RAM) et ce qui y tourne déjà (reverse proxy
      existant ? ports occupés ?)
- [ ] Choix de la Plateforme Agréée (réception dès maintenant, émission 2027)
- [ ] Nature fiscale de l'activité (BNC ou BIC) → taux de cotisations URSSAF
- [ ] Périodicité de déclaration URSSAF (mensuelle ou trimestrielle)
- [ ] Stockage externe pour les sauvegardes
