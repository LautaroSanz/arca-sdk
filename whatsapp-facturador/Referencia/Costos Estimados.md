---
tags: [costos, unit-economics, pricing]
created: 2026-04-20
---

# Costos Estimados

Breakdown de costos variables por factura emitida y costos fijos de infraestructura.

## Costos variables (por factura)

Supuestos:
- Audio promedio: 15 segundos
- Texto transcripto: ~40 palabras, ~200 tokens
- System prompt LLM cacheado (90% cache hit tras warmup)
- 1 call a Padron (cacheado 24hs — hit rate ~80%)
- 1 conversacion WhatsApp (service, dentro de ventana 24h)

| Item | Provider | Calculo | Costo (USD) |
|---|---|---|---|
| STT | OpenAI Whisper | 0.25 min × $0.006 | 0.0015 |
| LLM NLU (hit cache) | Claude Haiku 4.5 | 300 in (cached) + 300 out × precios | 0.0016 |
| Padron (cache miss, 20%) | ARCA (gratis) | - | 0 |
| WhatsApp service | Twilio | $0.005 | 0.005 |
| DB write (Postgres) | RDS | ~0.0001 | 0.0001 |
| Storage (PDF ~50KB) | S3 | $0.023/GB × 0.00005 | ~0 |
| **Subtotal variable** | | | **~USD 0.008** |

A escala / optimizado (Meta directo, Whisper self-host o Deepgram):

| Item | Costo optimizado |
|---|---|
| STT | 0.001 |
| LLM | 0.0008 |
| WhatsApp | 0.0015 |
| Infra | 0.0001 |
| **Subtotal** | **~USD 0.003** |

## Costos fijos mensuales (MVP, hasta 100 tenants / 5K facturas/mes)

| Servicio | Config | Costo mensual (USD) |
|---|---|---|
| Hosting API + workers | Fly.io 2x shared-cpu-1x 1GB | 15 |
| Postgres | Neon / Supabase free-starter | 25 |
| Redis | Upstash pay-as-you-go | 10 |
| Storage | S3 | 5 |
| Secret Manager | GCP (1 secret/tenant × 100) | 40 |
| Sentry | Team plan | 29 |
| Uptime monitoring | BetterStack | 0 (free tier) |
| Domain + email | | 3 |
| **Total fijo** | | **~USD 127** |

## Unit economics

| Metrica | Valor |
|---|---|
| Costo marginal por factura (MVP) | $0.008 |
| Costo marginal por factura (optimizado) | $0.003 |
| Precio sugerido al tenant (por factura emitida) | $0.05 - $0.15 |
| Margen por factura (MVP, $0.10) | **~$0.09 (92%)** |
| Break-even mensual (MVP) | 127 / 0.09 = **1.400 facturas/mes** |

Alternativa: pricing por suscripcion (ej. USD 15/mes/tenant con hasta 500 facturas). Facil de vender, margen alto en usuarios livianos.

## Escenarios

### Escenario A: 20 tenants × 100 facturas/mes = 2.000 facturas

- Costo variable: 2000 × $0.008 = **$16**
- Costo fijo: **$127**
- Total: **$143/mes**
- Revenue a $0.10/factura: $200/mes
- Revenue a $15/tenant/mes: $300/mes
- **Margen: $57 - $157**

### Escenario B: 200 tenants × 300 facturas/mes = 60.000 facturas

- Costo variable: 60.000 × $0.005 (escala media) = **$300**
- Costo fijo escalado (+50%): **$190**
- Total: **$490/mes**
- Revenue a $20/tenant/mes (ajustado a volumen): **$4.000/mes**
- **Margen: $3.510 (87%)**

### Escenario C: 2.000 tenants × 500 facturas/mes = 1M facturas/mes

- Costo variable: 1M × $0.003 = **$3.000**
- Costo fijo (infra seria, migrado a Meta directo): **$1.500**
- Total: **$4.500/mes**
- Revenue a $30/tenant: **$60.000/mes**
- **Margen: $55.500 (92%)**

## Consideraciones de precio

Mercado argentino:
- AfipSDK: desde USD 9-49/mes por CUIT
- TusFacturas.app: desde ARS 10.000/mes
- Contabilium Plan Esencial: ARS 18.000/mes (incluye mas que facturacion)
- Monotributistas individuales: sensibles al precio; preferir plan con tope de facturas generoso

Sugerencia MVP:
- Free tier: 20 facturas/mes (friccion cero para probar)
- Basico: USD 10/mes, hasta 200 facturas
- Pro: USD 25/mes, hasta 1000 facturas + multi-operador + reportes

## Costos NO incluidos

- Certificado ARCA: gratis (tramite del tenant)
- Numero de WhatsApp: incluido en plan BSP
- Contabilidad / impuestos del operador del servicio
- Desarrollo y diseño (CAPEX)
- Marketing y ventas

## Links

- [[Plan de Fases]]
- [[Stack Tecnologico]]
- [[Comparativa Proveedores WhatsApp]]
- [[Comparativa STT]]
