# Sarf Trainer

Recognize and memorize Arabic sarf patterns — Forms I–X, abwab, and weak verbs.

The trainer logic runs in-process. Postgres is in Compose so a database client can be wired later; the app does not query it yet.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

To run Postgres (and later the app against it) while keeping Next.js hot-reload on the host:

```bash
docker compose up db
npm run dev
```

`DATABASE_URL` in `.env` points at `localhost:5432` for this workflow.

## Docker

Full stack (production image + Postgres):

```bash
cp .env.example .env
docker compose up --build
```

Then open [http://localhost:3002](http://localhost:3002). Health: [http://localhost:3002/api/health](http://localhost:3002/api/health).

Redis is defined but not started by default:

```bash
docker compose --profile redis up --build
```

## Tests

```bash
npm test
```
