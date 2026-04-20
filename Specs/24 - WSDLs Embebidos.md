---
tags: [arca, spec, wsdl, serverless]
created: 2026-04-20
estado: draft
fase: post-v0.1
depende_de: ["[[10 - SOAP Client Generico]]", "[[19 - Fachada Principal - index.ts]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 24 — WSDLs Embebidos (serverless cold-start)

## Objetivo

Permitir que el consumidor pase los WSDLs como strings al construir `Arca`, evitando el fetch HTTP del WSDL al primer uso de cada servicio. Critico para:
- Cold-start en serverless (AWS Lambda, Cloudflare Workers)
- Ambientes con egress restringido
- Resilencia cuando el URL de WSDL de ARCA esta momentaneamente caido

## Diseño

El SDK no hardcodea los WSDLs — podrian quedar desactualizados. En vez de eso, provee:

1. **Option `wsdls`** en `ArcaOptions` — un record parcial donde el usuario puede pasar el contenido de los WSDLs que necesite.
2. **Helper `fetchWsdls(env)`** que hace todos los fetches concurrentes una sola vez. El consumidor lo corre al boot (o al build) y memoriza el resultado.
3. **Default: fetch on first call** — si `wsdls[serviceKey]` no esta, el SoapClient fetchea `${endpoint}?WSDL` al primer uso (comportamiento actual).

## API publica

```typescript
export type ServiceWsdlKey =
  | "wsfev1" | "wsfexv1" | "wsmtxca" | "wscdc"
  | "padronA4" | "padronA10" | "padronA13";

export type ServiceWsdls = Partial<Record<ServiceWsdlKey, string>>;

export interface ArcaOptions {
  // ... existentes
  wsdls?: ServiceWsdls;
}

export function fetchWsdls(environment: Environment): Promise<ServiceWsdls>;
```

## Patron tipico en serverless

```typescript
// modulo wsdl-cache.ts, cargado una vez por contenedor
import { fetchWsdls } from "arca-sdk";
export const wsdlsPromise = fetchWsdls("production");

// handler.ts
import { Arca } from "arca-sdk";
import { wsdlsPromise } from "./wsdl-cache";

export async function handler(event: Event) {
  const wsdls = await wsdlsPromise; // resuelto en cold-start; cacheado en warm
  const arca = new Arca({ ..., wsdls });
  return arca.electronicBilling.createInvoice(event.invoice);
}
```

## Criterios de aceptacion

- [ ] `wsdls` en `ArcaOptions` opcional, pasa inline al SoapClient
- [ ] Si no se provee, fetch tradicional sigue funcionando
- [ ] `fetchWsdls(env)` devuelve los WSDLs de todos los servicios soportados
- [ ] Cache por clave de servicio (mismo Arca no re-crea SoapClient por llamada)

## Tests minimos

- Unit: `new Arca({ wsdls: { wsfev1: "...custom..." } })` no intenta fetch de URL cuando se hace una llamada WSFEv1
- Unit: `fetchWsdls` invoca fetch N veces (mockear global.fetch)

## Links

- [[10 - SOAP Client Generico]]
- [[19 - Fachada Principal - index.ts]]
- [[Principios de Diseño]]
