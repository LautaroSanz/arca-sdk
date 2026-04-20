---
tags: [arca, spec, wsfev1, cae]
created: 2026-04-19
estado: draft
fase: 3
depende_de: ["[[11 - Auth Proxy Pattern]]", "[[14 - WSFEv1 - Tipos y DTOs]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 15 — WSFEv1: FECAESolicitar

## Objetivo

Operacion central: solicitar CAE para uno o varios comprobantes. Es el corazon de la facturacion electronica.

## Ubicacion

`src/services/electronic-billing/operations/fecae-solicitar.ts`

## API publica

```typescript
export interface FeCaeSolicitarInput {
  FeCabReq: FeCabRequest;        // cantidad, PtoVta, CbteTipo
  FeDetReq: FECAEDetRequest[];   // hasta 250
}

export interface FeCaeSolicitarResult {
  FeCabResp: FeCabResponse;
  FeDetResp: FECAEDetResponse[];
  Events: Evento[];
  raw: unknown;                  // XML crudo para auditoria
}

export async function solicitarCae(
  client: SoapClient,            // ya autenticado via Auth Proxy
  input: FeCaeSolicitarInput,
): Promise<FeCaeSolicitarResult>;
```

## Comportamiento

- Validacion local **minima** (cantidad coincidente entre cabecera y detalle; no duplicar validacion que hace ARCA)
- El `SoapClient` ya trae Auth inyectado via [[11 - Auth Proxy Pattern]]
- Respuestas con `Result="R"` → mapear a `WsfeError` con los `Errors[]` adentro
- Respuestas con `Result="A"` pero con `Observaciones[]` → success con observaciones expuestas

## Error especial

- Codigo ARCA `10016` (comprobante ya autorizado) → `DuplicateInvoiceError extends WsfeError` con el CAE existente en `err.context.existingCae` si ARCA lo devuelve.

## Criterios de aceptacion

- [ ] Emite factura B exitosamente en homologacion
- [ ] Observaciones no-fatales no rompen el flujo
- [ ] `Result="R"` → `WsfeError`
- [ ] Reintento de mismo comprobante → `DuplicateInvoiceError`

## Tests minimos

- Unit con fixtures de respuesta ARCA (happy, R, observaciones, 10016)
- Integracion gated: emitir factura real en homologacion (flag `ARCA_EMIT_REAL=1`)

## Links

- [[WSFEv1 - Factura Electronica]]
- [[14 - WSFEv1 - Tipos y DTOs]]
- [[Modelo de Errores]]
