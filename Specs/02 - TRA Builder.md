---
tags: [arca, spec, wsaa, tra]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[00 - Bootstrap del Proyecto]]", "[[08 - NTP Time Sync]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 02 — TRA Builder

## Objetivo

Construir el XML del Ticket de Requerimiento de Acceso (TRA) que WSAA espera, con timestamps correctos y `uniqueId` unico por request.

## Ubicacion

`src/core/wsaa/tra-builder.ts`

## API publica

```typescript
export interface BuildTraInput {
  service: string;      // ej. "wsfe"
  now?: Date;           // inyectable para test
  ttlSeconds?: number;  // default 600
}

export function buildTra(input: BuildTraInput): string; // XML
```

## Formato del TRA

```xml
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>{epoch}</uniqueId>
    <generationTime>{ISO con offset}</generationTime>
    <expirationTime>{ISO con offset}</expirationTime>
  </header>
  <service>{service}</service>
</loginTicketRequest>
```

## Reglas

- `uniqueId` = epoch en segundos (unico por request en la misma sesion)
- `generationTime` = `now - 60s` (margen anti-skew)
- `expirationTime` = `now + ttl` (default 10 min)
- Formato ISO 8601 con offset (`-03:00`)

## Dependencias

- El `now` lo obtiene quien invoque; [[09 - WSAA Client]] lo combina con [[08 - NTP Time Sync]] si esta habilitado.

## Criterios de aceptacion

- [ ] TRA es XML valido
- [ ] `generationTime < expirationTime`
- [ ] `uniqueId` cambia entre llamadas sucesivas
- [ ] `service` se respeta literal

## Tests minimos

- Unit: shape del XML con `now` fijo
- Unit: dos llamadas seguidas con distinto `uniqueId`

## Links

- [[WSAA - Flujo de Autenticacion]]
- [[01 - Modulo Crypto - Firma PKCS7]]
