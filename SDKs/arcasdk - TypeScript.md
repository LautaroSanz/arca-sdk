---
tags: [arca, sdk, typescript, clean-architecture]
created: 2026-04-13
---

# arcasdk - TypeScript (Clean Architecture)

**Repo**: https://github.com/ralcorta/arcasdk
**npm**: `@arcasdk/core`
**Stars**: 97 | **Licencia**: MIT
**Ultimo update**: Abril 2026

## Arquitectura

Usa **Clean Architecture / Hexagonal (Ports & Adapters)** en un monorepo con NX.

```
packages/core/src/
  application/                    # Logica de negocio
    config/                       # Configuracion de ambiente
    dto/                          # Data Transfer Objects (resultados de cada operacion)
    ports/                        # Interfaces/contratos
      authentication/
      electronic-billing/
      generic/
      register/
    services/                     # Fachadas de servicio
      electronic-billing.service.ts    (25+ use cases)
      register-inscription-proof.service.ts
      register-scope-four/five/ten/thirteen.service.ts
      generic.service.ts
    use-cases/                    # Casos de uso individuales
      authentication/             # login, request-login, get-auth-params
      electronic-billing/         # create-voucher, get-sales-points, get-last-voucher,
                                  # get-caea, get-aliquot-types, etc. (25 use cases)
      register/
  domain/                         # Entidades core
    entities/                     # AccessTicket (Token, Sign, Expiration, isExpired())
    types/                        # Tipos de voucher
    value-objects/
  infrastructure/                 # Adaptadores tecnicos
    inbound/adapters/             # Clase fachada Arca
    outbound/
      adapters/
        auth/                     # AuthRepository (WSAA: TRA, firma, LoginCMS, cache)
        soap/                     # SoapClient, BaseSoapRepository (auth proxy)
        electronic-billing/
        register/
        logger/
        storage/                  # FileSystemTicketStorage
      ports/
    utils/                        # Cryptography utility
```

## Decisiones de diseno clave

### Auth Proxy Pattern

`BaseSoapRepository` usa JavaScript `Proxy` para interceptar llamadas SOAP e inyectar Token/Sign/Cuit automaticamente en metodos que requieren autenticacion (detectados inspeccionando el schema WSDL via `client.describe()`). El consumidor nunca maneja auth manualmente.

### WSDLs Embebidos

Los WSDL estan como strings dentro del codigo para compatibilidad con entornos serverless (Cloudflare Workers) donde no se puede hacer fetch externo.

### Storage Pluggable

El cache de tickets esta abstraido detras de `ITicketStoragePort`:
- `FileSystemTicketStorage` (default)
- Se puede implementar in-memory, Redis, etc.
- Modo `handleTicket` para inyeccion manual de credenciales (serverless)

### Deteccion de ambiente

Degradacion graceful para entornos no-Node (captura errores de import del modulo `https`).

## Servicios soportados

Via WSDLs embebidos:
- [[WSAA - Flujo de Autenticacion|WSAA]] (autenticacion)
- [[WSFEv1 - Factura Electronica|WSFE / WSFEv1]] (facturacion)
- [[Padron - Consultas|ws_sr_padron_a4, a5, a10, a13]] (padron)
- ws_sr_inscription_proof (constancia)

## Uso basico

```typescript
import { Arca } from '@arcasdk/core';

const arca = new Arca({
  key: '-----BEGIN RSA PRIVATE KEY-----\n...',
  cert: '-----BEGIN CERTIFICATE-----\n...',
  cuit: 20111111112,
  // production: false (default = homologacion)
});

// Facturacion
const lastVoucher = await arca.electronicBilling.getLastVoucher(salesPoint, voucherType);
const result = await arca.electronicBilling.createVoucher(voucherData);

// Padron
const taxpayer = await arca.registerScopeFour.getPersona(cuit);

// Health check
const status = await arca.electronicBilling.getServerStatus();
```

## Archivos clave para estudiar

- `infrastructure/outbound/adapters/auth/auth.repository.ts` — Flujo WSAA completo
- `infrastructure/outbound/adapters/soap/base-soap.repository.ts` — Auth Proxy Pattern
- `infrastructure/utils/crypt-data.ts` — Firma PKCS#7 con node-forge
- `application/services/electronic-billing.service.ts` — Orquestacion de use cases
- `domain/entities/access-ticket.ts` — Entidad de dominio del ticket

## Links

- [[Comparativa de SDKs]]
- [[Arquitectura para App Propia]]
- [[WSAA - Flujo de Autenticacion]]
