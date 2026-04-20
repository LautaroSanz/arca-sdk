---
tags: [arca, spec, logging]
created: 2026-04-19
estado: draft
fase: 0
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 13 — Logging

## Objetivo

Interfaz minima de logging que el SDK usa internamente. Por default silenciosa; el consumidor puede enchufar pino, console, o lo que prefiera.

## Ubicacion

`src/core/logging/logger.ts`

## API publica

```typescript
export interface Logger {
  debug(msg: string, meta?: Record<string, unknown>): void;
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
}

export const noopLogger: Logger;
export function consoleLogger(level?: "debug" | "info" | "warn" | "error"): Logger;
```

## Reglas

- **Nunca loggear** `token`, `sign`, `cert`, `key` — hay una lista de keys sensibles que se redacta automaticamente de `meta`
- El logger default es `noopLogger`
- El consumidor lo pasa al construir `Arca`

## Criterios de aceptacion

- [ ] `noopLogger` no imprime nada
- [ ] `consoleLogger("info")` ignora mensajes debug
- [ ] Sanitizacion de meta con keys sensibles

## Tests minimos

- Unit: sanitizacion de `{ token: "x" }` en meta
- Unit: niveles respetados

## Links

- [[Modelo de Errores]]
- [[Principios de Diseño]]
