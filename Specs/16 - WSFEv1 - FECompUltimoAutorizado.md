---
tags: [arca, spec, wsfev1]
created: 2026-04-19
estado: draft
fase: 3
depende_de: ["[[11 - Auth Proxy Pattern]]", "[[14 - WSFEv1 - Tipos y DTOs]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 16 — WSFEv1: FECompUltimoAutorizado

## Objetivo

Obtener el ultimo numero de comprobante autorizado para un `(PtoVta, CbteTipo)`. Necesario para calcular el proximo numero a emitir en [[15 - WSFEv1 - FECAESolicitar|FECAESolicitar]].

## Ubicacion

`src/services/electronic-billing/operations/ultimo-autorizado.ts`

## API publica

```typescript
export interface UltimoAutorizadoInput {
  PtoVta: number;
  CbteTipo: CbteTipo;
}

export interface UltimoAutorizadoResult {
  PtoVta: number;
  CbteTipo: CbteTipo;
  CbteNro: number;       // 0 si no hay comprobantes previos
  Events: Evento[];
}

export async function ultimoAutorizado(
  client: SoapClient,
  input: UltimoAutorizadoInput,
): Promise<UltimoAutorizadoResult>;
```

## Reglas

- Si ARCA devuelve `Errors[]` → `WsfeError`
- `CbteNro=0` es valido, significa "primera emision de esa combinacion"

## Criterios de aceptacion

- [ ] Devuelve numero correcto contra homologacion
- [ ] Errores mapeados a `WsfeError`

## Tests minimos

- Unit con fixture de respuesta
- Integracion gated

## Links

- [[15 - WSFEv1 - FECAESolicitar]]
- [[WSFEv1 - Factura Electronica]]
