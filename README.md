# arca-sdk

SDK TypeScript para los web services de ARCA (ex-AFIP). Se conecta directo a los endpoints oficiales, sin proxies ni servicios intermedios.

Repo privado. No se publica en npm.

Ver documentacion detallada en la vault (entrada: `ARCA SDK - Index.md`).

## Alcance v0.1.0

- Autenticacion WSAA (firma PKCS#7, loginCms, cache de ticket 12h)
- Cliente SOAP generico con Auth Proxy que inyecta Token/Sign/Cuit
- WSFEv1 completo:
  - `FEDummy` (healthcheck)
  - `FECAESolicitar` (emision de CAE)
  - `FECompUltimoAutorizado` (ultimo comprobante emitido)
  - `FEParamGet*` (catalogos de tipos, monedas, cotizacion)
- Storage pluggable: memoria y filesystem de fabrica
- Ambientes homologacion y produccion

## Requisitos

- Node >= 20
- pnpm >= 9 (recomendado; corepack lo activa)
- Certificado X.509 + clave privada emitidos por ARCA

## Setup

```bash
pnpm install
pnpm run build
```

## Uso basico

```typescript
import { Arca } from "arca-sdk";
import { readFileSync } from "node:fs";

const arca = new Arca({
  cuit: "20XXXXXXXX9",
  cert: readFileSync("./cert.pem", "utf8"),
  key: readFileSync("./key.pem", "utf8"),
  environment: "testing",
});

// Healthcheck (no requiere ticket)
const status = await arca.electronicBilling.dummy();
console.log(status); // { AppServer: "OK", DbServer: "OK", AuthServer: "OK" }

// Ultimo comprobante autorizado
const last = await arca.electronicBilling.lastAuthorized({
  PtoVta: 1,
  CbteTipo: 6, // Factura B
});
console.log(last.CbteNro);

// Emitir factura
const result = await arca.electronicBilling.createInvoice({
  FeCabReq: { CantReg: 1, PtoVta: 1, CbteTipo: 6 },
  FeDetReq: [
    {
      Concepto: 1,
      DocTipo: 96,
      DocNro: 12345678,
      CbteDesde: last.CbteNro + 1,
      CbteHasta: last.CbteNro + 1,
      CbteFch: "20260419",
      ImpTotal: 121,
      ImpTotConc: 0,
      ImpNeto: 100,
      ImpOpEx: 0,
      ImpTrib: 0,
      ImpIVA: 21,
      MonId: "PES",
      MonCotiz: 1,
      Iva: { AlicIva: [{ Id: 5, BaseImp: 100, Importe: 21 }] },
    },
  ],
});
console.log(result.FeDetResp[0].CAE);
```

## Storage persistente

Por default el ticket se cachea en memoria. Para persistir en disco:

```typescript
import { Arca, FsTicketStorage } from "arca-sdk";

const arca = new Arca({
  cuit: "...",
  cert,
  key,
  environment: "testing",
  storage: new FsTicketStorage({ dir: "./.arca-tickets" }),
});
```

O implementa `TicketStorage` para enchufar Redis, DynamoDB, etc.

## Manejo de errores

Toda excepcion lanzada por el SDK es instancia de `ArcaError`:

```typescript
import { Arca, WsfeError, DuplicateInvoiceError } from "arca-sdk";

try {
  await arca.electronicBilling.createInvoice(input);
} catch (err) {
  if (err instanceof DuplicateInvoiceError) {
    console.log("Ya autorizado, CAE:", err.existingCae);
  } else if (err instanceof WsfeError) {
    console.log("Error WSFEv1:", err.code, err.message);
  } else {
    throw err;
  }
}
```

## Scripts

```bash
pnpm run build       # dual ESM + CJS con tipos
pnpm run test        # vitest run
pnpm run test:watch  # vitest watch
pnpm run typecheck   # tsc --noEmit
pnpm run lint        # eslint
pnpm run format      # prettier
```

## Estructura

```
src/
  config/             # endpoints por ambiente
  core/
    crypto/           # firma PKCS#7 (node-forge)
    errors/           # jerarquia de errores del SDK
    logging/          # Logger interface
    soap/             # SoapClient + Auth Proxy
    storage/          # TicketStorage + adaptadores
    wsaa/             # WsaaClient, TRA, NTP, AccessTicket
  services/
    electronic-billing/    # WSFEv1
  index.ts            # fachada publica (Arca class)
```

## Roadmap

Ver [Ejes/Roadmap.md](./Ejes/Roadmap.md) para fases futuras (Padron, WSFEXv1, WSMTXCA).

## Licencia

UNLICENSED — uso interno.
