---
tags: [arca, spec, soap]
created: 2026-04-19
estado: draft
fase: 2
depende_de: ["[[07 - Config y Endpoints]]", "[[12 - Error Model del SDK]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 10 — SOAP Client Generico

## Objetivo

Wrapper delgado sobre la libreria `soap` que:

- Acepta WSDL embebido (string) o URL
- Normaliza errores a `SoapError`
- Expone un objeto-cliente tipado para pasar al [[11 - Auth Proxy Pattern]]

## Ubicacion

`src/core/soap/client.ts`

## API publica

```typescript
export interface SoapClientOptions {
  wsdl: string | { url: string };  // string = WSDL embebido
  endpoint: string;
  timeoutMs?: number;              // default 30_000
}

export interface SoapClient {
  call<TIn, TOut>(method: string, args: TIn): Promise<TOut>;
}

export function createSoapClient(opts: SoapClientOptions): Promise<SoapClient>;
```

## Comportamiento

- `wsdl` como string: usa API equivalente de `soap` para WSDL inline (sin fetch)
- `endpoint` sobreescribe el del WSDL (importante: el WSDL a veces tiene URLs viejas)
- Timeouts → `SoapError("SOAP.TIMEOUT")`
- Fault SOAP → `SoapError("SOAP.FAULT", { fault })`

## Criterios de aceptacion

- [ ] WSDL embebido funciona sin red al instanciar
- [ ] `endpoint` se aplica en la invocacion real
- [ ] Timeouts y faults mapeados a `SoapError`
- [ ] Reutilizable por cualquier servicio (WSFEv1, WSFEXv1, etc.)

## Tests minimos

- Unit con servidor SOAP dummy (nock o equivalente): happy path
- Unit: fault → `SoapError`
- Unit: timeout → `SoapError("SOAP.TIMEOUT")`

## Links

- [[Protocolo SOAP]]
- [[11 - Auth Proxy Pattern]]
- [[12 - Error Model del SDK]]
