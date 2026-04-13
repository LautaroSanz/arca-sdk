---
tags: [arca, wsfexv1, exportacion, facturacion]
created: 2026-04-13
---

# WSFEXv1 - Factura de Exportacion

Servicio para emitir comprobantes electronicos de exportacion (tipo E). RG 2758.

## Endpoints

| Ambiente | URL |
|---|---|
| Testing | `https://wswhomo.afip.gov.ar/wsfexv1/service.asmx` |
| Produccion | `https://servicios1.afip.gov.ar/wsfexv1/service.asmx` |
| WSDL Testing | `https://wswhomo.afip.gov.ar/wsfexv1/service.asmx?wsdl` |

## Operaciones

| Operacion | Descripcion |
|---|---|
| `FEXAuthorize` | Autorizar factura de exportacion |
| `FEXGetCMP` | Consultar factura autorizada |
| `FEXGetLast_CMP` | Ultima factura autorizada |
| `FEXGetLast_ID` | Ultimo ID asignado |
| `FEXCheck_Permiso` | Verificar permiso de exportacion |
| `FEXGetPARAM_Cbte_Tipo` | Tipos de comprobante |
| `FEXGetPARAM_Ctz` | Cotizaciones |
| `FEXGetPARAM_DST_CUIT` | CUITs de destino |
| `FEXGetPARAM_DST_pais` | Paises destino |
| `FEXGetPARAM_Idiomas` | Idiomas |
| `FEXGetPARAM_Incoterms` | Incoterms |
| `FEXGetPARAM_MON` | Monedas |
| `FEXGetPARAM_Tipo_Expo` | Tipos de exportacion |
| `FEXGetPARAM_UMed` | Unidades de medida |
| `FEXDummy` | Health check |

## Links

- [[WSFEv1 - Factura Electronica]]
- [[Catalogo de Servicios]]
- [[Endpoints y WSDLs]]
