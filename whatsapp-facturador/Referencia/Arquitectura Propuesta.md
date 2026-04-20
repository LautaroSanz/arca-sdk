---
tags: [arquitectura, blueprint, diseño]
created: 2026-04-20
---

# Arquitectura Propuesta

Blueprint detallado de la implementacion. Equivalente para esta app a lo que [[Arquitectura para App Propia]] es para el [[ARCA SDK - Index|arca-sdk]].

## Vista alta

```
                    +--------------------+
                    | WhatsApp (usuario) |
                    +---------+----------+
                              |
                              | HTTPS
                              v
                    +--------------------+
                    | Ingress / CDN      |
                    +---------+----------+
                              |
                              v
                    +--------------------+
                    | API (Hono / Fastify)|
                    |  - webhook handler |
                    |  - panel admin     |
                    +---------+----------+
                              |
                              | publish event
                              v
                    +--------------------+
                    | Queue (BullMQ)     |
                    +---+----+-----+-----+
                        |    |     |
          +-------------+    |     +---------------+
          v                  v                     v
     +---------+     +--------------+     +----------------+
     | Worker  |     | Worker       |     | Worker         |
     | STT     |     | NLU          |     | ARCA Emission  |
     +----+----+     +------+-------+     +-------+--------+
          |                 |                     |
          v                 v                     v
     +---------+     +--------------+     +----------------+
     | OpenAI  |     | Anthropic    |     | ARCA (via SDK) |
     +---------+     +--------------+     +----------------+
                              |
                              v
                     +----------------+
                     | Padron cache   |
                     +----------------+

Datos:
  - Postgres (tenants, mensajes, drafts, invoices, audit)
  - Redis (cache ticket WSAA, cache padron, rate limits)
  - S3/GCS (audios opt-in, PDFs de facturas)
  - Secret Manager (certs X.509)
```

## Modulos / paquetes (monorepo)

```
packages/
  sdk/                  # @arca/sdk (ver arca-sdk)
  core/                 # @app/core
    domain/             # entidades, value objects, tipos
    use-cases/          # casos de uso orquestadores
  adapters/
    whatsapp/           # @app/adapter-whatsapp
      meta-cloud.ts     # IWhatsAppProvider impl
      twilio.ts
      _360dialog.ts
    stt/                # @app/adapter-stt
      whisper.ts
      deepgram.ts
    llm/                # @app/adapter-llm
      claude.ts
      openai.ts
    secrets/
      gcp-secret-manager.ts
      aws-secrets-manager.ts
  api/                  # @app/api (express/hono)
    routes/
      webhooks/
      admin/
  workers/              # @app/workers (BullMQ)
    stt-worker.ts
    nlu-worker.ts
    emit-worker.ts
    cleanup-worker.ts
  web/                  # @app/web (panel admin Next.js / Remix)
  db/                   # @app/db (drizzle schema + migrations)
```

## Puertos (interfaces de dominio)

Cada adapter externo tiene una interfaz en `core`. El codigo de negocio NUNCA importa un proveedor directo.

```typescript
// core/ports/whatsapp.ts
export interface IWhatsAppProvider {
  sendText(to: string, body: string): Promise<SentMessage>;
  sendInteractive(to: string, body: string, buttons: Button[]): Promise<SentMessage>;
  sendDocument(to: string, url: string, filename: string): Promise<SentMessage>;
  downloadMedia(mediaId: string): Promise<Buffer>;
  verifyWebhookSignature(body: string, signature: string): boolean;
  parseIncoming(payload: unknown): IncomingMessage;
}

// core/ports/stt.ts
export interface ISpeechToText {
  transcribe(audio: Buffer, opts: STTOptions): Promise<Transcription>;
}

// core/ports/nlu.ts
export interface IInvoiceNLU {
  extract(input: NLUInput): Promise<DraftInvoice>;
}

// core/ports/secrets.ts
export interface ISecretStore {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
  rotate(key: string, newValue: string): Promise<void>;
}
```

## Casos de uso (use cases)

Cada uno orquesta puertos. Sin HTTP, sin BD directa — solo logica de dominio.

| Use case | Dispara |
|---|---|
| `HandleIncomingMessage` | webhook de WhatsApp con mensaje nuevo |
| `TranscribeAudio` | worker STT toma un evento |
| `ExtractInvoiceFromText` | worker NLU toma evento |
| `SendPreviewForConfirmation` | tras extraccion exitosa |
| `HandleUserConfirmation` | usuario toca boton |
| `EmitInvoice` | tras confirmacion |
| `DeliverInvoiceToUser` | tras CAE exitoso |
| `HandleCancellation` | usuario cancela |
| `HandleTimeout` | cron job |
| `OnboardTenant` | panel admin |
| `RotateCertificate` | panel admin / cron |

## Flujo concreto de "HandleIncomingMessage"

```typescript
class HandleIncomingMessage {
  constructor(
    private whatsapp: IWhatsAppProvider,
    private db: DB,
    private queue: Queue,
  ) {}

  async execute(payload: unknown, signature: string): Promise<void> {
    if (!this.whatsapp.verifyWebhookSignature(...)) throw new InvalidSignature();

    const msg = this.whatsapp.parseIncoming(payload);

    // Idempotencia
    const existing = await this.db.messages.findByWamid(msg.id);
    if (existing) return;  // dedup

    // Resolver tenant
    const tenant = await this.db.tenants.findByPhoneId(msg.phoneNumberId);
    if (!tenant) throw new UnknownTenant();

    await this.db.messages.insert({
      wamid: msg.id,
      tenantId: tenant.id,
      waId: msg.from,
      type: msg.type,
      rawPayload: payload,
      status: "received",
    });

    // Dispatch segun tipo
    if (msg.type === "audio") {
      await this.queue.publish("stt.transcribe", { messageId: msg.id });
    } else if (msg.type === "text") {
      await this.queue.publish("nlu.extract", { messageId: msg.id, text: msg.text });
    } else if (msg.type === "button_reply") {
      await this.queue.publish("user.action", { messageId: msg.id, payload: msg.buttonPayload });
    }
  }
}
```

## Decisiones arquitectonicas clave (ADRs)

1. **Monorepo con pnpm workspaces** — fricciona menos que multi-repo en esta etapa
2. **TypeScript en todo** — misma skill set, tipos compartidos entre SDK y app
3. **Colas en vez de async directo** — confiabilidad + throttling por tenant
4. **Postgres como source of truth** — ACID para la parte transaccional (invoices); Redis solo para cache
5. **Stateless workers** — escalan horizontal, idempotencia via DB
6. **Adapter pattern obligatorio para externos** — evita vendor lock-in

## Proximos pasos (si se pasa a implementacion)

Ver [[Plan de Fases]] para el detalle.

## Links

- [[Stack Tecnologico]]
- [[Modelo de Datos]]
- [[Flujo End-to-End]]
- [[Plan de Fases]]
- [[Arquitectura para App Propia]]
