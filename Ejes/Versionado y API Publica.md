---
tags: [arca, ejes, versionado, api]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Versionado y API Publica

## Semver estricto

- `MAJOR` — breaking change en API publica (renombres, cambios de firma, eliminacion)
- `MINOR` — features nuevas, nuevos servicios, campos opcionales
- `PATCH` — fixes, mejoras internas sin impacto en la API

## API publica

Es publico **todo lo exportado desde `src/index.ts`**, y solo eso.

Todo lo demas (archivos en `core/`, `services/*/internal/`, tipos privados) es **privado** y puede cambiar en cualquier release.

## Pre-1.0

Mientras estamos en `0.x.y`, los cambios menores pueden romper. Nos comprometemos a:

- Documentar breaking changes en `CHANGELOG.md`
- Dar una version con deprecation-first cuando el cambio es grande

## Fachada estable

Desde v0.1, la forma principal de uso es:

```typescript
import { Arca } from "arca-sdk";

const arca = new Arca({
  cuit: "20XXXXXXXX",
  cert: "...PEM...",
  key: "...PEM...",
  environment: "testing",
});

const res = await arca.electronicBilling.createInvoice({ /* ... */ });
```

Este shape se mantiene estable aunque mute el core interno.

## Releases y distribucion

- npm: `arca-sdk`
- `package.json` `type: "module"`, exports CJS + ESM
- Entrypoint: `./dist/index.js` / `./dist/index.mjs`
- Tipos: `./dist/index.d.ts`

## Links

- [[Vision y Alcance]]
- [[19 - Fachada Principal - index.ts]]
- [[Roadmap]]
