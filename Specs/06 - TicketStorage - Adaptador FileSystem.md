---
tags: [arca, spec, storage, fs]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[04 - TicketStorage - Interface]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 06 — TicketStorage: Adaptador FileSystem

## Objetivo

Persistir tickets en disco. Util para CLI y scripts locales que no quieren re-autenticar cada ejecucion.

## Ubicacion

`src/core/storage/fs-storage.ts`

## API

```typescript
export interface FsStorageOptions {
  dir: string;        // directorio base
  fileMode?: number;  // default 0o600
}

export class FsTicketStorage implements TicketStorage {
  constructor(opts: FsStorageOptions);
}
```

## Formato en disco

- Un archivo por `(service, cuit)`: `{dir}/{service}.{cuit}.json`
- JSON con el `AccessTicket` serializado (Dates como ISO strings)
- Perms `0o600` por defecto (contiene Token+Sign)

## Consideraciones

- `dir` debe existir o se crea con `recursive: true`
- Nunca logueamos el contenido
- Si el archivo esta corrupto: tratarlo como `null` (no romper flujo), warn en logger

## Criterios de aceptacion

- [ ] Pasa la suite de contrato de [[04 - TicketStorage - Interface]]
- [ ] Archivos se crean con mode `0o600`
- [ ] Archivo corrupto no rompe, retorna `null` y advierte por logger

## Tests minimos

- Contract tests sobre un `tmpdir`
- Unit: archivo corrupto → `get` retorna null

## Links

- [[04 - TicketStorage - Interface]]
- [[13 - Logging]]
