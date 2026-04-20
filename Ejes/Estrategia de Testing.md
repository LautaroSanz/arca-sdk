---
tags: [arca, ejes, testing]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Estrategia de Testing

## Tres niveles

### 1. Unit tests

- Ubicacion: `src/**/*.test.ts`
- Herramienta: Vitest
- Cobertura: logica pura, parsers, constructores de XML, cache.

No tocan red ni filesystem real (salvo `os.tmpdir`).

### 2. Integration tests contra homologacion

- Ubicacion: `tests/integration/*.test.ts`
- Gate: variable de entorno `ARCA_INTEGRATION=1`
- Requiere: cert + key de homologacion, CUIT, WSN habilitado.

Env vars reconocidas por los tests:

| Variable | Requerida | Proposito |
|---|---|---|
| `ARCA_INTEGRATION=1` | si | Habilita los tests de integracion (sin esto, skip) |
| `ARCA_TEST_CUIT` | si | CUIT de homologacion |
| `ARCA_TEST_CERT` o `ARCA_TEST_CERT_PATH` | si | PEM inline o ruta al archivo |
| `ARCA_TEST_KEY` o `ARCA_TEST_KEY_PATH` | si | PEM inline o ruta al archivo |
| `ARCA_EMIT_REAL=1` | para CAE | Gate extra para emitir comprobantes reales |
| `ARCA_TEST_PTOVTA` | opcional | Punto de venta para tests de emision (default 1) |

Cubren:

- Login contra WSAA real (`wsaa.test.ts`): ticket + cache
- `FEDummy` del WSFEv1
- Consultas de parametros (`FEParamGet*`)
- `FECompUltimoAutorizado` como read-only
- Solicitud de CAE (flag extra `ARCA_EMIT_REAL=1` por seguridad)

### 3. Contract tests (snapshot)

- Ubicacion: `tests/contract/`
- Guardan respuestas reales de ARCA (sanitizadas) para detectar drift si ARCA cambia algun campo.

## Regla de oro

> [!warning] No mockeamos lo critico
> No mockeamos ni la firma PKCS#7 ni el protocolo SOAP. Donde se pueda, el test usa la libreria real contra fixtures capturados. Los mocks se reservan para HTTP outbound y reloj.

## CI

- PRs: solo unit tests
- Push a `main`: unit + integration (secretos de homologacion en GitHub Actions)
- Release tag: full suite

## Datos sensibles en CI

- `ARCA_TEST_CERT`, `ARCA_TEST_KEY`, `ARCA_TEST_CUIT` como secrets
- Nunca commitear certs ni keys, ni siquiera de homologacion

## Links

- [[Roadmap]]
- [[09 - WSAA Client]]
- [[15 - WSFEv1 - FECAESolicitar]]
