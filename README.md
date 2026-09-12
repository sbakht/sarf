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

Then open [http://localhost:3002](http://localhost:3002).

## Bug reports

The quiz has a **Bug report** button. It opens a form and attaches the selected filters, the current question, and answers, then creates a GitHub issue.

To create issues from the app, set `BUG_REPORT_GITHUB_TOKEN` (a PAT with `issues: write`) and optionally `BUG_REPORT_GITHUB_REPO`. Without a token, the form still builds a prefilled GitHub issue URL.

To have an AI reproduce the report, fix it, and open a pull request, set `CURSOR_API_KEY` on the app **or** as a GitHub Actions secret. The [`bug-report.yml`](.github/workflows/bug-report.yml) workflow launches a Cursor Cloud Agent when a quiz bug issue is opened.

## Docker Health: [http://localhost:3002/api/health](http://localhost:3002/api/health).

Redis is defined but not started by default:

```bash
docker compose --profile redis up --build
```

## Tests

```bash
npm test
```
