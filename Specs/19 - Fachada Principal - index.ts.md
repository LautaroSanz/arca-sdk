---
tags: [arca, spec, fachada, api]
created: 2026-04-19
estado: draft
fase: 4
depende_de:
  - "[[09 - WSAA Client]]"
  - "[[11 - Auth Proxy Pattern]]"
  - "[[15 - WSFEv1 - FECAESolicitar]]"
  - "[[16 - WSFEv1 - FECompUltimoAutorizado]]"
  - "[[17 - WSFEv1 - Metodos de Consulta (Parametros)]]"
  - "[[18 - WSFEv1 - FEDummy (healthcheck)]]"
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 19 — Fachada Principal (`index.ts`)

## Objetivo

Superficie publica del SDK. Una sola clase `Arca` que expone los servicios ya cableados. El 90% de los consumidores solo toca esto.

## Ubicacion

`src/index.ts`

## API publica

```typescript
export interface ArcaOptions {
  cuit: string;
  cert: string;
  key: string;
  environment: Environment;
  storage?: TicketStorage;
  clock?: NtpClock;
  logger?: Logger;
}

export class Arca {
  constructor(opts: ArcaOptions);
  readonly electronicBilling: ElectronicBillingService;
  // mas servicios post-v0.1
}
```

## ElectronicBillingService

```typescript
export interface ElectronicBillingService {
  createInvoice(input: FeCaeSolicitarInput): Promise<FeCaeSolicitarResult>;
  lastAuthorized(input: UltimoAutorizadoInput): Promise<UltimoAutorizadoResult>;
  dummy(): Promise<DummyResult>;
  params: {
    tiposCbte(): Promise<TipoCbte[]>;
    tiposConcepto(): Promise<TipoConcepto[]>;
    // ...
  };
}
```

## Exports explicitos

Re-exportar solo:

- `Arca`, `ArcaOptions`
- Tipos de DTOs de cada servicio
- Clases de error
- `MemoryTicketStorage`, `FsTicketStorage`
- Interfaces extensibles (`TicketStorage`, `Logger`, `NtpClock`)

Nada del directorio `core/` se expone directamente.

## Criterios de aceptacion

- [ ] `new Arca({...}).electronicBilling.dummy()` funciona contra homologacion
- [ ] Solo esta exportado lo listado arriba (test de shape con `@microsoft/api-extractor` o equivalente)
- [ ] Los errores lanzados son instancias de `ArcaError`

## Tests minimos

- Shape test del export tree
- Integracion end-to-end: construccion + `dummy` + `lastAuthorized`

## Links

- [[Versionado y API Publica]]
- [[Vision y Alcance]]
