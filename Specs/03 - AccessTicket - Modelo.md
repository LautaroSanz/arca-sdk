---
tags: [arca, spec, wsaa, ticket]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 03 — AccessTicket (Modelo)

## Objetivo

Representar el ticket que devuelve WSAA. Es el objeto que circula por todo el SDK y que el [[11 - Auth Proxy Pattern|Auth Proxy]] inyecta en cada llamada WSN.

## Ubicacion

`src/core/wsaa/access-ticket.ts`

## Tipo

```typescript
export interface AccessTicket {
  service: string;         // "wsfe", "ws_sr_padron_a4", ...
  cuit: string;
  token: string;           // opaco, del XML de WSAA
  sign: string;            // opaco
  generationTime: Date;
  expirationTime: Date;
  raw: string;             // XML completo, util para debug
}
```

## Helpers

```typescript
export function isExpired(ticket: AccessTicket, now?: Date): boolean;
export function isAboutToExpire(
  ticket: AccessTicket,
  marginSeconds: number,
  now?: Date,
): boolean;
```

## Reglas

- Dos tickets con mismo `(service, cuit)` son intercambiables; el cache los trata como tal
- `marginSeconds` default 60: refrescamos un minuto antes del vencimiento

## Criterios de aceptacion

- [ ] `isExpired` retorna `true` si `now > expirationTime`
- [ ] `isAboutToExpire(ticket, 60)` retorna `true` 30s antes de expirar
- [ ] La interfaz es serializable a JSON (para storage en disco)

## Tests minimos

- Unit: matriz de casos para `isExpired` e `isAboutToExpire`

## Links

- [[04 - TicketStorage - Interface]]
- [[09 - WSAA Client]]
