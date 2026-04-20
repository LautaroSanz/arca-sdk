---
tags: [arca, spec, storage]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[04 - TicketStorage - Interface]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 05 — TicketStorage: Adaptador en Memoria

## Objetivo

Adaptador por defecto. Un `Map` en proceso. Ideal para serverless con reuso de contenedor, tests, y desarrollo local.

## Ubicacion

`src/core/storage/memory-storage.ts`

## API

```typescript
export class MemoryTicketStorage implements TicketStorage {
  constructor();
  // implementacion de get / set / delete
}
```

## Implementacion

- Clave: `${service}:${cuit}`
- `get` verifica expiracion y purga si vencido
- No hay TTL externo, la expiracion viene del ticket

## Criterios de aceptacion

- [ ] Pasa la suite de contrato de [[04 - TicketStorage - Interface]]
- [ ] Dos instancias son independientes (no hay estado global)

## Tests minimos

- Contract tests (reuso de la suite de la interface)
- Unit: ticket vencido → `get` retorna `null` y purga

## Links

- [[04 - TicketStorage - Interface]]
