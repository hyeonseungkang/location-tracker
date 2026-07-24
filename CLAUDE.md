# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A location-tracking ingest server. The spec lives in [proposal.md](proposal.md) (Korean) and is authoritative:

- **Server**: NestJS + `better-sqlite3`. **Client**: the Overland mobile app, configured to POST to this server's URL.
- The server takes the JSON body of Overland's HTTP request and inserts it into SQLite **serialized, as-is**, alongside a `createdAt` value. No parsing, no normalization, no per-field columns.

Two constraints from proposal.md that override normal instincts:

1. **Scope is locked.** Anything beyond "receive request → store raw body + createdAt" is explicitly forbidden. Do not add auth, query/read endpoints, validation DTOs, migrations tooling, config modules, or logging infrastructure unless asked.
2. **Keep it terse.** Write the fewest lines that work; do not split logic into extra variables, helpers, or layers for their own sake. Maintainability here means "small enough to read at a glance."

## Current state

proposal.md is implemented, and that is the whole application:

- [src/app.controller.ts](src/app.controller.ts) — one `POST /` route; hands `@Body()` to the service and replies `{ result: 'ok' }` (Overland retries the batch unless it sees that).
- [src/app.service.ts](src/app.service.ts) — opens the DB at `DB_PATH` (default `locations.db` in cwd), creates `locations (id, body TEXT, createdAt TEXT)` if absent, and inserts `JSON.stringify(body)` plus an ISO timestamp.

There is nothing else, by design. No read endpoint, no auth, no validation — Overland's `?api_key=` query param is accepted and ignored.

Unit tests: none. `src/app.controller.spec.ts` tested the deleted `getHello()` and was removed, so `npm test` runs with `--passWithNoTests`. The e2e spec sets `DB_PATH=:memory:` before booting the module.

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

## Implement History

### 260725 08:06:10

```
변경 사항
src/app.controller.ts — POST / 하나. @Body()를 서비스에 넘기고 { result: 'ok' } 반환. Overland는 이 응답을 못 받으면 배치를 재전송하므로 응답 본문은 필요합니다.
src/app.service.ts — DB_PATH(기본 locations.db)로 DB를 열고, 없으면 locations (id, body TEXT, createdAt TEXT) 생성, JSON.stringify(body) + ISO 타임스탬프를 insert.
package.json — better-sqlite3, @types/better-sqlite3를 실제 설치 버전으로 등재 (기존에 node_modules에만 있어서 재설치 시 사라질 상태였음).
스코프 밖이라 하지 않은 것: 조회 엔드포인트, 인증(?api_key=는 받아서 무시), DTO 검증, 마이그레이션. body는 필드 분해 없이 직렬화 문자열 그대로 한 컬럼에 넣습니다.

정리한 것 (알려드립니다): src/app.controller.spec.ts는 삭제된 getHello()를 테스트하고 있어 제거했습니다. 그 결과 src에 unit spec이 하나도 없어 npm test가 exit 1이 되기에 test 스크립트에 --passWithNoTests를 붙였습니다. e2e spec은 POST / → {result:'ok'} 검증으로 바꾸고 DB_PATH=:memory:를 쓰도록 했습니다.

검증: npm run build 통과, npm run lint 통과(경고 1건은 스타터 원본 main.ts의 floating promise), npm run test:e2e 1/1 통과. 추가로 빌드본을 실제 실행해 Overland 형식 payload를 POST한 뒤 sqlite에서 행을 확인했습니다 — body가 원본 JSON 문자열 그대로, createdAt이 함께 저장됩니다.

CLAUDE.md의 "Current state" 섹션도 구현 완료 상태로 갱신했습니다.
```