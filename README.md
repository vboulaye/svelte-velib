# Velib Light Map

Une carte simple et efficace qui montre les disponibilités des velibs à Paris.

Ausi l'occcasion de jouer avec Svelte et Leaflet.


## Get started

Install the dependencies...

```bash
npm install
```

...then start webpack:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and the page should reload with your changes.


## Deploying to the web

With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
npm run deploy
```

## Deploying to android with capacitor

capacitor is used to build a mobile android app (npx cap init  + npx cap add android to bootstrap the project)

once the webapp is built, sync it with the android project

```bash
npx cap sync
```

then open the project in the android directory with android studio
