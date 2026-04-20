---
tags: [mercado, competencia, estado-del-arte]
created: 2026-04-20
---

# Conversational Commerce - Estado del Arte

Panorama del espacio donde vive este producto.

## Tendencia global

"Conversational commerce" — comercio via mensajeria — creció fuerte desde 2020:

- **Latinoamerica y Asia** son los mercados mas maduros por adopcion masiva de WhatsApp/WeChat
- Meta empuja con WhatsApp Business Platform, Click-to-WhatsApp ads, catalogo nativo
- Casos dominantes: atencion al cliente, carritos abandonados, notificaciones, onboarding

## Argentina: contexto

- WhatsApp tiene penetracion >90% en adultos con smartphone
- Cultura comercial ya usa el canal informalmente: muchos monotributistas reciben pedidos por WhatsApp y facturan aparte
- Fricciona cobrar + facturar: usualmente se hace en dos apps distintas (MercadoPago + Facturador AFIP)
- Oportunidad: **cerrar el loop venta → factura** sin salir de WhatsApp

## Audio como input

- En AR, los audios de WhatsApp son de uso masivo (mas que escribir para mayores de 35)
- STT de calidad es commodity desde 2023 (Whisper abrio el mercado)
- Input por audio baja barrera vs formularios

## LLMs en produccion (2025-2026)

- Function calling con schemas tipados es estable en Claude, GPT, Gemini
- Latencias de modelos "mini" (Haiku, gpt-4.1-mini, Gemini Flash) bajas enough para UX conversacional
- Prompt caching reduce 80-90% el costo en prompts repetidos

## Que hace viable el producto en 2026

1. **WhatsApp Cloud API + BSPs** maduros
2. **STT low-cost** con buena calidad es-AR
3. **LLMs baratos y precisos** con tool use
4. **ARCA webservices** estables (aunque en migracion AFIP→ARCA hubo ruido)
5. **Cloud infra barata** (Fly, Neon, Upstash) permite MVP con <$100/mes fijo

## Que NO existia hace 3 años

- STT open-source de calidad (pre-Whisper era Google/AWS caros)
- LLMs con function calling confiable
- WhatsApp Cloud API (era todo on-prem via Twilio/360dialog con setup pesado)
- ORM TS decentes (Drizzle es de 2023)

## Links

- [[Bots de Facturacion - Referencias]]
- [[Contexto General]]
