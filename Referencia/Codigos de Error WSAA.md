---
tags: [arca, wsaa, errores, referencia]
created: 2026-04-13
---

# Codigos de Error WSAA

Errores que puede devolver el [[WSAA - Flujo de Autenticacion|WSAA]] al intentar autenticarse.

## Lista de errores

| Codigo | Descripcion |
|---|---|
| `coe.notAuthorized` | No autorizado para acceder a servicios de ARCA |
| `coe.alreadyAuthenticated` | Ya tiene un TA valido para este WSN |
| `cms.bad` | CMS invalido |
| `cms.bad.base64` | No se puede decodificar Base64 |
| `cms.cert.notFound` | No se encontro certificado de firma en el CMS |
| `cms.sign.invalid` | Firma invalida |
| `cms.cert.expired` | Certificado expirado |
| `cms.cert.untrusted` | Certificado no emitido por CA confiable |
| `xml.bad` | No se puede parsear XML contra el schema |
| `xml.generationTime.invalid` | generationTime en el futuro o mas de 24h viejo |
| `xml.expirationTime.expired` | expirationTime anterior a la hora actual |
| `wsn.unavailable` | El WSN destino esta temporalmente no disponible |
| `wsn.notFound` | El servicio solicitado no existe |

## Notas

- Despues de ciertos errores, esperar al menos **60 segundos** antes de solicitar un nuevo TA
- Error `coe.alreadyAuthenticated`: Reutilizar el TA existente en vez de pedir uno nuevo
- Errores de `cms.*`: Revisar [[Certificados Digitales|certificados]] y proceso de firma
- Errores de `xml.*`: Verificar sincronizacion de reloj (usar NTP `time.afip.gov.ar`)

## Links

- [[WSAA - Flujo de Autenticacion]]
- [[Certificados Digitales]]
