---
tags: [arca, ejes, roadmap]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Roadmap

Fases de implementacion en orden de ejecucion. Cada fase es shippable por si misma.

## Fase 0 — Fundamentos (1-2 dias)

Objetivo: proyecto inicializado, tooling funcional, sin codigo de dominio todavia.

- [[00 - Bootstrap del Proyecto]]
- [[07 - Config y Endpoints]]
- [[12 - Error Model del SDK]]
- [[13 - Logging]]

## Fase 1 — Autenticacion (3-5 dias)

Objetivo: obtener un ticket valido de WSAA y cachearlo.

- [[01 - Modulo Crypto - Firma PKCS7]]
- [[02 - TRA Builder]]
- [[03 - AccessTicket - Modelo]]
- [[04 - TicketStorage - Interface]]
- [[05 - TicketStorage - Adaptador en Memoria]]
- [[06 - TicketStorage - Adaptador FileSystem]]
- [[08 - NTP Time Sync]]
- [[09 - WSAA Client]]

> [!info] Hito
> Test de integracion que pide ticket al ambiente de homologacion y lo cachea.

## Fase 2 — Cliente SOAP (2-3 dias)

Objetivo: infraestructura generica para invocar cualquier WSN con Auth inyectado.

- [[10 - SOAP Client Generico]]
- [[11 - Auth Proxy Pattern]]

> [!info] Hito
> `FEDummy` responde exitoso atravesando el proxy.

## Fase 3 — WSFEv1 (5-7 dias)

Objetivo: emitir factura electronica end-to-end.

- [[14 - WSFEv1 - Tipos y DTOs]]
- [[18 - WSFEv1 - FEDummy (healthcheck)]]
- [[16 - WSFEv1 - FECompUltimoAutorizado]]
- [[17 - WSFEv1 - Metodos de Consulta (Parametros)]]
- [[15 - WSFEv1 - FECAESolicitar]]

> [!info] Hito
> Emision exitosa de factura tipo B en homologacion con CAE valido.

## Fase 4 — Fachada y primera release (1-2 dias)

- [[19 - Fachada Principal - index.ts]]
- README + ejemplos
- Publicar `arca-sdk` v0.1.0 en npm

## Post-v0.1

Servicios adicionales, en orden probable de demanda:

- [[Padron - Consultas|Padron A4/A10/A13]]
- [[WSFEXv1 - Factura Exportacion|WSFEXv1]]
- [[WSMTXCA - Factura con Detalle|WSMTXCA]]
- WSCDC (verificacion de CAE emitido)

## Links

- [[Vision y Alcance]]
- [[Estrategia de Testing]]
- [[Versionado y API Publica]]
