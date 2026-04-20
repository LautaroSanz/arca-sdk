---
tags: [arca, spec, bootstrap]
created: 2026-04-19
estado: draft
fase: 0
depende_de: []
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 00 — Bootstrap del Proyecto

## Objetivo

Dejar el repo listo para escribir codigo: TypeScript configurado, tooling de build, test y lint funcionales. Sin codigo de dominio todavia.

## Entregables

- `package.json` con scripts `build`, `test`, `test:watch`, `lint`, `typecheck`
- `tsconfig.json` en strict mode
- `tsup.config.ts` para build dual ESM/CJS
- `vitest.config.ts`
- `.eslintrc`, `.prettierrc`
- Estructura de carpetas de `src/` segun [[Arquitectura para App Propia]]
- `src/index.ts` exportando un placeholder tipado

## Decisiones congeladas

- Package name: `arca-sdk`
- Node target: `>=20`
- Module type: `module`
- Strict mode: on
- Ver [[Stack Tecnologico]]

## Criterios de aceptacion

- [ ] `npm install` corre limpio
- [ ] `npm run build` produce `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`
- [ ] `npm run test` pasa (con al menos un test trivial)
- [ ] `npm run typecheck` sin errores
- [ ] `npm run lint` sin warnings

## Tests minimos

- `src/index.test.ts` con un test dummy que valide que el export existe.

## Links

- [[Stack Tecnologico]]
- [[Arquitectura para App Propia]]
