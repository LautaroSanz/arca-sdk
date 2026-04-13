---
tags: [arca, wsmtxca, facturacion, items]
created: 2026-04-13
---

# WSMTXCA - Factura Electronica con Detalle de Items

Servicio para emitir facturas domesticas (tipos A y B) **con detalle a nivel de articulo** incluyendo codigos de barra. RG 2904.

## Endpoints

| Ambiente | URL |
|---|---|
| Testing | `https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService` |
| Produccion | `https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService` |

## Diferencia con WSFEv1

- **[[WSFEv1 - Factura Electronica|WSFEv1]]**: Solo totales por alicuota de IVA. No incluye detalle de items.
- **WSMTXCA**: Incluye lineas de detalle con descripcion, cantidad, precio unitario, codigos de barra, etc.

## Casos de uso

- Cuando se necesita informar el detalle de cada articulo vendido
- Requerido por ciertas resoluciones para determinados rubros
- Permite asociar codigos de barra EAN/GTIN a cada item

## Links

- [[WSFEv1 - Factura Electronica]]
- [[Catalogo de Servicios]]
