---
tags: [roadmap, fases, plan]
created: 2026-04-20
---

# Plan de Fases

Roadmap desde cero hasta producto en produccion. Cada fase tiene criterios de salida claros.

## Fase 0 — Research y diseño (ACTUAL)

**Objetivo**: arquitectura validada, tecnologias elegidas, riesgos identificados.

**Entregables**:
- [x] Vault de investigacion (este repo)
- [x] Blueprint arquitectonico ([[Arquitectura Propuesta]])
- [x] Eleccion de stack ([[Stack Tecnologico]])
- [x] Modelo de datos ([[Modelo de Datos]])
- [x] Plan de fases (este doc)
- [x] Costos estimados ([[Costos Estimados]])
- [x] Analisis de riesgos ([[Riesgos y Mitigaciones]])

**Criterio salida**: Todo el diseño revisado por alguien con experiencia (dev senior / contador / usuario potencial). Feedback incorporado.

## Fase 1 — SDK ARCA funcional

**Precondicion**: el [[ARCA SDK - Index|arca-sdk]] debe existir como codigo, no solo research.

**Objetivo**: SDK capaz de emitir al menos Factura B contra homologacion.

**Entregables del SDK**:
- Estructura de monorepo TS
- `core/crypto` con firma PKCS#7 (node-forge)
- `core/wsaa` con cache ticket
- `core/soap` con cliente SOAP + Auth Proxy
- `core/storage` con adapters memory y postgres
- `services/electronic-billing` con FECAESolicitar + FECompUltimoAutorizado + FEParamGet* principales
- `services/register` con getPersona_v2 (A13)
- Tests contra homologacion (cert provisto por ARCA para testing)

**Duracion estimada**: 3-5 semanas full-time

**Criterio salida**: test e2e emite CAE real contra homologacion, sin errores.

## Fase 2 — MVP del bot (happy path)

**Objetivo**: bot funcional para 1 tenant (yo/el team), 1 caso de uso (factura B domestica con CF).

**Scope mínimo**:
- Webhook WhatsApp (Twilio Sandbox)
- STT via Whisper API
- NLU via Claude Haiku (schema simplificado)
- Validacion deterministica basica
- Preview con 3 botones
- Emision contra homologacion
- PDF simple
- Persistencia Postgres
- Queue BullMQ
- Un script de onboarding de tenant por CLI (no UI)

**Scope OUT**:
- Multi-tenant
- Panel web
- Facturas A con CUIT receptor
- Correcciones conversacionales
- Ley 25.326 compliance formal

**Duracion estimada**: 2-3 semanas

**Criterio salida**: yo mismo puedo dictar un audio y recibir un CAE de homologacion en <30 segundos.

## Fase 3 — Beta privada (5-10 tenants)

**Objetivo**: validacion real con usuarios.

**Entregables**:
- Onboarding guiado (panel minimo Next.js: subir cert, configurar punto vta default)
- Multi-tenant con RLS
- Soporte factura A + Padron lookup
- Correcciones conversacionales (reenviar audio/texto con cambios)
- Modo produccion de ARCA (el tenant decide cuando migrar)
- Doble confirmacion para montos altos
- Observabilidad (Sentry, logs estructurados)
- Politica de privacidad publica
- Registro AAIP iniciado

**Duracion estimada**: 4-6 semanas

**Criterio salida**:
- 5 tenants usando en produccion
- >90% de facturas emitidas sin correccion por el usuario
- 0 emisiones duplicadas
- 0 incidentes de datos

## Fase 4 — Lanzamiento (50-200 tenants)

**Objetivo**: producto self-serve listo para adopcion masiva.

**Entregables**:
- Landing page + signup self-serve
- Billing integrado (Mercado Pago / Stripe)
- Plan free + plans pagos
- Migracion a 360dialog (mejor pricing a escala)
- Templates WhatsApp aprobados (para renotificaciones)
- Soporte de mas tipos de comprobante (Notas de credito, factura C, monotributo)
- Reporte mensual de facturacion (resumen al tenant)
- Consulta de facturas emitidas via WhatsApp ("cuanto facturé hoy")
- Ley 25.326 cumplimiento formal (AAIP, DPO)

**Duracion estimada**: 2-3 meses

**Criterio salida**:
- 50 tenants pagos
- Churn <10%/mes
- NPS >40

## Fase 5 — Escala

**Objetivo**: crecimiento sostenido, costos optimizados.

**Trabajo**:
- Migracion a Meta Cloud API directo (ahorro en fees)
- A/B de STT (Whisper vs Deepgram)
- Optimizacion de prompt caching LLM
- Integraciones: contabilidad (Xero, Colppy), e-commerce (Tiendanube, Shopify)
- WSFEXv1 (factura exportacion) y WSMTXCA
- Facturacion recurrente (suscripciones mensuales)
- API publica para terceros
- Mobile app nativo (opcional)

## Fuera de roadmap (explicitamente)

- Facturas fuera de Argentina
- Payments processing (solo facturamos, no cobramos)
- ERP completo
- Gestion de stock
- Integracion con fiscal controller AR

## Links

- [[Arquitectura Propuesta]]
- [[Riesgos y Mitigaciones]]
- [[Costos Estimados]]
- [[Contexto General]]
