---
tags: [arca, spec, ntp]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[07 - Config y Endpoints]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 08 — NTP Time Sync

## Objetivo

Ofrecer un `now()` alineado con NTP de ARCA para evitar que un reloj desincronizado cause rechazo del TRA (`generationTime` muy en el futuro o pasado).

## Ubicacion

`src/core/wsaa/ntp.ts`

## API publica

```typescript
export interface NtpClock {
  now(): Promise<Date>;
}

export function createNtpClock(server?: string): NtpClock;  // default: time.afip.gov.ar
export function createSystemClock(): NtpClock;              // fallback sin red
```

## Implementacion

- Default: `ntp-time-sync` contra `time.afip.gov.ar`
- Cachear offset entre clock del sistema y NTP por N segundos (default 300)
- Si NTP falla: log warning, fallback a system clock, NO tirar error

## Reglas

- El [[09 - WSAA Client|WSAA Client]] recibe un `NtpClock` inyectable (default: `createNtpClock()`)
- Si el consumidor confia en su reloj, puede pasar `createSystemClock()`

## Criterios de aceptacion

- [ ] `createSystemClock().now()` no hace red
- [ ] `createNtpClock()` respeta el `server` custom
- [ ] Fallo de red en NTP no rompe: retorna system time y warn log

## Tests minimos

- Unit con mock de `ntp-time-sync`: offset aplicado correctamente
- Unit: NTP lanza → fallback sistema

## Links

- [[Estrategia de Testing]]
- [[09 - WSAA Client]]
