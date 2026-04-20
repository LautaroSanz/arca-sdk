---
tags: [arca, ejes, stack]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Stack Tecnologico

Decisiones de librerias y herramientas, con justificacion.

## Lenguaje y runtime

- **TypeScript** 5.x (strict mode)
- **Node.js** >= 20 LTS
- Build dual ESM + CJS

## Dependencias de produccion

| Paquete | Uso | Por que |
|---|---|---|
| `node-forge` | Firma PKCS#7/CMS | Probado en produccion por [[arcasdk - TypeScript]] y [[facturajs - TypeScript]] |
| `soap` | Cliente SOAP | De facto en Node.js para SOAP 1.1/1.2 con WSDL |
| `fast-xml-parser` | Parse XML auxiliar | Rapido, sin dependencias, mejor DX que `xml2js` |
| `ntp-time-sync` | Sincronizacion NTP | Requerido para evitar rechazo de TRAs por skew de reloj |

## Dependencias de desarrollo

| Paquete | Uso |
|---|---|
| `vitest` | Test runner |
| `tsup` | Build dual ESM/CJS |
| `typescript` | Compiler |
| `@types/node` | Tipos de Node |
| `eslint` + `@typescript-eslint` | Lint |
| `prettier` | Formato |

## Lo que NO usamos

- **axios / fetch wrappers**: la libreria `soap` ya maneja HTTP internamente
- **xml2js**: mas pesado y con tipos flojos frente a `fast-xml-parser`
- **openssl CLI**: todo el crypto es JS puro para portabilidad serverless
- **dotenv**: la config se recibe por parametros, no por env vars dentro del SDK

## Links

- [[Principios de Diseño]]
- [[00 - Bootstrap del Proyecto]]
