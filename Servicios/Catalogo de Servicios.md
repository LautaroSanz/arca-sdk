---
tags: [arca, servicios, catalogo]
created: 2026-04-13
---

# Catalogo de Servicios Web de ARCA

Lista completa de los web services expuestos por ARCA. Todos requieren [[WSAA - Flujo de Autenticacion|autenticacion WSAA]].

## Facturacion Electronica (Core)

| Servicio | Descripcion | Detalle |
|---|---|---|
| **[[WSFEv1 - Factura Electronica\|WSFEv1]]** | Factura electronica domestica | Tipos A, B, C, M. Sin detalle de items. Emite CAE/CAEA. RG 4291 |
| **[[WSMTXCA - Factura con Detalle\|WSMTXCA]]** | Factura con detalle de articulos | Tipos A y B con linea de items y codigos de barra. RG 2904 |
| **[[WSFEXv1 - Factura Exportacion\|WSFEXv1]]** | Factura de exportacion | Tipo E para comercio exterior. RG 2758 |
| **WSBFEv1** | Bonos Fiscales Electronicos | Bienes de capital con beneficios fiscales. RG 5427/2023 |
| **WSCT** | Comprobantes sector turismo | Tax free / devolucion de IVA. RG 3971 |
| **WSSeg** | Seguros de Caucion | Para companias de seguros. RG 2668 |

## Consulta de Padron

| Servicio | Descripcion |
|---|---|
| **[[Padron - Consultas\|ws_sr_padron_a4]]** | Alcance 4: situacion tributaria (impuestos inscriptos, regimenes) |
| **ws_sr_padron_a10** | Alcance 10: datos minimos/resumen del contribuyente |
| **ws_sr_padron_a13** | Alcance 13 |
| **ws_sr_padron_a100** | Alcance 100: consultas masivas de tablas de parametros |
| **ws_sr_constancia_inscripcion** | Constancia de inscripcion completa |

## Verificacion

| Servicio | Descripcion |
|---|---|
| **WSCDCV1** | Constatacion de comprobantes (validar CAI/CAE/CAEA recibidos) |

## Sector Agropecuario

| Servicio | Descripcion |
|---|---|
| **WSLPG** | Liquidacion Primaria de Granos |
| **WSLTV** | Liquidacion de Tabaco Verde |
| **WSLSP** | Liquidacion Sector Pecuario (ganaderia) |
| **WSLUM** | Lecheria - Liquidacion Mensual Unica |
| **WSLCA** | Liquidacion de Cana de Azucar |
| **WSCPE** | Carta de Porte Electronica |
| **WSCTG** | Codigo de Trazabilidad de Granos |

## Otros Servicios

| Servicio | Descripcion |
|---|---|
| **WSCREATEVEP** | Creacion de VEP (Volante Electronico de Pago) |
| **WSCCOMU** | Ventanilla Electronica (comunicaciones) |
| **WSICDB** | Registro de Beneficios Fiscales (debitos/creditos bancarios) |
| **TRABAJO_F931** | Consulta declaraciones juradas de seguridad social |
| **Regimen Percepcion IVA** | Consulta regimen de percepcion (RG 5319/2023) |

## Aduana

| Servicio | Descripcion |
|---|---|
| **WSCOC** | Consulta de operaciones cambiarias |
| **wDigDepFiel** | Depositario fiel de aduana |
| **WDEPMOVIMIENTOS** | Movimientos de terminal/deposito |
| **WSSV** | Seguimiento vehicular para monitoreo aduanero |
| **WSCES** | Coraza Electronica (sellado de seguridad) |

## Trazabilidad (otros organismos via ARCA)

| Servicio | Organismo | Descripcion |
|---|---|---|
| **TrazaMed** | ANMAT | Trazabilidad de medicamentos |
| **TrazaRenpre** | - | Precursores quimicos |
| **TrazaFito/TrazaVet** | SENASA | Trazabilidad agroquimicos |
| **COT** | ARBA | Documentacion de transporte provincial |

## Links

- [[Endpoints y WSDLs]]
- [[ARCA - Contexto General]]
- [[Documentacion Oficial]]
