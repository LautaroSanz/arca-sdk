---
tags: [arca, certificados, cripto, x509]
created: 2026-04-13
---

# Certificados Digitales

Los [[WSAA - Flujo de Autenticacion|WSAA]] requiere certificados X.509v3 para firmar los TRA.

## Requisitos del certificado

- Emitido por una CA reconocida por ARCA
- DN debe seguir RFC 2253
- Campos obligatorios:
  - `commonName`: Nombre de la aplicacion/servicio
  - `serialNumber` (OID 2.5.4.5): Debe contener `CUIT <numero>` (ej: `CUIT 20123456780`)
  - `organizationName`: Razon social
  - `countryName`: Codigo de pais ISO 3166

## Por ambiente

### Testing (Homologacion)

- Se gestiona a traves de **WSASS** (Autoservicio de Acceso a APIs de Homologacion)
- Se accede via clave fiscal
- Se solicita desde "Administrador de Relaciones de Clave Fiscal" usando clave fiscal de persona fisica (no juridica)
- Cadena de certificados: Vigencia 2022-2034

### Produccion

- Se gestiona a traves de "Administracion de Certificados Digitales"
- Cadena de certificados: Vigencia 2024-2035

## Asociacion con servicios

Los certificados deben estar **asociados al Web Service de Negocio especifico** que se va a acceder. Esta asociacion se configura a traves de:
- **WSASS** (para testing)
- **Administrador de Relaciones de Clave Fiscal** (para produccion)

## Formatos comunes

| Formato | Extension | Uso |
|---|---|---|
| PEM | .crt, .pem | Certificado en texto (base64) |
| PEM | .key | Clave privada en texto |
| PKCS#12 | .p12, .pfx | Certificado + clave en un solo archivo (Java/.NET) |

## En los SDKs

- [[arcasdk - TypeScript]]: Acepta contenido PEM como string (serverless-compatible)
- [[pyafipws - Python]]: Acepta rutas a archivos .crt y .key en disco
- [[facturajs - TypeScript]]: Acepta ambos (rutas o contenido directo)
- [[AfipSDK - Comercial]]: Las envias a sus servidores (ojo seguridad)

## Links

- [[WSAA - Flujo de Autenticacion]]
- [[Documentacion Oficial]]
