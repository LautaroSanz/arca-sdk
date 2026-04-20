---
tags: [arca, spec, wsfev1, params]
created: 2026-04-19
estado: draft
fase: 3
depende_de: ["[[11 - Auth Proxy Pattern]]", "[[14 - WSFEv1 - Tipos y DTOs]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 17 — WSFEv1: Metodos de Consulta (FEParamGet*)

## Objetivo

Envolver los endpoints de consulta de catalogos que ofrece WSFEv1. Utiles para UIs de facturacion (dropdowns de tipos de comprobante, alicuotas, etc.).

## Ubicacion

`src/services/electronic-billing/operations/params.ts`

## Operaciones incluidas

- `FEParamGetTiposCbte` → lista de `CbteTipo`
- `FEParamGetTiposConcepto` → conceptos
- `FEParamGetTiposDoc` → tipos de documento
- `FEParamGetTiposIva` → alicuotas de IVA
- `FEParamGetTiposMonedas`
- `FEParamGetTiposOpcional`
- `FEParamGetTiposTributos`
- `FEParamGetPtosVenta`
- `FEParamGetCotizacion(MonId: string)` → cotizacion vs peso

## API publica

Cada operacion es una funcion independiente, re-exportada como `params.*` desde el modulo del servicio:

```typescript
export async function getTiposCbte(client: SoapClient): Promise<TipoCbte[]>;
export async function getCotizacion(client: SoapClient, monId: string): Promise<Cotizacion>;
// ... una por endpoint
```

## Criterios de aceptacion

- [ ] Las 9 operaciones invocables
- [ ] Respuestas tipadas fuertemente
- [ ] Errores → `WsfeError`

## Tests minimos

- Unit con fixtures por operacion (al menos 3)
- Integracion gated sobre al menos `getTiposCbte` y `getCotizacion`

## Links

- [[WSFEv1 - Factura Electronica]]
- [[14 - WSFEv1 - Tipos y DTOs]]
