# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A location-tracking ingest server with additional read endpoints for GeoJSON visualization. While the original proposal.md specified a minimal scope, the current implementation includes:

- **Server**: NestJS + TypeORM with better-sqlite3 adapter
- **Client**: the Overland mobile app, configured to POST to this server's URL
- **Storage**: The server takes the JSON body of Overland's HTTP request and inserts it into SQLite serialized, as-is, alongside a `createdAt` value
- **Additional Features**: Read endpoints for retrieving stored data as GeoJSON for visualization

## Current State

The application consists of:

- **[src/location/location.controller.ts](src/location/location.controller.ts)** — Handles POST `/location/` endpoint for receiving Overland data and GET endpoints for retrieving stored locations as GeoJSON
- **[src/location/location.service.ts](src/location/location.service.ts)** — Uses TypeORM repository to store `JSON.stringify(body)` plus ISO timestamp in the `locations` table
- **[src/location/location.entity.ts](src/location/location.entity.ts)** — TypeORM entity defining the `locations` table schema
- **[src/main.ts](src/main.ts)** — Configures body parser limit to 20mb to handle Overland's batched payloads and sets up Swagger documentation
- **[src/app.module.ts](src/app.module.ts)** — Root module configuring TypeORM with better-sqlite3 adapter, ConfigModule, and LocationModule

The database table `locations` has three columns:
- `id`: Auto-incrementing primary key
- `body`: TEXT column containing the complete, unmodified JSON string from Overland
- `createdAt`: TEXT column containing ISO timestamp

## Scope Considerations

The original [proposal.md](proposal.md) specified a locked scope of only "receive request → store raw body + createdAt" with constraints:
1. No auth, query/read endpoints, validation DTOs, migrations tooling, config modules, or logging infrastructure
2. Keep implementation terse with minimal abstraction

The current implementation extends beyond this scope by including:
- GET endpoints for data retrieval (`/`, `/geojson`, `/geojson/:id`, `/:id`)
- TypeORM abstraction layer instead of direct better-sqlite3 usage
- Swagger/OpenAPI documentation
- Modular architecture with LocationModule

To strictly adhere to proposal.md, these extensions would need to be removed, reverting to:
- Single AppController with POST / route
- AppService using direct better-sqlite3 database operations
- Removal of TypeORM, Swagger, and additional modules

## Commands

```bash
npm run start:dev              # watch mode (port from PORT env, default 3000)
npm run build                  # nest build → dist/ (deletes dist first)
npm run start:prod             # node dist/main
npm run lint                   # eslint --fix over src, apps, libs, test
npm run format                 # prettier --write

npm test                       # jest, *.spec.ts under src/ (rootDir is src)
npm test -- app.controller     # single test file by path pattern
npm test -- -t "name"          # single test by name
npm run test:e2e               # jest --config ./test/jest-e2e.json (test/*.e2e-spec.ts)
```

## Notes on the toolchain

- ESLint runs `recommendedTypeChecked` with Prettier as an error-level rule, so formatting violations fail lint. `no-explicit-any` is off; `no-floating-promises` and `no-unsafe-argument` are warnings only — relevant since the Overland payload is handled as untyped JSON.
- TypeScript is `nodenext` modules with `noImplicitAny: false` and `strictNullChecks: true`. Decorator metadata is on.
- Unit tests live beside sources in `src/`; e2e tests live in `test/` and use supertest against the bootstrapped app.
- Database path configurable via `DB_PATH` environment variable (defaults to `data/locations.db`). E2E tests use `:memory:`.

## Important Implementation Details

1. **Body Parser**: Critical configuration in `main.ts` - must be `app.useBodyParser('json', { limit: '20mb' })` placed AFTER `NestFactory.create()` but BEFORE `app.listen()` to handle Overland's batched payloads (>100 kb default Express limit).

2. **Data Flow**: 
   - Overland POSTs JSON to `/location/`
   - Controller receives `@Body() body: unknown` 
   - Service saves `JSON.stringify(body)` + `new Date().toISOString()` to locations table
   - Returns `{ result: 'ok' }` to stop Overland retries

3. **GeoJSON Endpoints**: While stored as raw JSON strings, GET endpoints parse bodies back to GeoJSON objects for visualization, but this does not affect the storage layer which preserves payloads exactly as received.

4. **Development Guidance**: When making changes, prioritize maintaining the core storage functionality exactly as specified—receiving requests and storing raw bodies with timestamps—while considering whether additional features align with project goals.