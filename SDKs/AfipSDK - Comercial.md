---
tags: [arca, sdk, comercial, saas]
created: 2026-04-13
---

# AfipSDK - Suite Comercial (SaaS)

**Web**: https://afipsdk.com/
**GitHub org**: https://github.com/AfipSDK
**Clientes**: Rappi, Tiendanube, 100k+ downloads desde 2017

## Repos

| Repo | Lenguaje | Stars |
|---|---|---|
| [afip.js](https://github.com/AfipSDK/afip.js) | JS/TS | 192 |
| [afip.php](https://github.com/AfipSDK/afip.php) | PHP | 286 |
| [afip.py](https://github.com/AfipSDK/afip.py) | Python | 26 |
| [afip.rb](https://github.com/AfipSDK/afip.rb) | Ruby | 5 |

Tambien soportan: Java, Go, .NET, VB6, Flutter, n8n, Make, Zapier, Bubble, Pipedream (12+ integraciones).

## ATENCION: Modelo Proxy

Estos SDKs **NO hacen llamadas SOAP directas a ARCA**. Todas las requests pasan por `https://app.afipsdk.com/api/`.

El `executeRequest` en `AfipWebService.js` envia:
- Nombre del metodo SOAP
- Parametros
- Ruta WSDL
- Ambiente (homo/prod)

...al servidor centralizado de AfipSDK, que ejecuta la autenticacion WSAA y las llamadas SOAP.

## Implicaciones

- El certificado y clave privada **se envian a servidores de terceros**
- Dependencia total del uptime de afipsdk.com
- El `access_token` es para la plataforma AfipSDK, no para ARCA directamente
- Existe modo desarrollo con CUIT de prueba (20-40937847-2) sin certificado real

## Cuando usarlo

- MVP rapido sin preocuparse por SOAP/certs
- Cuando la conveniencia pesa mas que la independencia
- **No recomendado** si necesitas control total o manejo sensible de certificados

## Links

- [[Comparativa de SDKs]]
- [[Arquitectura para App Propia]]
