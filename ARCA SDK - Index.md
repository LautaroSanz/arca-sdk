---
tags: [arca, index, proyecto]
created: 2026-04-13
---

# ARCA SDK - Proyecto de Investigacion

Investigacion completa del ecosistema de web services de ARCA (ex-AFIP) y los SDKs existentes, con el objetivo de construir una implementacion propia.

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
