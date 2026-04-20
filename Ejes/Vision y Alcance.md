---
tags: [arca, ejes, vision]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Vision y Alcance

## Que construimos

Un **SDK en TypeScript** que permita interactuar con los web services de ARCA (ex-AFIP) de forma directa, sin intermediarios ni proxies de terceros.

## Para quien

Desarrolladores que necesitan integrar facturacion electronica (y otros servicios de ARCA) en aplicaciones Node.js / serverless, manteniendo control total sobre certificados y credenciales.

## Dentro del alcance (v1)

- Autenticacion completa contra [[WSAA - Flujo de Autenticacion|WSAA]] (firma PKCS#7 + `loginCms` + cache de ticket)
- Cliente SOAP generico con Auth Proxy para inyeccion automatica de credenciales
- Servicio [[WSFEv1 - Factura Electronica|WSFEv1]] completo (factura electronica)
- Dos ambientes: homologacion y produccion
- Storage pluggable (memoria + filesystem de fabrica, extensible)
- Tipado fuerte en toda la API publica

## Fuera del alcance (v1)

- Servicios de padron, exportacion y detallada (quedan para v1.x)
- CLI de gestion de certificados (los usuarios ya los tienen)
- UI / dashboards
- Soporte a navegador (solo Node.js)

## No-objetivos

- **No somos un proxy**: nunca datos de usuarios pasan por servidores nuestros, a diferencia de [[AfipSDK - Comercial]]
- **No abstraemos la realidad tributaria**: exponemos las operaciones tal cual las define ARCA, con nombres consistentes pero sin reinterpretacion

## Criterios de exito

- Un desarrollador puede emitir una factura tipo B en homologacion en < 30 min siguiendo el README
- Cero dependencias sobre servicios intermedios
- Funciona en AWS Lambda / Cloudflare Workers sin modificacion

## Links

- [[Principios de Diseño]]
- [[Roadmap]]
- [[Arquitectura para App Propia]]
