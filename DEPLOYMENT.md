# Deployment

Ce projet est configure pour un deploiement frontend sur VPS via GitHub Actions.

## Secrets GitHub requis

Configure ces secrets dans `Settings > Secrets and variables > Actions` :

- `VPS_HOST`
- `VPS_USERNAME`
- `VPS_PASSWORD`
- `VPS_PORT`
- `FRONTEND_PORT`

Secret optionnel :

- `VITE_BASE_PATH`

## Valeurs recommandees pour ton VPS

D'apres la liste des conteneurs que tu as fournie le 1 avril 2026, les ports `5177`, `5178`, `5179`, `5180` et `5181` sont deja occupes.

Le port recommande pour ce frontend est :

- `FRONTEND_PORT=5182`

Exemples de valeurs a configurer cote GitHub :

- `VPS_HOST=31.97.193.152`
- `VPS_USERNAME=root`
- `VPS_PORT=22`

Ne committe jamais `VPS_PASSWORD` dans le repo.

## Chemin de deploiement VPS

Le workflow deploie l'application dans :

- `/opt/insight-frontend`

Le conteneur expose Nginx en interne sur `8080`, puis Docker le publie en local sur le VPS via :

- `127.0.0.1:${FRONTEND_PORT}:8080`

Si tu n'utilises pas de sous-chemin, laisse `VITE_BASE_PATH` vide ou mets simplement `/`.
