---
tags: [arca, spec, errores]
created: 2026-04-19
estado: draft
fase: 0
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 12 — Error Model del SDK

## Objetivo

Implementar la jerarquia descrita en [[Modelo de Errores]]. Clases concretas, serializables, con contexto sin datos sensibles.

## Ubicacion

`src/core/errors/`

Archivos:

- `base.ts` — `ArcaError` abstracta
- `config.ts`, `crypto.ts`, `wsaa.ts`, `soap.ts`, `wsn.ts`, `time.ts`

## API publica

```typescript
export abstract class ArcaError extends Error {
  abstract readonly code: string;
  readonly cause?: unknown;
  readonly context?: Record<string, unknown>;
  constructor(opts: {
    message: string;
    cause?: unknown;
    context?: Record<string, unknown>;
  });
  toJSON(): object;
}

export class ConfigError extends ArcaError { readonly code: `CONFIG.${string}`; }
export class CryptoError extends ArcaError { readonly code: `CRYPTO.${string}`; }
export class WsaaError extends ArcaError {
  readonly code: `WSAA.${string}`;
  readonly arcaCode?: string; // codigo numerico de ARCA si aplica
}
export class SoapError extends ArcaError { readonly code: `SOAP.${string}`; }
export class TimeSkewError extends ArcaError { readonly code: "TIME.SKEW"; }
export abstract class WsnError extends ArcaError {}
export class WsfeError extends WsnError { readonly code: `WSFE.${string}`; }
```

## Reglas

- `toJSON` no incluye `stack` ni datos sensibles
- Nunca serializar `Token`, `Sign`, `cert`, `key`
- `cause` se conserva (error chaining estilo ES2022)

## Utilidades

```typescript
export function isRetryable(err: unknown): boolean;
```

Retornable: `SOAP.TIMEOUT`, errores de red 5xx, ciertos codigos de WSAA.

## Criterios de aceptacion

- [ ] Todas las clases instanciables y `instanceof ArcaError`
- [ ] `toJSON` devuelve `{ name, code, message, context? }`
- [ ] `isRetryable` identifica errores de red/timeout retryables

## Tests minimos

- Unit: instanciacion, `instanceof`, `toJSON`
- Unit: `isRetryable` sobre matriz de errores

## Links

- [[Modelo de Errores]]
- [[Codigos de Error WSAA]]
