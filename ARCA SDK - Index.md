---
tags: [arca, index, proyecto]
created: 2026-04-13
updated: 2026-04-19
---

# ARCA SDK - Proyecto

Implementacion propia en TypeScript de un SDK para los web services de ARCA (ex-AFIP). Este nodo es el punto de entrada a toda la documentacion: investigacion previa, ejes del proyecto y specs de implementacion.

## Ejes del proyecto

Documentacion transversal que rige como construimos el SDK.

- [[Vision y Alcance]] — que construimos, para quien, que queda afuera
- [[Principios de Diseño]] — decisiones que se aplican a todo el codigo
- [[Roadmap]] — fases de implementacion en orden
- [[Stack Tecnologico]] — librerias y herramientas elegidas
- [[Estrategia de Testing]] — unit, integration, contract
- [[Estrategia de Commits]] — por que commiteamos por fase del roadmap
- [[Modelo de Errores]] — jerarquia y reglas de manejo
- [[Versionado y API Publica]] — semver y superficie estable

## Specs

Unidades de trabajo chicas, una por componente. Cada una con API, criterios de aceptacion y tests minimos.

### Fase 0 — Fundamentos

- [[00 - Bootstrap del Proyecto]]
- [[07 - Config y Endpoints]]
- [[12 - Error Model del SDK]]
- [[13 - Logging]]

### Fase 1 — Autenticacion (WSAA)

- [[01 - Modulo Crypto - Firma PKCS7]]
- [[02 - TRA Builder]]
- [[03 - AccessTicket - Modelo]]
- [[04 - TicketStorage - Interface]]
- [[05 - TicketStorage - Adaptador en Memoria]]
- [[06 - TicketStorage - Adaptador FileSystem]]
- [[08 - NTP Time Sync]]
- [[09 - WSAA Client]]

### Fase 2 — Cliente SOAP

- [[10 - SOAP Client Generico]]
- [[11 - Auth Proxy Pattern]]

### Fase 3 — WSFEv1

- [[14 - WSFEv1 - Tipos y DTOs]]
- [[15 - WSFEv1 - FECAESolicitar]]
- [[16 - WSFEv1 - FECompUltimoAutorizado]]
- [[17 - WSFEv1 - Metodos de Consulta (Parametros)]]
- [[18 - WSFEv1 - FEDummy (healthcheck)]]

### Fase 4 — Release

- [[19 - Fachada Principal - index.ts]]

### Post-v0.1 — Servicios adicionales

- [[20 - Padron - Service]]
- [[21 - WSFEXv1 - Service]]

## Arquitectura

- [[ARCA - Contexto General]] — Que es ARCA, historia, alcance
- [[WSAA - Flujo de Autenticacion]] — El corazon de toda integracion
- [[Certificados Digitales]] — Gestion de certificados X.509
- [[Protocolo SOAP]] — Como funcionan las llamadas a los servicios

## Servicios Web

- [[Catalogo de Servicios]] — Todos los web services disponibles
- [[WSFEv1 - Factura Electronica]] — El servicio principal de facturacion
- [[WSFEXv1 - Factura Exportacion]] — Facturacion de exportacion
- [[WSMTXCA - Factura con Detalle]] — Facturacion con detalle de items
- [[Padron - Consultas]] — Servicios de consulta de padron

## SDKs Existentes

- [[Comparativa de SDKs]] — Tabla comparativa de todos los SDKs
- [[arcasdk - TypeScript]] — Clean Architecture, directo a ARCA
- [[pyafipws - Python]] — El mas completo, 15+ servicios
- [[facturajs - TypeScript]] — Referencia simple y legible
- [[AfipSDK - Comercial]] — Suite comercial multi-lenguaje (proxy)

## Referencia

- [[Endpoints y WSDLs]] — Todos los endpoints de testing y produccion
- [[Codigos de Error WSAA]] — Errores del servicio de autenticacion
- [[Documentacion Oficial]] — Links a docs de ARCA/AFIP
- [[Arquitectura para App Propia]] — Diseño propuesto para nuestra implementacion
