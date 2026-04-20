---
tags: [stack, tecnologia, libs]
created: 2026-04-20
---

# Stack Tecnologico

Elecciones concretas con justificacion.

## Lenguaje y runtime

| Componente | Eleccion | Por que |
|---|---|---|
| Lenguaje | TypeScript 5.x | Mismo que arca-sdk, tipado fuerte, ecosistema grande |
| Runtime | Node.js 22 LTS | Estable, soporte de libs ARCA y proveedores |
| Alternativa runtime | Bun | Mas rapido pero ecosistema SOAP menos probado |

## HTTP server

| Opcion | Recomendado? |
|---|---|
| **Hono** | Si — minimal, rapido, compatible Node/Bun/Cloudflare Workers |
| Fastify | Alternativa si se quiere plugins mas maduros |
| Express | Evitar — legacy, middleware callback hell |

## Cola de trabajos

| Opcion | Recomendado? |
|---|---|
| **BullMQ** (Redis) | Si — maduro, retries, scheduling, rate limit por queue |
| Temporal.io | Overkill para MVP; reconsiderar si el FSM se complica |
| Inngest | SaaS, reduce ops pero lock-in |

## Persistencia

| Componente | Eleccion |
|---|---|
| DB transaccional | **Postgres 16** (RDS / Cloud SQL / Neon) |
| ORM | **Drizzle** (TS-first, migrations SQL, sin magia) |
| Alternativa ORM | Prisma (mas maduro, mas pesado) |
| Cache | **Redis 7** (tambien usado por BullMQ) |
| Blob storage | S3 / GCS (audios opt-in, PDFs) |
| Secret manager | GCP Secret Manager / AWS Secrets Manager |

## Integraciones externas

Ver notas detalladas:
- WhatsApp: [[Comparativa Proveedores WhatsApp]] → MVP con **Twilio**, escalar a **Meta directo**
- STT: [[Comparativa STT]] → **OpenAI Whisper**
- LLM NLU: [[LLMs para NLU]] → **Claude Haiku 4.5** via Anthropic API
- ARCA: [[Integracion con ARCA SDK]] → **@arca/sdk** (nuestro)

## Generacion de PDF

| Opcion | Recomendado? |
|---|---|
| **@react-pdf/renderer** | Si — JSX, versionable, sin browser |
| Puppeteer + HTML | Alternativa si se quiere CSS complejo (pesa mas) |
| jsPDF | Evitar — fea |

Template de factura debe cumplir RG 5616 (codigo QR, CAE, datos obligatorios).

## Validacion

| Lib | Uso |
|---|---|
| **Zod** | Validacion de inputs, schemas de tools de LLM, contratos de API |
| **ajv** | Alternativa si se necesita perf (muchos mas rapida en runtime) |

## Testing

| Tipo | Herramienta |
|---|---|
| Unit | **Vitest** (match con arca-sdk) |
| Integration | Vitest + testcontainers (Postgres efimero) |
| E2E | Playwright + bot simulado |
| Fixtures ARCA | Mocks de respuestas + sandbox homologacion |
| Fixtures WhatsApp | Webhooks grabados (VCR pattern) |

## Build y deploy

| Componente | Eleccion |
|---|---|
| Build | **tsup** (ESM + CJS, rapido) |
| Containerization | Docker multi-stage |
| Orquestacion | **Fly.io** (MVP), **Railway** o **GCP Cloud Run** (fase 2), **Kubernetes** (escala real) |
| CI/CD | GitHub Actions |
| Feature flags | PostHog / Unleash (fase 2) |

## Observabilidad

| Capa | Herramienta |
|---|---|
| Logs estructurados | **Pino** |
| Traces / APM | **OpenTelemetry** + Grafana Tempo / Honeycomb |
| Metricas | Prometheus + Grafana |
| Errors | **Sentry** |
| Uptime | BetterStack / UptimeRobot |

## Panel admin (web)

| Opcion | Recomendado? |
|---|---|
| **Next.js 15 (App Router)** | Si — React Server Components, simple |
| Remix | Alternativa si se prefiere SSR puro |
| Sin panel (CLI + Stripe-like portal) | Evitar — fricciona el onboarding |

## Package manager / monorepo

| | Eleccion |
|---|---|
| PM | **pnpm** (workspaces eficientes) |
| Monorepo tooling | **Turborepo** para cache de builds/tests |

## Resumen — dependencias top-level previstas

```json
{
  "dependencies": {
    "@arca/sdk": "workspace:*",
    "@anthropic-ai/sdk": "^0.40.0",
    "openai": "^5.0.0",
    "twilio": "^5.0.0",
    "hono": "^4.0.0",
    "bullmq": "^5.0.0",
    "drizzle-orm": "^0.35.0",
    "ioredis": "^5.0.0",
    "zod": "^4.0.0",
    "pino": "^9.0.0",
    "pino-http": "^10.0.0",
    "@react-pdf/renderer": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.0.0",
    "tsup": "^8.0.0",
    "testcontainers": "^10.0.0",
    "drizzle-kit": "^0.28.0"
  }
}
```

## Links

- [[Arquitectura Propuesta]]
- [[Integracion con ARCA SDK]]
- [[Plan de Fases]]
