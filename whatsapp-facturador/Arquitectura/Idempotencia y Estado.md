---
tags: [idempotencia, estado, fsm, confiabilidad]
created: 2026-04-20
---

# Idempotencia y Estado

Emitir una factura es una operacion con efecto externo irreversible (CAE en ARCA). La app debe ser tolerante a reintentos, caidas, y webhooks duplicados **sin emitir comprobantes de mas**.

## Fuentes de duplicacion posibles

1. **Webhook de WhatsApp reintenta** si no responde 200 rapido
2. **El usuario manda el mismo audio dos veces** (nerviosismo, no vio la respuesta)
3. **El usuario confirma el preview dos veces** (toca el boton dos veces)
4. **El worker reintenta** tras fallo transitorio
5. **ARCA devuelve timeout pero proceso el request** (lo mas peligroso)

## Maquina de estados

```
                    [cancel]
                       ^
                       |
received --> transcribed --> extracted --> awaiting_confirmation
                                                |
                                                | [confirm]
                                                v
                                           emitting
                                                |
                                                | [ok]
                                                v
                                            invoiced --> delivered
                                                |
                                                | [cae_failed]
                                                v
                                            failed_cae

estados de error intermedios:
  - failed_transcription
  - failed_extraction
  - cancelled
  - timed_out
```

Transiciones validas enforced en el codigo; transicion invalida -> error y alerta.

## Claves de idempotencia

| Operacion | Clave | Storage |
|---|---|---|
| Webhook inbound | `wamid` (id del mensaje de WhatsApp) | tabla `processed_messages` |
| Draft extraction | `message_id` | tabla `drafts` |
| Confirmacion | `draft_id` + `user_action` | constraint UNIQUE |
| Emision CAE | `tenant_id + punto_venta + tipo_cbte + numero_cbte` | tabla `invoices` |
| Request a ARCA | `idempotency_key` propio (UUIDv7) | outbox pattern |

## Outbox pattern para emision CAE

Lo mas critico. Secuencia:

```
1. BEGIN TX
2. INSERT INTO invoices (status='emitting', idempotency_key, ...) 
3. INSERT INTO arca_outbox (invoice_id, payload, status='pending')
4. COMMIT

5. Worker toma el outbox:
   - lock row
   - call arca.wsfev1.solicitarCAE(payload)
   - on success:
       UPDATE invoices SET cae=..., status='invoiced'
       UPDATE arca_outbox SET status='done'
   - on error 10016 (duplicado):
       UPDATE invoices con el CAE previo (SDK hace reproceso automatico)
       UPDATE arca_outbox SET status='done'
   - on otro error:
       si retriable: incrementar attempts, backoff
       si no retriable: UPDATE invoice SET status='failed_cae', notificar al usuario
```

## Numero de comprobante

ARCA requiere que los numeros sean **consecutivos** por (punto_venta, tipo_cbte). Estrategia:

- **NO pre-asignar** el numero en nuestra DB antes de llamar a ARCA
- Antes de cada `FECAESolicitar`, llamar a `FECompUltimoAutorizado` -> siguiente = ultimo + 1
- Si dos workers intentan emitir al mismo tiempo, ARCA rechaza al segundo con error 10015/10016 — reintentar consultando nuevamente

Alternativa: serializar emisiones del mismo (tenant, pto_vta, tipo) con advisory lock de Postgres:

```sql
SELECT pg_advisory_xact_lock(hashtext($1));  -- $1 = "tenant|pto|tipo"
```

## Timeouts

| Timeout | Valor | Accion |
|---|---|---|
| Webhook response | 5s | Responder 200 pase lo que pase, procesar en bg |
| STT | 15s | Reintentar 2 veces, si falla notificar usuario |
| LLM NLU | 10s | Reintentar 1 vez, fallback a preguntar campos |
| Padron lookup | 5s | Si falla, pedir datos al usuario |
| WSFEv1 request | 30s | Reintentar con backoff exponencial (SDK lo hace) |
| Confirmacion usuario | 24hs | Descartar draft, avisar |

## Persistencia de mensajes raw

Guardar en una tabla `messages`:
- `wamid` (PK)
- `tenant_id`
- `wa_id` del remitente
- `type` (audio/text/...)
- `raw_payload` (JSONB)
- `media_url` (temporal, sobrescrito tras descarga)
- `media_storage_ref` (S3/GCS key permanente si aplica politica de retencion)
- `received_at`
- `processed_at`

## Links

- [[Flujo End-to-End]]
- [[Validacion y Confirmacion]]
- [[Integracion con ARCA SDK]]
- [[Modelo de Datos]]
- [[Seguridad y Cumplimiento]]
