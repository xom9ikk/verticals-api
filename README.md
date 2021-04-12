# Verticals API

API for Verticals project.

Frontend part can be found [here](https://github.com/xom9ikk/verticals).

All server configuration takes place in the `.env` file. You can create your own configuration using the `.env.example` file as a template.

## Scripts

`deploy.sh` - generates `SSL` certificates for nginx using `certbot` and `nginx` configs for serving services (`backend`, `doc`, `grafana`, `prometheus`, `cdn`) and runs `rebuild.sh`.

`rebuild.sh` - builds a new `Docker image` and restarts all docker services.

`start.sh` - runs inside the `Docker container`. Applies migrations and runs pm2 in `production` mode.

## Services 

`API` - https://backend.verticals.xom9ik.com

`API Docs` - https://doc.backend.verticals.xom9ik.com

`Grafana` - https://grafana.backend.verticals.xom9ik.com
Credentials: **viewer**:**viewer123**

`Prometheus` - https://prometheus.backend.verticals.xom9ik.com

`CDN` - https://cdn.backend.verticals.xom9ik.com

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
