---
tags: [arca, sdk, python, pyafipws]
created: 2026-04-13
---

# pyafipws - Python (El Pionero)

**Repo**: https://github.com/reingart/pyafipws (mirror: https://github.com/pyar/pyafipws)
**Stars**: 344 | **Forks**: 273 | **Licencia**: LGPLv3+
**Commits**: 3,031 (desde 2013)
**Autor**: Mariano Reingart

## El SDK mas completo

Es la implementacion mas antigua y exhaustiva. Cubre **15+ servicios** de ARCA y se integra con otros organismos (ANMAT, SENASA, ARBA).

## Arquitectura

Patron "helper-class-per-service" con PySimpleSOAP como capa de abstraccion SOAP.

| Modulo | Servicio | Descripcion |
|---|---|---|
| `wsaa.py` | [[WSAA - Flujo de Autenticacion\|WSAA]] | Autenticacion |
| `wsfev1.py` | [[WSFEv1 - Factura Electronica\|WSFEv1]] | Facturacion domestica |
| `wsfexv1.py` | [[WSFEXv1 - Factura Exportacion\|WSFEXv1]] | Facturacion exportacion |
| `wsmtxca.py` | [[WSMTXCA - Factura con Detalle\|WSMTXCA]] | Facturacion con detalle |
| `wsct.py` | WSCT | Turismo |
| `wsbfev1.py` | WSBFEv1 | Bonos fiscales |
| `wscdc.py` | WSCDC | Verificacion comprobantes |
| `wsltv.py` | WSLTV | Tabaco verde |
| `wslpg.py` | WSLPG | Granos |
| +varios mas | | Ganaderia, lecheria, etc. |

## Backends de firma WSAA

El `wsaa.py` tiene 3 backends:
1. **`sign_tra_new()`** — Python `cryptography` library (>= v39), PKCS7SignatureBuilder con SHA256
2. **`sign_tra_old()`** — Bindings directos a OpenSSL C via `Binding.lib`/`Binding.ffi`
3. **`sign_tra_openssl()`** — Subprocess al binario `openssl smime -sign`

## Flujo de facturacion WSFEv1

```python
from pyafipws.wsfev1 import WSFEv1
from pyafipws.wsaa import WSAA

# 1. Autenticacion
wsaa = WSAA()
tra = wsaa.CreateTRA(service="wsfe")
cms = wsaa.SignTRA(tra, cert_path, key_path)
ta = wsaa.LoginCMS(cms)

# 2. Configurar facturacion
wsfev1 = WSFEv1()
wsfev1.Conectar(wsdl="https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL")
wsfev1.SetTicketAcceso(wsaa.Token, wsaa.Sign)
wsfev1.Cuit = "20111111112"

# 3. Crear factura
wsfev1.CrearFactura(
    concepto=1, tipo_doc=80, nro_doc="30000000007",
    tipo_cbte=6, punto_vta=1, cbt_desde=1, cbt_hasta=1,
    imp_total="121.00", imp_neto="100.00", imp_iva="21.00",
    fecha_cbte="20260413", ...
)
wsfev1.AgregarIva(iva_id=5, base_imp="100.00", importe="21.00")

# 4. Solicitar CAE
cae = wsfev1.CAESolicitar()
print(f"CAE: {wsfev1.CAE}, Vto: {wsfev1.Vencimiento}")
```

## Interoperabilidad

- COM/OCX para Windows (Visual Basic, Visual FoxPro, Delphi, ABAP, C/C++)
- DLL/.so para codigo nativo
- I/O multi-formato: TXT (COBOL), CSV, DBF (xBase), XML, JSON
- GUI PyRece para usuario final
- Generacion de PDF (PyFPDF) y codigos de barra (PIL)

## Cache de tickets

Usa hash MD5 del servicio como nombre de archivo para cachear tickets localmente.

## Links

- [[Comparativa de SDKs]]
- [[WSAA - Flujo de Autenticacion]]
- Wiki: https://github.com/reingart/pyafipws/wiki
