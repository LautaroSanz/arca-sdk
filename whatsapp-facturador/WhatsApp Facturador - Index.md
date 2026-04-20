---
tags: [whatsapp, facturacion, arca, proyecto, index]
created: 2026-04-20
---

# WhatsApp Facturador - Proyecto de Investigacion

Investigacion y diseño de un sistema conversacional que recibe audios por WhatsApp, extrae la intencion de compra/venta, y emite facturas electronicas contra ARCA usando el [[ARCA SDK - Index|arca-sdk]].

## Arquitectura

- [[Contexto General]] — Que resuelve el producto, publico objetivo, alcance
- [[Flujo End-to-End]] — Pipeline completo desde el audio hasta el CAE
- [[Ingesta de WhatsApp]] — Webhook, tipos de mensaje, descarga de media
- [[Transcripcion de Audio (STT)]] — De OGG/Opus a texto
- [[Extraccion Estructurada (NLU)]] — De texto a estructura de factura
- [[Validacion y Confirmacion]] — Human-in-the-loop antes del CAE
- [[Integracion con ARCA SDK]] — Como esta app consume el SDK
- [[Multi-tenancy y Certificados]] — Gestion de cert X.509 por CUIT
- [[Idempotencia y Estado]] — Maquina de estados y deduplicacion
- [[Seguridad y Cumplimiento]] — PII, ToS de WhatsApp, record keeping fiscal

## Integraciones

- [[WhatsApp Cloud API (Meta)]] — Integracion directa con Meta
- [[Twilio WhatsApp]] — BSP con onboarding simple
- [[360dialog]] — BSP europeo con presencia LATAM
- [[Comparativa Proveedores WhatsApp]] — Tabla comparativa
- [[OpenAI Whisper]] — STT generalista
- [[Deepgram]] — STT baja latencia
- [[Google Speech-to-Text]] — STT enterprise
- [[Comparativa STT]] — Tabla comparativa
- [[LLMs para NLU]] — Claude, GPT, Gemini con function calling
- [[Padron ARCA]] — Consulta de datos del receptor

## Referencia

- [[Arquitectura Propuesta]] — Blueprint detallado de la implementacion
- [[Stack Tecnologico]] — Elecciones de libreria y framework
- [[Modelo de Datos]] — Entidades y relaciones
- [[Casos de Uso]] — Dialogos de ejemplo end-to-end
- [[Costos Estimados]] — Breakdown por factura emitida
- [[Plan de Fases]] — Roadmap de implementacion
- [[Riesgos y Mitigaciones]] — Tabla de riesgos tecnicos y de negocio
- [[Glosario]] — Terminos del dominio

## Casos Similares

- [[Conversational Commerce - Estado del Arte]] — Panorama del rubro
- [[Bots de Facturacion - Referencias]] — Productos y proyectos similares
