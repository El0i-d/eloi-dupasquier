# Site — Eloi Dupasquier

Site personnel / vitrine pour ma micro-entreprise de création de sites web.
Site statique (HTML / CSS / JavaScript), sans dépendance ni étape de build :
il fonctionne en ouvrant simplement `index.html`.

## Structure

```
sitePerso/
├── index.html     → contenu et structure de la page
├── styles.css     → tout le style (couleurs, typo, mise en page)
├── script.js      → menu mobile, animations au scroll, formulaire
├── favicon.svg    → icône de l'onglet
└── README.md      → ce fichier
```

## Lancer en local

Double-clique sur `index.html`, ou pour un rendu identique à la production
(utile pour les polices et le formulaire) lance un petit serveur :

```bash
# Python (déjà installé sur ta machine)
python -m http.server 8000
# puis ouvre http://localhost:8000
```

## Ce qu'il reste à personnaliser

Tout est regroupé pour être facile à retrouver :

| Élément | Où | Remarque |
|---|---|---|
| **Adresse email** | `index.html` (section contact) + [web3forms.com](https://web3forms.com) (clé d'accès) | Le texte affiché est `eloi.dupasquier@proton.me` ; la boîte qui reçoit réellement les messages est celle liée à la clé Web3Forms |
| **Téléphone** | non affiché | Volontairement retiré du site public. À ajouter dans la section contact si tu le souhaites |
| **Réalisations** | `index.html`, section `#realisations` | Remplace les 2 projets par tes vraies réalisations (titre, description, technos, année). Ajoute des captures si tu veux |
| **Mentions légales** | `index.html`, footer | Le SIRET et le lien « Mentions légales » sont des espaces à compléter (obligatoire pour une micro-entreprise) |
| **Réseaux** | footer / contact | GitHub est déjà là ; ajoute LinkedIn, etc. si utile |

## Le formulaire de contact

Le formulaire envoie directement un email via [Web3Forms](https://web3forms.com) :
aucun serveur à héberger, gratuit et illimité. Le champ caché `access_key`
dans `index.html` détermine où les messages sont livrés — pour changer de
boîte mail, régénère une clé sur web3forms.com et remplace la valeur de :

```html
<input type="hidden" name="access_key" value="TA_CLE" />
```

Le champ `botcheck` juste en dessous est un piège à robots (honeypot) : il
doit rester présent et masqué (voir `.botcheck` dans `styles.css`), ne pas
le supprimer.

## Mettre en ligne

Le site étant statique, il s'héberge partout, gratuitement pour la plupart :

- **Netlify** ou **Vercel** : glisse-dépose le dossier, en ligne en 30 s + domaine perso.
- **GitHub Pages** : pousse le dossier sur un dépôt, active Pages.
- **Hébergeur classique (OVH, Ionos…)** : envoie les fichiers par FTP à la racine.

## Personnaliser le style

Toutes les couleurs et la typo sont centralisées en haut de `styles.css`
dans le bloc `:root` (variables `--bg`, `--accent`, `--text`…).
Change `--accent` pour changer la couleur d'accent de tout le site d'un coup.
