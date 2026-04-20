---
tags: [arca, ejes, proceso, git]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Estrategia de Commits

Convencion para dividir el trabajo en commits. El objetivo principal es **facilitar el debugging futuro** cuando el proyecto crezca.

## Regla base

> [!note] Un commit = una unidad coherente de funcionalidad
> Agrupamos cambios en commits que cierran una fase del [[Roadmap]], una feature, o un bugfix puntual. Nunca mezclamos fases distintas, y casi nunca partimos una fase en commits mas chicos.

Ejemplos de "unidad coherente":

- **Fase completa del roadmap**: Fase 0 (bootstrap + config + errores + logging) como un solo commit.
- **Feature atomica**: "Implement FECAESolicitar" (codigo + tests + fixture) como un solo commit.
- **Bugfix**: "Fix expiration check in AccessTicket" (fix + test de regresion).

## Por que esta regla — razones de debugging

### 1. `git bisect` utilizable

Cuando aparezca un bug tipo "hace tres semanas andaba", `git bisect` recorre commits para encontrar el culpable. Solo funciona bien si **cada commit deja el proyecto en un estado buildeable y con tests verdes**.

Si partimos la Fase 0 en 10 commits chicos, varios de esos quedan incompletos (ej. "agregue el error model sin sus tests"). `bisect` se queda atascado en commits que no compilan y pierde su utilidad justo cuando mas la necesitamos.

### 2. Reverts selectivos

Si descubrimos que "la Fase 2 introdujo una regresion", `git revert <commit-fase-2>` deja el repo en un estado limpio y funcional (el de Fase 1). Con commits fragmentados, revertir implica resolver merge conflicts manuales o revertir 8 commits en cadena.

### 3. Historial legible en `git log`

Cuando alguien (o nosotros dentro de 6 meses) hace `git log --oneline`, quiere ver el arco del proyecto, no cada archivo creado:

```
Bien:
  21a1bd6 Add project axes and small implementation specs
  XXXXXXX Implement Phase 0: foundations (config, errors, logging)
  YYYYYYY Implement Phase 1: WSAA authentication

Mal:
  aaaaa Add tsconfig
  bbbbb Add package.json
  ccccc Add eslint config
  ddddd Fix eslint config
  ...50 commits mas...
```

### 4. `git blame` apunta a contexto real

`git blame` sobre una linea lleva al commit donde se introdujo. Si ese commit es "Implement error model", el mensaje + el diff completo explican el **por que**. Si es "Add CryptoError class" sin el resto del modelo, falta contexto para entender la decision.

## Cuando si partir en commits mas chicos

Excepciones validas:

- **Refactors pre-feature**: "Extract SoapClient interface" antes de "Implement WSFEXv1" ayuda a separar ruido mecanico de la feature real.
- **Migraciones de tooling**: "Bump TypeScript 6 → 7" merece su propio commit.
- **Bugfix durante una fase**: si a mitad de Fase 2 encuentro un bug de Fase 1, va en commit aparte.
- **Documentacion que se publica sola**: un ADR o un README grande puede ir solo si no bloquea codigo.

## Convencion de mensaje

```
<verbo en imperativo presente> <que>

<parrafo corto: por que, tradeoffs, decisiones no obvias>
```

- Titulo en ingles, imperativo presente (`Add`, `Fix`, `Refactor`, `Implement`).
- Cuerpo en espanol si tiene contexto rico (consistente con la documentacion del proyecto).
- Maximo 72 caracteres en el titulo.

## Tags y versiones

Cuando completamos una fase del [[Roadmap]], creamos un tag:

- `v0.0.1-fase-0` al cerrar Fase 0
- `v0.0.2-fase-1` al cerrar Fase 1
- `v0.1.0` en el primer release publico post-Fase 4

Los tags son los anclajes para debugging: "andaba en `v0.0.2-fase-1`, falla en `v0.0.3-fase-2`" recorta el espacio de busqueda drasticamente.

## Links

- [[Roadmap]]
- [[Estrategia de Testing]]
- [[Versionado y API Publica]]
