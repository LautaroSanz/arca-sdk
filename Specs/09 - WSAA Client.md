---
tags: [arca, spec, wsaa]
created: 2026-04-19
estado: draft
fase: 1
depende_de:
  - "[[01 - Modulo Crypto - Firma PKCS7]]"
  - "[[02 - TRA Builder]]"
  - "[[03 - AccessTicket - Modelo]]"
  - "[[04 - TicketStorage - Interface]]"
  - "[[08 - NTP Time Sync]]"
  - "[[10 - SOAP Client Generico]]"
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 09 — WSAA Client

## Objetivo

Orquestar el flujo completo de autenticacion contra WSAA y devolver un `AccessTicket` valido, usando cache cuando corresponde.

## Ubicacion

`src/core/wsaa/client.ts`

## API publica

```typescript
export interface WsaaClientOptions {
  cuit: string;
  cert: string;
  key: string;
  environment: Environment;
  storage?: TicketStorage;  // default: MemoryTicketStorage
  clock?: NtpClock;         // default: createNtpClock()
  ttlSeconds?: number;      // TRA ttl, default 600
}

export class WsaaClient {
  constructor(opts: WsaaClientOptions);
  getTicket(service: string): Promise<AccessTicket>;
}
```

## Flujo de `getTicket`

1. `storage.get(service, cuit)` → si hay ticket no expirado, devolver
2. `now = await clock.now()`
3. `tra = buildTra({ service, now, ttlSeconds })`
4. `cms = signCms({ content: tra, cert, key })`
5. Invocar `loginCms(in0=cms.base64)` via SOAP
6. Parsear respuesta → extraer `token`, `sign`, `generationTime`, `expirationTime`
7. Construir `AccessTicket`
8. `storage.set(ticket)`
9. Retornar ticket

## Errores

- `WsaaError` segun [[Codigos de Error WSAA]]
- `CryptoError` si la firma falla
- `TimeSkewError` si WSAA responde error por clock skew (codigos conocidos)
- `SoapError` para fallos de transporte

## Criterios de aceptacion

- [ ] Dos llamadas consecutivas al mismo service: la segunda no toca la red
- [ ] Ticket expirado → se refresca automaticamente
- [ ] Error de WSAA se expone como `WsaaError` tipado

## Tests minimos

- Unit con mocks: reutiliza ticket cacheado
- Unit: respuesta de WSAA parseada correctamente
- Integracion (gated): ticket real contra homologacion

## Links

- [[WSAA - Flujo de Autenticacion]]
- [[Codigos de Error WSAA]]
- [[Modelo de Errores]]
