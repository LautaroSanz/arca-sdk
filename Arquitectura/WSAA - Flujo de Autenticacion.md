---
tags: [arca, wsaa, autenticacion, cripto]
created: 2026-04-13
---

# WSAA - Flujo de Autenticacion

El **WSAA (Web Service de Autenticacion y Autorizacion)** es el gateway central de autenticacion. Toda llamada a un servicio de negocio requiere un Ticket de Acceso (TA) valido obtenido del WSAA.

## Endpoints

| Ambiente | URL |
|---|---|
| Testing | `https://wsaahomo.afip.gov.ar/ws/services/LoginCms` |
| Produccion | `https://wsaa.afip.gov.ar/ws/services/LoginCms` |
| WSDL Testing | `https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl` |

## Flujo paso a paso

### Paso 1: Crear TRA (Ticket de Requerimiento de Acceso)

Construir un documento XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <source>cn=srv1,ou=facturacion,o=empresa,c=ar,serialNumber=CUIT 30123456789</source>
    <destination>cn=wsaa,o=afip,c=ar,serialNumber=CUIT 33693450239</destination>
    <uniqueId>4325399</uniqueId>
    <generationTime>2026-04-13T12:00:00-03:00</generationTime>
    <expirationTime>2026-04-13T12:10:00-03:00</expirationTime>
  </header>
  <service>wsfe</service>
</loginTicketRequest>
```

Campos clave:
- `source` (opcional): DN del certificado
- `destination` (opcional): Para produccion `cn=wsaa,o=afip,c=ar,serialNumber=CUIT 33693450239`; para homo `cn=wsaahomo,...`
- `uniqueId`: Entero sin signo de 32 bits (tipicamente timestamp unix)
- `generationTime`: Tolerancia hasta 24hs antes de la hora actual
- `expirationTime`: Tolerancia hasta 24hs despues de la hora actual
- `service`: Identificador del WSN destino (ej: `wsfe`, `wsfev1`, `ws_sr_padron_a4`)

### Paso 2: Firmar con CMS/PKCS#7

Generar un mensaje CMS "SignedData" que contiene:
- El XML del TRA
- La firma digital (SHA-256 + RSA)
- El [[Certificados Digitales|certificado X.509]]

Librerias usadas segun lenguaje:
| Lenguaje | Libreria |
|---|---|
| TypeScript/JS | `node-forge` (pkcs7.createSignedData) |
| Python | `cryptography` (PKCS7SignatureBuilder) o OpenSSL subprocess |
| PHP | Extension OpenSSL (openssl_pkcs7_sign) |
| Java | `EncriptadorCMS` con Java Keystore (.pfx) |
| C# .NET | PKCS#12 (.p12/.pfx) |

### Paso 3: Base64 encode del CMS

### Paso 4: Llamar a loginCms via SOAP

Enviar request SOAP con el CMS base64 como parametro `in0`:

```xml
<soapenv:Envelope>
  <soapenv:Body>
    <loginCms>
      <in0>BASE64_CMS_AQUI</in0>
    </loginCms>
  </soapenv:Body>
</soapenv:Envelope>
```

### Paso 5: Parsear el Ticket de Acceso (TA)

La respuesta contiene:

```xml
<loginTicketResponse version="1.0">
  <header>
    <source>cn=wsaa,o=afip,c=ar,serialNumber=CUIT 33693450239</source>
    <destination>cn=srv1,ou=facturacion,o=empresa,c=ar,serialNumber=CUIT 30123456789</destination>
    <uniqueId>383953094</uniqueId>
    <generationTime>2026-04-13T12:00:02-03:00</generationTime>
    <expirationTime>2026-04-14T00:00:02-03:00</expirationTime>
  </header>
  <credentials>
    <token>cES0SSuWIIPlfe5/dLtb0Qeg2jQu...</token>
    <sign>a6QSSZBgLf0TTcktSNteeSg3qXsM...</sign>
  </credentials>
</loginTicketResponse>
```

Extraer `token` y `sign` — estos se pasan a cada llamada de servicio.

### Paso 6: Usar Token + Sign en llamadas a servicios

Cada llamada SOAP a un WSN debe incluir:

```xml
<Auth>
  <Token>[token del TA]</Token>
  <Sign>[sign del TA]</Sign>
  <Cuit>[CUIT del contribuyente]</Cuit>
</Auth>
```

### Paso 7: Cachear el ticket

Los tickets valen **12 horas**. Implementaciones inteligentes:
- Cachean el TA localmente (archivo o memoria)
- Verifican expiracion antes de cada uso
- Solo solicitan nuevo TA cuando expira

## Errores comunes

Ver [[Codigos de Error WSAA]] para la lista completa.

## Implementaciones de referencia

- [[arcasdk - TypeScript]]: `auth.repository.ts` — Usa node-forge, storage pluggable
- [[pyafipws - Python]]: `wsaa.py` — 3 backends de firma (cryptography, OpenSSL bindings, subprocess)
- [[facturajs - TypeScript]]: `AfipSoap.ts` — Incluye sincronizacion NTP con `time.afip.gov.ar`

## Links

- [[Certificados Digitales]]
- [[Protocolo SOAP]]
- Spec oficial: `https://www.afip.gob.ar/ws/WSAA/Especificacion_Tecnica_WSAA_1.2.2.pdf`
