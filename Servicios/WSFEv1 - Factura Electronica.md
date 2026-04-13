---
tags: [arca, wsfev1, facturacion, cae]
created: 2026-04-13
---

# WSFEv1 - Factura Electronica

El servicio mas utilizado de ARCA. Permite emitir comprobantes electronicos domesticos (tipos A, B, C, M) **sin detalle de items** y obtener el CAE (Codigo de Autorizacion Electronico).

## Endpoints

| Ambiente | URL |
|---|---|
| Testing | `https://wswhomo.afip.gov.ar/wsfev1/service.asmx` |
| Produccion | `https://servicios1.afip.gov.ar/wsfev1/service.asmx` |
| WSDL Testing | `https://wswhomo.afip.gov.ar/wsfev1/service.asmx?wsdl` |

## Operaciones principales

### Autorizacion de comprobantes

| Operacion | Descripcion |
|---|---|
| `FECAESolicitar` | **Solicitar CAE** para uno o mas comprobantes (hasta 250 por lote) |
| `FECAEASolicitar` | Solicitar CAEA (CAE Anticipado) |
| `FECAEARegInformativo` | Registrar datos informativos de CAEA |
| `FECAEASinMovimientoInformar` | Reportar periodo CAEA sin actividad |
| `FECAEASinMovimientoConsultar` | Consultar periodos sin actividad |
| `FECAEAConsultar` | Consultar datos de CAEA |

### Consultas

| Operacion | Descripcion |
|---|---|
| `FECompConsultar` | Consultar un comprobante autorizado |
| `FECompUltimoAutorizado` | Obtener ultimo numero de comprobante autorizado |
| `FECompTotXRequest` | Cantidad maxima de registros por request |

### Tablas de parametros

| Operacion | Retorna |
|---|---|
| `FEParamGetTiposCbte` | Tipos de comprobante |
| `FEParamGetTiposConcepto` | Tipos de concepto (productos, servicios, ambos) |
| `FEParamGetTiposDoc` | Tipos de documento |
| `FEParamGetTiposIva` | Alicuotas de IVA |
| `FEParamGetTiposMonedas` | Monedas |
| `FEParamGetTiposTributos` | Tributos |
| `FEParamGetTiposPaises` | Paises |
| `FEParamGetTiposOpcional` | Campos opcionales |
| `FEParamGetCotizacion` | Cotizacion de moneda |
| `FEParamGetPtosVenta` | Puntos de venta habilitados |
| `FEParamGetActividades` | Actividades economicas |
| `FEParamGetCondicionIvaReceptor` | Condiciones de IVA del receptor |

### Health check

| Operacion | Descripcion |
|---|---|
| `FEDummy` | Estado del servicio (appserver, authserver, dbserver) |

## Flujo tipico de facturacion

1. Obtener [[WSAA - Flujo de Autenticacion|Token + Sign]] via WSAA (service: `wsfe`)
2. `FECompUltimoAutorizado` — consultar ultimo comprobante
3. Construir request de factura con datos del comprobante
4. `FECAESolicitar` — enviar y obtener CAE
5. Verificar respuesta: `CAE` + `CAEFchVto` (fecha vencimiento)

## Estructura del request FECAESolicitar

```xml
<FECAEReq>
  <FeCabReq>
    <CantReg>1</CantReg>
    <PtoVta>1</PtoVta>
    <CbteTipo>6</CbteTipo>  <!-- 6 = Factura B -->
  </FeCabReq>
  <FeDetReq>
    <FECAEDetRequest>
      <Concepto>1</Concepto>  <!-- 1=Productos, 2=Servicios, 3=Ambos -->
      <DocTipo>80</DocTipo>   <!-- 80=CUIT -->
      <DocNro>20111111112</DocNro>
      <CbteDesde>1</CbteDesde>
      <CbteHasta>1</CbteHasta>
      <CbteFch>20260413</CbteFch>
      <ImpTotal>121.00</ImpTotal>
      <ImpTotConc>0</ImpTotConc>
      <ImpNeto>100.00</ImpNeto>
      <ImpOpEx>0</ImpOpEx>
      <ImpIVA>21.00</ImpIVA>
      <ImpTrib>0</ImpTrib>
      <MonId>PES</MonId>
      <MonCotiz>1</MonCotiz>
      <Iva>
        <AlicIva>
          <Id>5</Id>           <!-- 5 = 21% -->
          <BaseImp>100.00</BaseImp>
          <Importe>21.00</Importe>
        </AlicIva>
      </Iva>
    </FECAEDetRequest>
  </FeDetReq>
</FECAEReq>
```

## Manejo de errores y reproceso

Si ocurre error 10016 (comprobante ya autorizado), se puede usar flag `Reprocesar` para re-consultar el CAE previamente emitido. Esto es critico para evitar duplicados en caso de timeout de red.

## Links

- [[Catalogo de Servicios]]
- [[Endpoints y WSDLs]]
- [[WSAA - Flujo de Autenticacion]]
- [[Arquitectura para App Propia]]
