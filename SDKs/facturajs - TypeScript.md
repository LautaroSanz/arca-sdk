---
tags: [arca, sdk, typescript, facturajs]
created: 2026-04-13
---

# facturajs - TypeScript (Referencia Simple)

**Repo**: https://github.com/emilioastarita/facturajs
**Stars**: 115 | **Forks**: 25 | **Licencia**: MIT

## Descripcion

Implementacion simple y self-contained para comunicacion directa con ARCA via SOAP. Buen punto de partida para entender el protocolo.

## Estructura

```
src/
  AfipServices.ts     # Fachada de alto nivel
  AfipSoap.ts         # Cliente SOAP, autenticacion, cache de tokens
  SoapMethods.ts      # Definiciones de metodos/tipos
  IConfigService.ts   # Interface de configuracion
  util.ts             # Firma, parseo XML
```

## Configuracion

```typescript
interface IConfigService {
  homo: boolean;
  cacheTokensPath: string;
  tokensExpireInHours: number;
  privateKeyPath?: string;
  privateKeyContents?: string;     // PEM directo
  certPath?: string;
  certContents?: string;           // PEM directo
}
```

Soporta tanto rutas a archivos como contenido PEM directo.

## Detalle notable: sincronizacion NTP

Usa `ntp-time-sync` para obtener hora precisa de `time.afip.gov.ar` antes de construir el TRA. Esto resuelve un problema comun donde el drift del reloj local causa rechazo del TRA.

## Flujo generico

```typescript
execMethod(service, method, params):
  1. Obtener/cachear tokens via WSAA
  2. Inyectar Auth: { Token, Sign } en params
  3. Llamar client[method + 'Async'](params)
  4. Verificar response.Errors.Err
  5. Retornar resultado
```

## Links

- [[Comparativa de SDKs]]
- [[WSAA - Flujo de Autenticacion]]
- [[Arquitectura para App Propia]]
