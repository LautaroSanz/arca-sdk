---
tags: [arca, spec, wsfexv1, export-billing]
created: 2026-04-20
estado: draft
fase: post-v0.1
depende_de: ["[[11 - Auth Proxy Pattern]]", "[[14 - WSFEv1 - Tipos y DTOs]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 21 — WSFEXv1 (Factura de Exportacion)

## Objetivo

Implementar el servicio WSFEXv1 para emitir facturas de exportacion (tipos 19, 20, 21) contra ARCA. A diferencia de Padron, WSFEXv1 **si usa el bloque Auth al estilo WSFEv1**, asi que pasa por el [[11 - Auth Proxy Pattern|Auth Proxy]].

## Diferencia clave con WSFEv1

- Una sola operacion de autorizacion por request (no batched)
- Tipos especificos de exportacion: pais destino, Incoterms, permisos de embarque, idiomas, forma de pago, items con unidades de medida
- Operaciones: `FEXAuthorize`, `FEXGetLast_CMP`, `FEXGetLast_ID`, `FEXDummy`, `FEXGet*` (catalogos)

## Ubicacion

```
src/services/export-billing/
  types/
    ids.ts            # CbteTipoExport, TipoExpo, Idioma, IncotermCode
    request.ts        # Cmp, Item, Permiso, CmpAsoc
    response.ts       # FEXResultAuth, FEXErr, FEXEvent
    params.ts         # Pais, MonedaExport, TipoCbteExport
  operations/
    dummy.ts          # FEXDummy
    authorize.ts      # FEXAuthorize
    last-cmp.ts       # FEXGetLast_CMP
    last-id.ts        # FEXGetLast_ID
    cotizacion.ts     # FEXGetCotizacion
  _helpers.ts         # throwWsfexIfErrors
```

## API publica desde la fachada Arca

```typescript
arca.exportBilling.dummy(): Promise<FexDummyResult>;
arca.exportBilling.createInvoice(input: FexAuthorizeInput): Promise<FexAuthorizeResult>;
arca.exportBilling.lastAuthorized(input: { Cbte_Tipo: number; Pto_venta: number }): Promise<{ Cbte_nro: number }>;
arca.exportBilling.lastId(): Promise<{ Id: number }>;
arca.exportBilling.cotizacion(monId: string): Promise<{ Mon_ctz: number; Fch_cotiz: string }>;
```

## Manejo de errores

Nueva clase `WsfexError extends WsnError` con codigos `WSFEX.${string}`.

## Flujo tipico de emision

1. `lastId()` → obtener ultimo ID interno autorizado
2. Armar `Cmp` con `Id = lastId + 1`
3. `createInvoice(input)` → CAE

## Criterios de aceptacion

- [ ] Las 5 operaciones son invocables desde `arca.exportBilling.*`
- [ ] Auth Proxy inyecta el bloque Auth (service: `wsfex`)
- [ ] Errores ARCA mapeados a `WsfexError`
- [ ] Integration tests gated verifican `dummy` y `lastId`

## Tests minimos

- Unit con fixtures (happy + error) para authorize y last-cmp
- Integration gated: dummy + lastId + lastCmp

## Notas de implementacion

- WSFEXv1 no usa `CantReg` batched como WSFEv1. Un request = un comprobante.
- `Id` es un identificador interno del cliente (secuencial), distinto de `Cbte_nro` (numero de comprobante oficial).
- Algunos nombres de campos siguen convencion snake_case (ej. `Cbte_Tipo`, `Fecha_cbte`, `Pto_venta`) — se respeta literal para facilitar mapeo con la doc oficial.

## Links

- [[WSFEXv1 - Factura Exportacion]]
- [[Endpoints y WSDLs]]
- [[Modelo de Errores]]
