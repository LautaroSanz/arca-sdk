---
tags: [arca, sdk, comparativa]
created: 2026-04-13
---

# Comparativa de SDKs para ARCA/AFIP

## Tabla comparativa

| Caracteristica | [[arcasdk - TypeScript\|arcasdk]] | [[pyafipws - Python\|pyafipws]] | [[facturajs - TypeScript\|facturajs]] | [[AfipSDK - Comercial\|AfipSDK]] |
|---|---|---|---|---|
| **Lenguaje** | TypeScript | Python | TypeScript | JS/PHP/Python/Ruby |
| **Llamadas SOAP** | Directo a ARCA | Directo a ARCA | Directo a ARCA | **Proxy** via afipsdk.com |
| **Arquitectura** | Hexagonal/Clean | Modular (1 clase/WS) | Simple servicio+SOAP | Thin wrapper SaaS |
| **Firma WSAA** | Local (node-forge) | Local (3 backends) | Local (node-forge) | Server-side |
| **Cache de tickets** | File system (pluggable) | Archivo local | JSON local | Server-side |
| **Servicios** | WSFEv1, Padrones | **15+ servicios** | WSFEv1 | WSFEv1, Padrones |
| **Serverless** | Si (WSDLs embebidos) | No | No (cache en archivo) | Si (via proxy) |
| **Type safety** | Full TS con DTOs | Python tipico | TypeScript | JS con JSDoc |
| **Stars** | 97 | 344 | 115 | 192 (js) / 286 (php) |
| **Licencia** | MIT | LGPLv3 | MIT | MIT |

## Recomendacion por caso de uso

- **Para app TypeScript/Node propia**: [[arcasdk - TypeScript]] — mejor arquitectura, directo a ARCA
- **Para entender el protocolo crudo**: [[facturajs - TypeScript]] — codigo simple y legible
- **Para cubrir todos los servicios**: [[pyafipws - Python]] — el mas completo
- **Para MVP rapido**: [[AfipSDK - Comercial]] — pero dependes de un tercero

## Patron comun de firma PKCS#7

Todas las implementaciones directas usan el mismo flujo:

```
node-forge (JS/TS):
  forge.pkcs7.createSignedData() → addCertificate() → addSigner(SHA256) → sign()

cryptography (Python):
  PKCS7SignatureBuilder() → set_data() → add_signer() → sign(SHA256)

OpenSSL (PHP):
  openssl_pkcs7_sign()
```

## Links

- [[Arquitectura para App Propia]]
- [[WSAA - Flujo de Autenticacion]]
