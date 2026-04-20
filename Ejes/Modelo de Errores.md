---
tags: [arca, ejes, errores]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Modelo de Errores

## Jerarquia

```
ArcaError (abstract)
├── ConfigError           // config invalida antes de red
├── CryptoError           // firma PKCS#7, cert invalido, etc.
├── WsaaError             // respuestas de error de LoginCms
├── SoapError             // transporte SOAP (timeouts, HTTP != 200, fault no-WSAA)
├── WsnError (abstract)   // errores de negocio de WSN
│   ├── WsfeError         // errores de WSFEv1
│   └── ...               // uno por servicio
└── TimeSkewError         // reloj desincronizado vs NTP
```

## Propiedades comunes

Todo `ArcaError` tiene:

- `code: string` — codigo estable del SDK (ej. `WSAA.TOKEN_EXPIRED`)
- `message: string` — humano
- `cause?: unknown` — error original encadenado
- `context?: Record<string, unknown>` — CUIT, service, ambiente, etc. (sin datos sensibles)

## Mapeo de errores conocidos

- **WSAA**: ver [[Codigos de Error WSAA]]
- **WSFEv1 error 10016** (comprobante ya autorizado): clase `DuplicateInvoiceError extends WsfeError`, expone el CAE existente si ARCA lo devuelve en `context.existingCae`

## Reglas

1. **Nunca lanzar `Error` generico** desde codigo del SDK
2. **Nunca perder la causa**: siempre encadenar con `cause`
3. **Nunca loggear datos sensibles** (Token, Sign, cert, key)
4. Errores de red retryables deben ser detectables por `isRetryable(err)`

## Links

- [[Codigos de Error WSAA]]
- [[12 - Error Model del SDK]]
- [[13 - Logging]]
