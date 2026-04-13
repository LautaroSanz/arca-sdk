---
tags: [arca, padron, consulta, contribuyente]
created: 2026-04-13
---

# Padron - Consultas de Contribuyentes

Servicios para consultar datos de contribuyentes en el padron de ARCA.

## Servicios disponibles

### ws_sr_padron_a4

- **Alcance 4**: Datos de situacion tributaria
- Retorna: impuestos inscriptos, regimenes, actividades
- Testing: `https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA4`
- Produccion: `https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA4`

**Operaciones:**
- `getPersona(token, sign, cuitRepresentada, idPersona)` — Consultar contribuyente
- `dummy()` — Health check

### ws_sr_padron_a10

- **Alcance 10**: Datos minimos/resumen
- Testing: `https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA10`
- Produccion: `https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA10`

### ws_sr_padron_a13

- **Alcance 13**
- Testing: `https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA13`
- Produccion: `https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA13`

### ws_sr_constancia_inscripcion

- Constancia de inscripcion completa
- Reemplaza al deprecado ws_sr_padron_a5

## Links

- [[Catalogo de Servicios]]
- [[Endpoints y WSDLs]]
- [[WSAA - Flujo de Autenticacion]]
