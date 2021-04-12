# Verticals API

API for Verticals project.

Frontend part can be found [here](https://github.com/xom9ikk/verticals).

All server configuration takes place in the `.env` file. You can create your own configuration using the `.env.example` file as a template.

## Scripts

`deploy.sh` - generates `SSL` certificates for nginx using `certbot` and `nginx` configs for serving services (`backend`, `doc`, `grafana`, `prometheus`, `cdn`) and runs `rebuild.sh`.

`rebuild.sh` - builds a new `Docker image` and restarts all docker services.

`start.sh` - runs inside the `Docker container`. Applies migrations and runs pm2 in `production` mode.

## Services 

`API` - [backend.verticals.xom9ik.com](https://backend.verticals.xom9ik.com)

`API Docs` - [doc.backend.verticals.xom9ik.com](https://doc.backend.verticals.xom9ik.com)

`Grafana` - [grafana.backend.verticals.xom9ik.com](https://grafana.backend.verticals.xom9ik.com)  **viewer**:**viewer123**

`Prometheus` - [prometheus.backend.verticals.xom9ik.com](https://prometheus.backend.verticals.xom9ik.com)

`CDN` - [cdn.verticals.xom9ik.com](https://cdn.verticals.xom9ik.com)

## Installation and Development server

Clone repo & install dependencies
```bash
$ git clone https://github.com/xom9ikk/verticals-backend.git
$ npm i
```

Run pm2 in `watch` mode and serve static from `uploads` folder. `dev` server will run at `http://localhost:3000`
```bash
$ npm run dev
```

Build a dependency graph of modules inside the app. The outcome will be located in the `graph.svg` file.
```bash
$ npm run graph
```

## Testing

Run e2e tests.
```bash
$ npm run test
```

Run e2e tests in `watch` mode.
```bash
$ npm run test:watch
```

Run code coverage analysis.
```bash
$ npm run test:coverage
```

Run mutation testing with `stryker`.
```bash
$ npm run test:stryker
```

## License

[MIT](LICENSE)
