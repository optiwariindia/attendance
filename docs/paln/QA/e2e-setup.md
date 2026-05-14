# E2E Setup

## Tool Decision
Use Playwright for this project.

Reasons:
- Works well on Ubuntu/Linux.
- Can test Chromium, Firefox, and mobile Chromium from one runner.
- Can run against an already Dockerized website without depending on frontend `node_modules`.
- Supports geolocation permissions for attendance flows.

## Docker Run
Preferred flow is Docker, so Ubuntu host does not need Playwright browsers installed:

```bash
docker compose -f docker-compose.e2e.yml run --rm playwright
```

With credentials:

```bash
E2E_USER_USERNAME=user@example.com \
E2E_USER_PASSWORD='password' \
E2E_ADMIN_USERNAME=admin@example.com \
E2E_ADMIN_PASSWORD='password' \
docker compose -f docker-compose.e2e.yml run --rm playwright
```

The container uses `https://attendance.sampledge.duckdns.org` by default.

## Local Install
Only needed if you want to run Playwright directly on host:

```bash
npm install
npm run e2e:install
```

## Local Run Against Docker Website
Start the application with Docker first, then run:

```bash
npm run e2e
```

For authenticated tests:

```bash
E2E_USER_USERNAME=user@example.com \
E2E_USER_PASSWORD='password' \
E2E_ADMIN_USERNAME=admin@example.com \
E2E_ADMIN_PASSWORD='password' \
npm run e2e
```

Mutation tests are off by default. To test clock-in/out or future CRUD flows on a disposable test tenant:

```bash
E2E_ALLOW_MUTATION=true npm run e2e
```

To target another local or staging deployment:

```bash
E2E_BASE_URL=http://localhost npm run e2e
```

For Docker container runs against a host-local service, use a reachable host URL such as:

```bash
E2E_BASE_URL=http://host.docker.internal docker compose -f docker-compose.e2e.yml run --rm playwright
```

## Files
- `playwright.config.js`
- `docker-compose.e2e.yml`
- `.env.e2e.example`
- `tests/e2e/auth.spec.js`
- `tests/e2e/attendance.spec.js`
- `tests/e2e/leaves.spec.js`
- `tests/e2e/admin-settings.spec.js`
- `tests/e2e/support/auth.js`
- `tests/e2e/support/env.js`
