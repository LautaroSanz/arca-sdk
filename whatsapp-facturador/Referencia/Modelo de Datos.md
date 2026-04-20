---
tags: [datos, schema, postgres, drizzle]
created: 2026-04-20
---

# Modelo de Datos

Esquema de Postgres (simplificado).

## Entidades principales

```
tenants ---< tenant_phones
    |
    +---< certificates
    |
    +---< wsaa_tickets (cache)
    |
    +---< messages ---< drafts ---< draft_items
    |                      |
    |                      +---< invoices ---< invoice_items
    |
    +---< audit_log
    |
    +---< padron_cache (opcional, compartida entre tenants)
```

## Tabla: `tenants`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| cuit | varchar(11) UNIQUE | |
| razon_social | text | |
| condicion_iva | text | enum: RI, MONO, EX, CF |
| punto_venta_default | int | |
| env | text | enum: homologation, production |
| alicuota_iva_default | numeric | 21.00 |
| umbral_doble_confirmacion | numeric | 500000 |
| timezone | text | America/Argentina/Buenos_Aires |
| status | text | active, suspended, pending_cert |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Index: `UNIQUE(cuit)`

## Tabla: `tenant_phones`

Numeros autorizados a facturar para un tenant.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| tenant_id | uuid FK | |
| wa_phone_number_id | text | el phone_number_id del bot |
| operator_wa_id | text | wa_id del operador autorizado |
| role | text | admin, operator |
| created_at | timestamptz | |

Index: `UNIQUE(tenant_id, operator_wa_id)`

## Tabla: `certificates`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| tenant_id | uuid FK | |
| env | text | homologation, production |
| secret_ref | text | id en secret manager |
| fingerprint | text | SHA-256 del cert publico |
| subject_cuit | text | del DN del cert |
| valid_from | timestamptz | |
| valid_to | timestamptz | |
| status | text | active, expired, revoked |
| uploaded_at | timestamptz | |
| uploaded_by | text | user id |

Index: `(tenant_id, env, status)`

## Tabla: `wsaa_tickets`

Cache de Token+Sign. Implementa `ITicketStorage` del SDK.

| Columna | Tipo | Notas |
|---|---|---|
| tenant_id | uuid PK | |
| service | text PK | wsfe, ws_sr_padron_a13, ... |
| token | text | |
| sign | text | |
| expires_at | timestamptz | |
| generated_at | timestamptz | |

Constraint: `PRIMARY KEY (tenant_id, service)`

Renovar antes de expires_at. Worker cron limpia vencidos.

## Tabla: `messages`

Mensajes entrantes de WhatsApp.

| Columna | Tipo | Notas |
|---|---|---|
| wamid | text PK | id de WhatsApp |
| tenant_id | uuid FK | |
| wa_id | text | emisor |
| type | text | audio, text, button_reply, ... |
| body | text | texto (si aplica) |
| media_ref | text | path en S3 si se guarda |
| transcription | text | texto transcripto |
| transcription_confidence | numeric | |
| raw_payload | jsonb | |
| received_at | timestamptz | |
| processed_at | timestamptz | |
| status | text | received, transcribed, extracted, failed_* |

## Tabla: `drafts`

Borradores de factura pendientes de confirmacion.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| tenant_id | uuid FK | |
| source_message_id | text FK messages(wamid) | |
| tipo_comprobante | text | |
| punto_venta | int | |
| concepto | text | |
| receptor_tipo_doc | text | |
| receptor_nro_doc | text | |
| receptor_nombre | text | |
| receptor_condicion_iva | text | |
| imp_neto | numeric(15,2) | |
| imp_iva | numeric(15,2) | |
| imp_total | numeric(15,2) | |
| moneda | text | PES |
| fecha_comprobante | date | |
| status | text | awaiting_confirmation, confirmed, cancelled, timed_out |
| preview_sent_at | timestamptz | |
| user_action | text | |
| confirmed_at | timestamptz | |
| created_at | timestamptz | |

Index: `(tenant_id, status)`, `(source_message_id)`

## Tabla: `draft_items`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| draft_id | uuid FK | |
| descripcion | text | |
| cantidad | numeric(10,2) | |
| precio_unitario | numeric(15,2) | |
| alicuota_iva | numeric(5,2) | |
| base_imp | numeric(15,2) | |
| iva | numeric(15,2) | |

## Tabla: `invoices`

Facturas emitidas (CAE obtenido).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| tenant_id | uuid FK | |
| draft_id | uuid FK | |
| idempotency_key | text UNIQUE | |
| tipo_comprobante | text | |
| punto_venta | int | |
| numero | int | |
| cae | text | |
| cae_vto | date | |
| imp_total | numeric(15,2) | |
| fecha_comprobante | date | |
| receptor_cuit | text | |
| pdf_ref | text | |
| raw_response | jsonb | |
| status | text | invoiced, delivered, failed_cae |
| created_at | timestamptz | |
| emitted_at | timestamptz | |

Index: `UNIQUE(tenant_id, punto_venta, tipo_comprobante, numero)` — garantiza no duplicados

## Tabla: `invoice_items`

Snapshot de items al momento de emitir (no FK a `draft_items` para preservar historico si el draft se borra).

## Tabla: `arca_outbox`

Outbox para emision CAE. Ver [[Idempotencia y Estado]].

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| invoice_id | uuid FK | |
| operation | text | FECAESolicitar |
| payload | jsonb | |
| status | text | pending, done, failed |
| attempts | int | |
| last_error | text | |
| next_attempt_at | timestamptz | |
| done_at | timestamptz | |

Index: `(status, next_attempt_at)` — worker picks pending ordered

## Tabla: `audit_log`

Append-only. Ver [[Seguridad y Cumplimiento]].

| Columna | Tipo |
|---|---|
| id | bigserial PK |
| tenant_id | uuid |
| actor | text |
| action | text |
| resource_type | text |
| resource_id | text |
| metadata | jsonb |
| ip | inet |
| user_agent | text |
| created_at | timestamptz |

Retencion: 10 años. Archivado a cold storage pasado el año 2.

## Tabla: `padron_cache`

| Columna | Tipo | Notas |
|---|---|---|
| cuit | varchar(11) PK | |
| nombre | text | |
| tipo_persona | text | FISICA / JURIDICA |
| condicion_iva | text | |
| domicilio | jsonb | |
| fetched_at | timestamptz | |
| expires_at | timestamptz | TTL 24hs |

Shared entre tenants (el dato es publico).

## Row Level Security (RLS)

Activar RLS en todas las tablas con `tenant_id`:

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON messages
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

Middleware de API setea `SET LOCAL app.tenant_id = '...'` al inicio de cada transaccion.

## Links

- [[Arquitectura Propuesta]]
- [[Idempotencia y Estado]]
- [[Multi-tenancy y Certificados]]
- [[Seguridad y Cumplimiento]]
