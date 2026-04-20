---
tags: [arca, spec, storage]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[03 - AccessTicket - Modelo]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 04 — TicketStorage (Interface)

## Objetivo

Definir el contrato que usa [[09 - WSAA Client]] para cachear tickets. Pluggable: desde memoria simple hasta Redis custom implementado por el consumidor.

## Ubicacion

`src/core/storage/ticket-storage.ts`

## Interfaz

```typescript
import type { AccessTicket } from "../wsaa/access-ticket";

export interface TicketStorage {
  get(service: string, cuit: string): Promise<AccessTicket | null>;
  set(ticket: AccessTicket): Promise<void>;
  delete(service: string, cuit: string): Promise<void>;
}
```

## Por que async

Aunque los adaptadores default (memoria, FS) podrian ser sincronicos, la interfaz es async para no forzar breaking changes cuando el consumidor quiera enchufar Redis, DynamoDB, etc.

## Reglas de implementacion

- `get` retorna `null` si no existe O si esta expirado (el storage decide si purgar)
- `set` sobreescribe si ya existe
- `delete` es idempotente

## Criterios de aceptacion

- [ ] Interfaz documentada con JSDoc
- [ ] Todos los adaptadores respetan el contrato
- [ ] Un test de contrato reusable verifica cualquier implementacion

## Tests minimos

- Suite de contrato parametrizable (`runContractTests(factory)`) que cada adaptador corre contra si mismo.

## Links

- [[05 - TicketStorage - Adaptador en Memoria]]
- [[06 - TicketStorage - Adaptador FileSystem]]
- [[Principios de Diseño]]
