---
tags: [arca, spec, wsmtxca, detailed-billing]
created: 2026-04-20
estado: draft
fase: post-v0.1
depende_de: ["[[11 - Auth Proxy Pattern]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 22 — WSMTXCA (Factura con Detalle)

## Objetivo

Implementar WSMTXCA — el servicio para facturas electronicas con detalle a nivel item (codigo, cantidad, unidad de medida, precio unitario). Complementa WSFEv1 (que factura solo totales).

## Diferencia clave con WSFEv1/WSFEXv1

- Convencion de nombres en camelCase (no snake_case)
- WSDL en Java, shape de respuesta distinta
- Usa Auth Proxy (service: `wsmtxca`)
- Una factura por request (no batched)

## Ubicacion

```
src/services/detailed-billing/
  types/
    request.ts        # ComprobanteCAERequest, ItemDetalle, CuotaIva
    response.ts       # ComprobanteCAEResponse, CodigoDescripcion, ErrorShape
  operations/
    dummy.ts
    autorizar.ts          # autorizarComprobante
    ultimo-autorizado.ts  # consultarUltimoComprobanteAutorizado
  _helpers.ts
```

## API publica desde la fachada Arca

```typescript
arca.detailedBilling.dummy(): Promise<MtxcaDummyResult>;
arca.detailedBilling.createInvoice(input: ComprobanteCAERequest): Promise<ComprobanteCAEResponse>;
arca.detailedBilling.lastAuthorized(input: { puntoDeVenta: number; codigoTipoComprobante: number }): Promise<{ numeroComprobante: number }>;
```

## Manejo de errores

`WsMtxcaError extends WsnError`, codigos `MTXCA.${string}`.

## Scope v1

Solo dummy + autorizar + lastAuthorized. Las operaciones de consulta de catalogos (`consultarTiposComprobante`, etc.) quedan para una iteracion posterior — el v1 cubre el flujo minimo de emision.

## Criterios de aceptacion

- [ ] Las 3 operaciones invocables desde `arca.detailedBilling.*`
- [ ] Auth Proxy inyecta bloque Auth con service="wsmtxca"
- [ ] Errores ARCA mapeados a `WsMtxcaError`
- [ ] Integration tests gated para dummy y lastAuthorized

## Notas de implementacion

Sin WSDL real disponible al escribir, los nombres exactos de los wrappers de respuesta (ej. `autorizarComprobanteResponse.return`, etc.) pueden requerir ajuste post-integration. Los tipos se dejan flexibles para absorber esa incertidumbre.

## Links

- [[WSMTXCA - Factura con Detalle]]
- [[Modelo de Errores]]
