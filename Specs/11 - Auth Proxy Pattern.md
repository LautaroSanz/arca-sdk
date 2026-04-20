---
tags: [arca, spec, soap, auth]
created: 2026-04-19
estado: draft
fase: 2
depende_de: ["[[09 - WSAA Client]]", "[[10 - SOAP Client Generico]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 11 — Auth Proxy Pattern

## Objetivo

Envolver un `SoapClient` para que los metodos que requieren autenticacion reciban automaticamente el bloque `Auth` (Token+Sign+Cuit) sin que el codigo de servicio tenga que pensarlo.

Inspirado en [[arcasdk - TypeScript]].

## Ubicacion

`src/core/soap/auth-proxy.ts`

## API publica

```typescript
export interface AuthProxyOptions {
  soap: SoapClient;
  wsaa: WsaaClient;
  service: string;             // "wsfe", "ws_sr_padron_a4", ...
  authParamName?: string;      // default: "Auth"
  shouldAuthenticate?: (method: string) => boolean;
}

export function withAuth(opts: AuthProxyOptions): SoapClient;
```

## Comportamiento

Interceptar cada `call(method, args)`:

1. Si `shouldAuthenticate(method)` es `false` → pasar tal cual (ej. `FEDummy`)
2. Si no → `ticket = await wsaa.getTicket(service)`
3. Inyectar `args[authParamName] = { Token: ticket.token, Sign: ticket.sign, Cuit: ticket.cuit }`
4. Llamar al SOAP real

## Default de `shouldAuthenticate`

Heuristica: autenticar **a menos que** el metodo empiece con `FEDummy`, `Dummy`, o termine en `_Dummy`.

El consumidor puede pasar su propia funcion si la heuristica no aplica.

## Criterios de aceptacion

- [ ] `FEDummy` no dispara `getTicket`
- [ ] Metodos autenticados reciben `Auth` poblado
- [ ] Si `getTicket` lanza, el error llega al llamador sin tocar transporte SOAP
- [ ] No muta el `SoapClient` original (crea un wrapper)

## Tests minimos

- Unit con mocks de `WsaaClient` y `SoapClient`:
    - metodo dummy no autentica
    - metodo autenticado agrega `Auth`
    - error en WSAA no invoca SOAP

## Links

- [[Protocolo SOAP]]
- [[09 - WSAA Client]]
- [[10 - SOAP Client Generico]]
