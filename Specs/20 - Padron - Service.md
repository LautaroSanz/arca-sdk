---
tags: [arca, spec, padron, register]
created: 2026-04-20
estado: draft
fase: post-v0.1
depende_de: ["[[09 - WSAA Client]]", "[[10 - SOAP Client Generico]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 20 — Padron (Register) Service

## Objetivo

Implementar los servicios de consulta de padron de ARCA (A4, A10, A13) que retornan informacion del contribuyente (persona fisica o juridica) asociado a un CUIT.

## Diferencia con WSFEv1

Padron **no usa el bloque `Auth`** al estilo WSFEv1. El token/sign viajan como parametros inline (`token`, `sign`, `cuitRepresentada`). Por eso **no pasa por [[11 - Auth Proxy Pattern]]**; la operacion pide el ticket directamente al [[09 - WSAA Client|WsaaClient]] y arma el payload manualmente.

## Servicios incluidos

| Servicio | WSAA service | Operacion | Uso |
|---|---|---|---|
| Padron A4 | `ws_sr_padron_a4` | `getPersona` | Datos basicos |
| Padron A10 | `ws_sr_padron_a10` | `getPersona` | + impuestos, actividades |
| Padron A13 | `ws_sr_padron_a13` | `getPersona` | Mas completo (v2) |

## Ubicacion

```
src/services/register/
  types/
    persona.ts        # PersonaReturn + sub-tipos (Domicilio, Actividad, Impuesto)
  operations/
    a4.ts             # getPersonaA4
    a10.ts            # getPersonaA10
    a13.ts            # getPersonaA13
  _helpers.ts         # throwPadronIfErrors
```

## API publica (desde la fachada Arca)

```typescript
arca.register.personaA4(cuit: number | string): Promise<PersonaReturn>;
arca.register.personaA10(cuit: number | string): Promise<PersonaReturn>;
arca.register.personaA13(cuit: number | string): Promise<PersonaReturn>;
```

## Tipos clave

`PersonaReturn` es un modelo unificado con campos opcionales — A4 llena un subconjunto, A10/A13 llenan mas. Sub-tipos:
- `Domicilio`
- `Actividad`
- `Impuesto`
- `CategoriaMonotributo` (A10+)

## Manejo de errores

Nueva clase `WsPadronError extends WsnError` con codigos `PADRON.${string}`.

## Criterios de aceptacion

- [ ] Las 3 operaciones son invocables desde `arca.register.*`
- [ ] Token/sign/cuitRepresentada inyectados correctamente (no via Auth Proxy)
- [ ] Errores ARCA mapeados a `WsPadronError`
- [ ] Integration tests gated verifican al menos A4 contra homologacion

## Tests minimos

- Unit con fixtures (1 happy path + 1 error por cada servicio)
- Integration gated: A4 contra el CUIT de prueba

## Notas de implementacion

Sin acceso a WSDLs reales al escribir el spec, algunos nombres de campos pueden requerir ajuste post-integration. El modelo `PersonaReturn` acepta esa volatilidad con campos opcionales.

## Links

- [[Padron - Consultas]]
- [[Endpoints y WSDLs]]
- [[Modelo de Errores]]
