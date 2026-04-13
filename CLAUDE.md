# ARCA SDK - Proyecto

## Objetivo

Construir una app/SDK propia en TypeScript para conectarse a los web services de ARCA (ex-AFIP, autoridad tributaria argentina). La implementación debe ser directa a ARCA (sin proxies de terceros).

## Contexto

Este repo contiene la investigación completa del ecosistema de web services de ARCA, organizada como vault de Obsidian con wikilinks. La nota `ARCA SDK - Index.md` es el punto de entrada.

### Arquitectura de ARCA

- Toda comunicación es SOAP sobre HTTPS
- **WSAA** (autenticación): firma un TRA con PKCS#7/CMS usando certificado X.509, envía a LoginCMS, recibe Token+Sign válidos por 12hs
- **WSN** (servicios de negocio): cada llamada SOAP lleva bloque Auth con Token+Sign+CUIT
- Dos ambientes: Homologación (testing) y Producción

### SDKs analizados como referencia

- `@arcasdk/core` (ralcorta/arcasdk) — Clean Architecture en TS, Auth Proxy Pattern, WSDLs embebidos, storage pluggable. La mejor referencia arquitectónica.
- `pyafipws` (reingart/pyafipws) — Python, el más completo (15+ servicios). Mejor referencia para entender el catálogo de servicios.
- `facturajs` (emilioastarita/facturajs) — TS simple, buena referencia para entender el protocolo crudo. Incluye NTP sync.
- `AfipSDK` (afipsdk.com) — Comercial/SaaS, proxea todo por sus servidores. NO usar como referencia de arquitectura.

## Stack planeado

- TypeScript
- `node-forge` para firma PKCS#7
- `soap` (npm) para cliente SOAP
- Vitest para testing
- tsup o esbuild para build

## Estructura planeada

```
src/
  core/
    crypto/           # Firma PKCS#7
    wsaa/             # Cliente WSAA + cache
    soap/             # Cliente SOAP genérico + Auth Proxy
    storage/          # Interfaces y adaptadores de storage
  services/
    electronic-billing/   # WSFEv1
    export-billing/       # WSFEXv1
    register/             # Padrón
  types/
  config/
  index.ts
```

## Endpoints clave

- WSAA Testing: `https://wsaahomo.afip.gov.ar/ws/services/LoginCms`
- WSFEv1 Testing: `https://wswhomo.afip.gov.ar/wsfev1/service.asmx`
- NTP: `time.afip.gov.ar`

## Notas

- Los archivos .md con wikilinks `[[Nota]]` son notas de Obsidian interconectadas
- La carpeta `.obsidian/` contiene config de la vault (graph view, plugins)
- Ver `Referencia/Arquitectura para App Propia.md` para el blueprint detallado
