---
tags: [arca, sdk, integracion]
created: 2026-04-20
---

# Integracion con ARCA SDK

Esta app es **consumidora** del [[ARCA SDK - Index|arca-sdk]]. No reimplementa crypto, WSAA, ni SOAP — todo eso lo provee el SDK.

## Dependencia

```json
{
  "dependencies": {
    "@arca/sdk": "workspace:*"
  }
}
```

En desarrollo se consume via pnpm workspace o npm link. En produccion via version publicada (registry privado o publico).

## Superficie del SDK usada

De lo propuesto en [[Arquitectura para App Propia]]:

| Modulo del SDK | Uso en la app |
|---|---|
| `core/crypto` | Transparente (lo usa WSAA por dentro) |
| `core/wsaa` | Obtener Token+Sign por tenant. Cache 12hs |
| `core/soap` | Transparente (lo usan los servicios) |
| `core/storage` | Implementar adapter para nuestro storage (Postgres/Redis) |
| `services/electronic-billing` | **Core** — FECAESolicitar, FECompUltimoAutorizado, FEParamGet* |
| `services/register` | **Core** — getPersona_v2 para Padron A13 |
| `types` | DTOs de entrada/salida |

## Ejemplo de uso (pseudocodigo)

```typescript
import { ArcaClient } from "@arca/sdk";

const arca = new ArcaClient({
  env: "production",  // o "homologation"
  tenant: {
    cuit: "30712345678",
    cert: loadCertFromVault(tenantId),   // string PEM
    privateKey: loadKeyFromVault(tenantId),
  },
  ticketStorage: new PostgresTicketStorage(db, tenantId),
});

// El SDK maneja Token+Sign internamente (cache + renovacion)
const ultimoCbte = await arca.wsfev1.getUltimoAutorizado({
  puntoVenta: 1,
  cbteTipo: 6,  // Factura B
});

const response = await arca.wsfev1.solicitarCAE({
  cabecera: {
    cantReg: 1,
    puntoVenta: 1,
    cbteTipo: 6,
  },
  detalle: [{
    concepto: 1,
    docTipo: 80,
    docNro: "20111111112",
    cbteDesde: ultimoCbte + 1,
    cbteHasta: ultimoCbte + 1,
    cbteFch: "20260420",
    impTotal: 14000.00,
    impNeto: 11570.25,
    impIVA: 2429.75,
    monId: "PES",
    monCotiz: 1,
    iva: [{ id: 5, baseImp: 11570.25, importe: 2429.75 }],
  }],
});

if (response.resultado === "A") {
  saveInvoice({
    cae: response.cae,
    caeVto: response.caeVto,
    numero: ultimoCbte + 1,
  });
}
```

## Mapeo de errores

El SDK expone errores tipados; la app los mapea a mensajes de usuario:

| Error SDK | Mensaje al usuario |
|---|---|
| `WsaaAuthError` (cert invalido) | "Hay un problema con tu certificado de ARCA. Contactanos." |
| `WsaaAuthError` (service no autorizado) | "Tu CUIT no tiene habilitado WSFEv1. Tramitalo en ARCA." |
| `Wsfev1Error(10016)` (duplicado) | SDK reprocesa automaticamente, devuelve el CAE previo |
| `Wsfev1Error(10015)` (fecha invalida) | "La fecha de la factura es invalida." |
| `Wsfev1Error(1010)` (punto de venta no habilitado) | "Ese punto de venta no esta habilitado en ARCA." |
| `NetworkError` / timeout | Reintento automatico (backoff) — si persiste, notificar |

Ver [[Codigos de Error WSAA]] y documentacion de [[WSFEv1 - Factura Electronica|WSFEv1]] para listado completo.

## Modo homologacion

Cada tenant tiene un flag `env`. En fase beta, los tenants operan contra homologacion de ARCA. La app muestra banner "MODO PRUEBA — esta factura no es fiscal".

Migracion a produccion:
1. Tenant completa tramite de produccion en ARCA (autoriza nuevo cert)
2. Admin sube cert de prod
3. Flag `env` cambia a `production`
4. El SDK usa endpoints de produccion automaticamente

## Consulta de parametros

Algunos dropdowns dinamicos (tipos de comprobante, alicuotas IVA, puntos de venta) se leen via `FEParamGet*`. Cachear 24hs en Redis.

## Links

- [[ARCA SDK - Index]]
- [[Arquitectura para App Propia]]
- [[WSFEv1 - Factura Electronica]]
- [[WSAA - Flujo de Autenticacion]]
- [[Padron ARCA]]
- [[Multi-tenancy y Certificados]]
