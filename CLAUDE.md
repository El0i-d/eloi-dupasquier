# CLAUDE.md — Eloi Dupasquier

Fichier de contexte lu automatiquement par Claude Code au début de chaque
session dans ce dépôt. La partie **« Profil & conventions »** est générique :
copie-la telle quelle dans le `CLAUDE.md` de tout nouveau projet (ou dans
`~/.claude/CLAUDE.md` sur ta machine pour qu'elle s'applique partout).

---

## Profil & conventions (réutilisable dans tous les projets)

### Qui je suis

- **Eloi Dupasquier**, développeur web, **micro-entrepreneur** (entreprise
  individuelle) depuis 2026, basé à Belfort (90).
- Activité : conception et développement de sites et applications web
  (sites vitrines, applications sur mesure, refontes, maintenance).
- Stack maîtrisée côté clients : HTML / CSS / JavaScript, **Vue.js**, React,
  Node.js.
- Régime fiscal : micro-entreprise, **franchise en base de TVA** (art. 293 B
  du CGI) → aucune TVA facturée.
- SIRET : immatriculation en cours (à renseigner dès réception).
- Contact pro : `eloi.dupasquier@proton.me` · domaine : `edupasquier.me`.

### Infrastructure dont je dispose

| Ressource | Usage actuel |
|---|---|
| GitHub (`el0i-d`) | Code source ; site vitrine hébergé sur GitHub Pages |
| Domaine `edupasquier.me` | Pointe vers GitHub Pages (fichier `CNAME`) |
| VPS personnel | Géré avec **aaPanel** (Nginx en 80/443, SSL Let's Encrypt) ; **OpenClaw** installé. Apps en Docker derrière le reverse proxy d'aaPanel |
| Web3Forms | Formulaire de contact du site vitrine (sans backend) |

### Comment je veux qu'on travaille

- **Langue** : échanges, UI, commentaires de code et messages de commit en
  **français**. Tutoiement.
- **Simplicité d'abord** : la solution la plus simple qui marche, le moins de
  dépendances et de services possible. Pas d'étape de build quand elle n'est
  pas nécessaire. Justifier chaque dépendance ajoutée.
- **Messages de commit** : en français, verbe à la 3ᵉ personne du présent,
  phrase courte décrivant l'effet (ex. « Ajoute les mentions légales »,
  « Répare le retour en haut de page »).
- **Mobile d'abord** : tout ce que je construis doit être impeccable sur
  iPhone (Safari iOS).
- **Aucun secret dans le code** (clés, mots de passe, IBAN…) : variables
  d'environnement / fichier `.env` non versionné.
- Expliquer brièvement les choix techniques : je veux comprendre et pouvoir
  maintenir seul.

### Obligations légales à garder en tête (micro-entreprise, France)

- Mention **« EI »** ou « Entrepreneur individuel » accolée au nom sur tous les
  documents commerciaux.
- Sur devis et factures : « TVA non applicable, art. 293 B du CGI ».
- Seuils à surveiller (montants 2026, **à revérifier chaque année**) :
  franchise TVA prestations de services ≈ 37 500 € de CA (tolérance ≈
  41 250 €), plafond micro-entreprise services ≈ 77 700 €.
- Facturation électronique : réception obligatoire depuis le 1ᵉʳ sept. 2026,
  **émission obligatoire au 1ᵉʳ sept. 2027** pour les micro-entreprises
  (via une Plateforme Agréée). Détails dans le `CLAUDE.md` du dépôt `el0i-d/gestion`.

---

## Ce dépôt : site vitrine `edupasquier.me`

- Site **statique** HTML / CSS / JS, sans dépendance ni build. Hébergé sur
  **GitHub Pages** (branche par défaut, domaine via `CNAME`).
- Direction artistique : « terminal raffiné » — fond sombre, monospace
  (IBM Plex Mono / Space Mono), accent lime `#c6f24e`. Tous les tokens sont
  dans `:root` en haut de `styles.css`.
- Pages : `index.html`, `realisations.html`, `mentions-legales.html`,
  `confidentialite.html`, démos fictives dans `demos/`.
- Tarifs affichés (indicatifs) : site vitrine dès 500 €, application sur
  mesure dès 1 200 €, refonte dès 400 €, maintenance dès 25 €/mois.
- Formulaire de contact : Web3Forms (clé publique dans `index.html`).
- Lancer en local : `python -m http.server 8000`.
- `_config.yml` exclut les fichiers internes (`CLAUDE.md`, `README.md`,
  `docs/`) de la publication GitHub Pages — penser à y ajouter tout nouveau
  fichier interne.

## Projet lié : dashboard de gestion

Outil perso (prospects, clients, devis, factures) développé en **Nuxt** dans
le dépôt privé **`el0i-d/gestion`**. Son cahier des charges technique complet
est le `CLAUDE.md` de ce dépôt : c'est la seule source de vérité, ne pas le
dupliquer ici.
