---
tags: [arca, spec, wscdc, verification]
created: 2026-04-20
estado: draft
fase: post-v0.1
depende_de: ["[[11 - Auth Proxy Pattern]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 23 — WSCDC (Constatacion de Comprobantes)

## Objetivo

Verificar que un comprobante emitido con CAE/CAEA existe y esta vigente contra ARCA. Util para conciliar facturas recibidas de proveedores.

## Ubicacion

```
src/services/verification/
  types/
    request.ts         # CmpReq
    response.ts        # ConstatarResult
  operations/
    dummy.ts
    constatar.ts
  _helpers.ts
```

## API publica

```typescript
arca.verification.dummy(): Promise<CdcDummyResult>;
arca.verification.constatar(req: CmpReq): Promise<ConstatarResult>;
```

## Operacion clave

`ComprobanteConstatar(Auth, CmpReq)` — retorna Resultado "A" (Aprobado), "R" (Rechazado) u "O" (Observado) + CUIT del CDC + errores/observaciones.

## Endpoints

Agrega `wscdc` a `ServiceEndpoints`:
- Testing: `https://wswhomo.afip.gov.ar/WSCDC/service.asmx`
- Produccion: `https://servicios1.afip.gov.ar/WSCDC/service.asmx`

## Manejo de errores

`WsCdcError extends WsnError`, codigos `CDC.${string}`.

## Criterios de aceptacion

- [ ] `arca.verification.dummy()` y `constatar(...)` invocables
- [ ] Auth Proxy con service="wscdc"
- [ ] Integration test gated para dummy

## Links

- [[Modelo de Errores]]
