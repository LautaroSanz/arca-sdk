---
tags: [arca, spec, wsfev1, healthcheck]
created: 2026-04-19
estado: draft
fase: 3
depende_de: ["[[10 - SOAP Client Generico]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 18 — WSFEv1: FEDummy (healthcheck)

## Objetivo

Chequear que el endpoint de WSFEv1 esta vivo, sin autenticacion. Primer test end-to-end del cliente SOAP contra ARCA.

## Ubicacion

`src/services/electronic-billing/operations/dummy.ts`

## API publica

```typescript
export interface DummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

export async function dummy(client: SoapClient): Promise<DummyResult>;
```

## Reglas

- **No requiere Auth**: se invoca sobre el `SoapClient` crudo, no sobre el autenticado
- Util como primer smoke test de infra

## Criterios de aceptacion

- [ ] Respuesta contra homologacion retorna al menos un server `OK`
- [ ] Tipado estricto sobre los tres valores

## Tests minimos

- Unit con fixture
- Integracion gated: siempre ejecuta cuando `ARCA_INTEGRATION=1`

## Links

- [[10 - SOAP Client Generico]]
- [[11 - Auth Proxy Pattern]]
