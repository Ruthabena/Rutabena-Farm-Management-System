# Ruthabena Farm Management System Backend

Production-style multi-tenant farm management backend built with NestJS, PostgreSQL, Prisma ORM, JWT authentication, RBAC, Swagger, and tenant-aware REST APIs.

## Overview

This backend is designed for a shared SaaS platform where multiple agricultural businesses operate as separate tenants on one system.

Each tenant can manage:

- users and staff
- farms
- fields and plots
- seasons
- crop plans
- farm activities
- expenses
- inventory
- yield records
- reports

## Recommended Project Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  activities/
  auth/
  common/
    constants/
    decorators/
    dto/
    filters/
    guards/
    interceptors/
    interfaces/
    middleware/
    prisma/
    utils/
  crops/
  expenses/
  farms/
  fields/
  inventory/
  prisma/
  reports/
  seasons/
  tenants/
  users/
  yields/
  app.module.ts
  main.ts
```

## Technology Stack

- NestJS
- PostgreSQL
- Prisma ORM
- `jsonwebtoken`
- `bcrypt`
- Swagger / OpenAPI
- `class-validator`

## Multi-Tenant Architecture

The system uses a shared database with row-level tenant scoping.

### Tenant isolation strategy

- Every tenant-owned table contains `tenantId`
- JWT payload includes `userId`, `tenantId`, `role`, and `email`
- `TenantMiddleware` resolves tenant from request header when provided
- `TenantAccessGuard` blocks cross-tenant access for tenant-scoped endpoints
- Services use `requireTenantScope(...)` to enforce tenant-aware queries
- Controllers for tenant-owned resources use `@TenantScoped()`

### Tenant resolution order

1. `x-tenant-id` header if supplied
2. authenticated user `tenantId`

`SUPER_ADMIN` is allowed to work outside a tenant scope where appropriate. All other roles are restricted to their assigned tenant.

## Roles and RBAC

Supported roles:

- `SUPER_ADMIN`
- `TENANT_OWNER`
- `FARM_MANAGER`
- `ACCOUNTANT`
- `FIELD_OFFICER`
- `WORKER`

Role checks are enforced with:

- `@Roles(...)`
- `RolesGuard`
- `JwtAuthGuard`
- `TenantAccessGuard`

## Prisma Schema

Key entities:

- `Tenant`
- `TenantSettings`
- `User`
- `Farm`
- `Field`
- `Season`
- `CropPlan`
- `FarmActivity`
- `Expense`
- `YieldRecord`
- `InventoryItem`
- `InventoryTransaction`

Important schema conventions:

- UUID primary keys
- `tenantId` on tenant-owned models
- `createdAt`, `updatedAt`, `deletedAt`
- enums for roles, statuses, categories, and units
- indexes on high-frequency filter columns

## Module Breakdown

### 1. Tenants module

Purpose:

- onboard a new tenant
- create the tenant owner during onboarding
- list tenants for super admin
- update tenant profile
- update tenant settings
- activate or deactivate tenants

### 2. Auth module

Purpose:

- login
- refresh token
- logout
- current auth context


### 3. Users module

Purpose:

- create tenant users
- list users by tenant
- update users
- assign roles
- deactivate users

### 4. Farms module

Purpose:

- create farms
- update farms
- list farms
- soft delete farms

### 5. Fields module

Purpose:

- create plots under farms
- capture size, soil type, status, and map information

### 6. Seasons module

Purpose:

- define production cycles
- attach seasons to farms
- track season status

### 7. Crops module

Purpose:

- manage crop plans by season and field
- track planting and expected harvest dates

### 8. Activities module

Purpose:

- track land preparation, planting, irrigation, weeding, harvesting, and related operations

### 9. Expenses module

Purpose:

- track categorized spending across farms, fields, crops, seasons, and activities

### 10. Yields module

Purpose:

- capture harvest output by crop, field, farm, and season

### 11. Inventory module

Purpose:

- manage stock items
- track stock in and stock out transactions
- link inventory movements to activities and expenses

### 12. Reports module

Purpose:

- expense summary
- yield summary
- activity summary
- dashboard view



### Recommended request flow

1. `TenantMiddleware` resolves tenant context
2. `JwtAuthGuard` authenticates bearer token
3. `RolesGuard` validates RBAC
4. `TenantAccessGuard` enforces tenant isolation
5. controller delegates to tenant-aware service methods
6. `ResponseInterceptor` wraps success payloads
7. `HttpExceptionFilter` standardizes errors

## Example DTOs

All DTOs use `class-validator` and are enforced globally through `ValidationPipe`.

## Authentication Flow

### Tenant onboarding flow

1. call `POST /api/tenants/onboard`
2. create tenant record
3. create default tenant settings
4. hash owner password with bcrypt
5. create tenant owner with role `TENANT_OWNER`

### Login flow

1. call `POST /api/auth/login`
2. validate email and password
3. verify tenant is active if user is tenant-bound
4. issue JWT access token and refresh token
5. persist hashed refresh token

### Authorization flow

1. client sends `Authorization: Bearer <token>`
2. JWT strategy validates token signature
3. guards validate role and tenant scope
4. service methods scope queries by `tenantId`

## Sample API Endpoints

### Tenants

- `POST /api/tenants/onboard`
- `GET /api/tenants`
- `GET /api/tenants/:id`
- `PATCH /api/tenants/:id`
- `PATCH /api/tenants/:id/settings`
- `PATCH /api/tenants/:id/activate`
- `PATCH /api/tenants/:id/deactivate`

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/deactivate`

### Operations

- `POST /api/farms`
- `POST /api/fields`
- `POST /api/seasons`
- `POST /api/crops`
- `POST /api/activities`
- `POST /api/expenses`
- `POST /api/yields`
- `POST /api/inventory/items`
- `POST /api/inventory/transactions`

### Reports

- `GET /api/reports/expenses`
- `GET /api/reports/yields`
- `GET /api/reports/activities`
- `GET /api/reports/dashboard`

## Pagination, Filtering, Search, and Sorting

List endpoints follow a shared pattern:

- `page`
- `limit`
- `search`
- `sortBy`
- `sortOrder`

Module-specific filters are also included such as:

- `farmId`
- `fieldId`
- `seasonId`
- `cropPlanId`
- `status`
- `category`
- date ranges

## Consistent API Format

Successful responses are wrapped by the global interceptor:

```json
{
  "success": true,
  "path": "/api/farms",
  "timestamp": "2026-04-22T10:00:00.000Z",
  "data": {}
}
```

Errors are normalized by the global exception filter:

```json
{
  "success": false,
  "path": "/api/farms",
  "timestamp": "2026-04-22T10:00:00.000Z",
  "error": {
    "message": "Farm not found."
  }
}
```

## Environment Variables

Copy `.env.example` into `.env` and update values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rutabena_farm?schema=public"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="change-me-too"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=8000
SWAGGER_PATH="docs"
TENANT_HEADER="x-tenant-id"
```

## Setup Instructions

```bash
yarn install
yarn prisma:generate
yarn prisma:migrate --name init
yarn prisma:seed
yarn start:dev
```

Swagger will be available at:

- `http://localhost:8000/docs`

## Seed Data

Sample seeded accounts:

- `superadmin@platform.local`
- `owner@greenharvest.com`

Default password used in the sample seed:

- `Password123!`

## Best Practices for Scaling

- keep tenant scoping in service queries, not just controllers
- validate related resource ownership before linking records across modules
- add audit logging for sensitive actions
- move report-heavy queries to read models or materialized views as data grows
- consider background jobs for analytics, notifications, and bulk imports
- add test coverage for tenant leakage and RBAC edge cases
- consider per-tenant rate limiting and API keys for integrations

## Future Improvements

- add invitation workflows and email delivery
- add file upload support for receipts and attachments
- add farm maps and GIS integration
- add audit trail tables
- add permission matrices beyond role-only checks
- add scheduled jobs and notifications
- add comprehensive unit and e2e tests
- add OpenTelemetry and structured logging
- add row-level Postgres security or schema-per-tenant if isolation requirements become stricter
