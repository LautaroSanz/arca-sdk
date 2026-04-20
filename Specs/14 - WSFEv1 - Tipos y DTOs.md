---
tags: [arca, spec, wsfev1, tipos]
created: 2026-04-19
estado: draft
fase: 3
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 14 — WSFEv1: Tipos y DTOs

## Objetivo

Modelar en TypeScript los tipos que WSFEv1 intercambia. Un archivo por grupo logico, todos re-exportados desde `src/services/electronic-billing/types/index.ts`.

## Ubicacion

`src/services/electronic-billing/types/`

Archivos:

- `ids.ts` — enums: `CbteTipo`, `Concepto`, `DocTipo`, `Moneda`, `IvaId`, `TributoId`
- `request.ts` — `FeCabRequest`, `FECAEDetRequest`, `AlicIva`, `Tributo`, `Opcional`, `CbteAsoc`
- `response.ts` — `FECAEResponse`, `FECAEDetResponse`, `Observacion`, `Evento`
- `params.ts` — tipos de retorno de `FEParamGet*`

## Reglas

- **Nombres exactos del WSDL** en los campos (ej. `CbteTipo`, `PtoVta`, `CbteDesde`) — no traducir
- Tipos primitivos TS apropiados (`number`, `string`, `Date` convertido desde `yyyymmdd`)
- JSDoc con la descripcion oficial de ARCA

## Enums clave (referencia rapida)

- `CbteTipo`: 1=A, 6=B, 11=C, 51=MiPyMe A, ... (lista completa en [[WSFEv1 - Factura Electronica]])
- `Concepto`: 1=Productos, 2=Servicios, 3=Productos y Servicios
- `DocTipo`: 80=CUIT, 96=DNI, 99=Consumidor Final

## Criterios de aceptacion

- [ ] Tipado cubre 100% de las operaciones priorizadas en Fase 3
- [ ] Re-export desde `types/index.ts` consistente
- [ ] JSDoc en enums con la descripcion oficial

## Tests minimos

- Typecheck en CI (no hay tests de runtime para tipos puros)

## Links

- [[WSFEv1 - Factura Electronica]]
- [[15 - WSFEv1 - FECAESolicitar]]
