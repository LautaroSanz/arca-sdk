---
tags: [arca, spec, config]
created: 2026-04-19
estado: draft
fase: 0
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 07 — Config y Endpoints

## Objetivo

Tabla unica de URLs por ambiente. Cualquier componente que necesite un endpoint lo obtiene aca, nunca hardcodea.

## Ubicacion

`src/config/endpoints.ts`

## Tipos

```typescript
export type Environment = "testing" | "production";

export interface ServiceEndpoints {
  wsaa: string;
  wsfev1: string;
  wsfexv1: string;
  wsmtxca: string;
  padronA4: string;
  padronA10: string;
  padronA13: string;
  ntp: string;
}

export const ENDPOINTS: Record<Environment, ServiceEndpoints>;
```

## Valores clave (ver [[Endpoints y WSDLs]])

Testing:

- `wsaa`: `https://wsaahomo.afip.gov.ar/ws/services/LoginCms`
- `wsfev1`: `https://wswhomo.afip.gov.ar/wsfev1/service.asmx`
- `ntp`: `time.afip.gov.ar`

Produccion: equivalentes sin `homo`.

## Criterios de aceptacion

- [ ] Tipado congelado con `as const`
- [ ] No hay URLs hardcodeadas en otros archivos (`grep` lo prueba)
- [ ] Ambientes validos son solo `"testing" | "production"`

## Tests minimos

- Unit: ambos ambientes exponen las mismas keys
- Unit: URLs apuntan a `afip.gov.ar`

## Links

- [[Endpoints y WSDLs]]
- [[Vision y Alcance]]
