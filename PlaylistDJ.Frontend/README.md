# Technologies

- Svelte
    - HTML
    - CSS
- \+ Refer to root README.md

# Running frontend

Run these commands to start frontend.

_Install dependencies_

```bash
yarn install
```

## Development

```bash
yarn dev
```

App is hot-reloaded thanks to [Rollup](https://rollupjs.org) when editing scripts in the `src` directory.

## Production

To create an optimised version of the app:

```bash
yarn build
```

To run the built app:

```bash
yarn start
```

# Single-page app mode

*Section to be deleted*

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with
static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any*
path. You can make it so by editing the `"start"` command in package.json:

```json
"start": "sirv public --single"
```
