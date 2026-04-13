---
tags: [arca, soap, protocolo, wsdl]
created: 2026-04-13
---

# Protocolo SOAP

Todos los web services de ARCA utilizan **SOAP 1.1/1.2 sobre HTTPS** (TLS obligatorio).

## Estructura de una llamada tipica

1. Obtener [[WSAA - Flujo de Autenticacion|Ticket de Acceso]] (Token + Sign)
2. Construir request SOAP con bloque `Auth`:

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Body>
    <ar:FECAESolicitar>
      <ar:Auth>
        <ar:Token>TOKEN_AQUI</ar:Token>
        <ar:Sign>SIGN_AQUI</ar:Sign>
        <ar:Cuit>20111111112</ar:Cuit>
      </ar:Auth>
      <ar:FeCAEReq>
        <!-- datos de la factura -->
      </ar:FeCAEReq>
    </ar:FECAESolicitar>
  </soapenv:Body>
</soapenv:Envelope>
```

3. Parsear response SOAP

## WSDL

Cada servicio expone un WSDL que describe las operaciones disponibles. Ver [[Endpoints y WSDLs]] para la lista completa.

## Patrones de implementacion en los SDKs

### Auth Proxy Pattern ([[arcasdk - TypeScript]])

Usa `Proxy` de JavaScript para interceptar llamadas SOAP e inyectar Token/Sign/Cuit automaticamente. El consumidor nunca maneja auth manualmente.

### Cliente directo ([[pyafipws - Python]])

Usa PySimpleSOAP. Cada clase de servicio hereda de `BaseWS` y usa `self.client` para llamadas tipadas con `Auth={Token, Sign, Cuit}`.

### WSDLs embebidos ([[arcasdk - TypeScript]])

Los WSDL estan como strings dentro del codigo para funcionar en entornos serverless (Cloudflare Workers) donde no se puede hacer fetch del WSDL en runtime.

## Detalles tecnicos

- Sincronizacion de reloj recomendada via NTP: `time.afip.gov.ar`
- Validez del TA: 12 horas
- Rate limiting: Despues de ciertos errores WSAA, esperar al menos 60 segundos
- Politica de reuso: Reutilizar TA valido en vez de pedir uno nuevo

## Links

- [[WSAA - Flujo de Autenticacion]]
- [[Endpoints y WSDLs]]
- [[Catalogo de Servicios]]
