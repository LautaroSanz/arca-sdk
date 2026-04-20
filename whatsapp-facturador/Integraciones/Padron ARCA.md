---
tags: [padron, arca, enriquecimiento]
created: 2026-04-20
---

# Padron ARCA

ARCA expone servicios de consulta de padron para obtener datos de un contribuyente a partir de su CUIT. Uso principal en este bot: **completar datos del receptor** cuando el usuario solo dicto el CUIT.

## Servicios disponibles

| Servicio | Alcance | Usa [[ARCA SDK - Index|arca-sdk]] como |
|---|---|---|
| `ws_sr_padron_a4` | Nivel 4: datos basicos (razon social, domicilio fiscal, condicion IVA) | `services/register/a4` |
| `ws_sr_padron_a5` | Nivel 5: + actividades economicas, regimenes | `services/register/a5` |
| `ws_sr_padron_a10` | Nivel 10: + datos de monotributo, ganancias, etc | `services/register/a10` |
| `ws_sr_padron_a13` | Nivel 13: **el mas completo**, todo lo anterior + mas datos | `services/register/a13` |

Autenticacion: WSAA estandar, `service: ws_sr_padron_a13` (o el nivel que corresponda).

Ver [[Padron - Consultas]] en la research de arca-sdk para detalles tecnicos.

## Operacion clave

```
getPersona_v2(token, sign, cuitRepresentada, idPersona)
```

Devuelve XML con estructura:

```xml
<persona>
  <idPersona>20111111112</idPersona>
  <tipoPersona>FISICA</tipoPersona>
  <nombre>Juan Perez</nombre>
  <domicilioFiscal>
    <direccion>Av. Corrientes 1234</direccion>
    <localidad>CABA</localidad>
    <codPostal>1041</codPostal>
    <idProvincia>0</idProvincia>
  </domicilioFiscal>
  <categoria>...</categoria>
  <actividades>...</actividades>
</persona>
```

## Uso en el bot

Cuando NLU detecta un CUIT:

```
1. LLM extrae receptor.nroDoc = "20111111112"
2. App consulta Padron A13
3. Completa receptor.nombre, receptor.condicionIva, (opcional) domicilio
4. Si Padron no devuelve nada (CUIT inexistente o inactivo), pedir al usuario
```

## Determinar condicion IVA del receptor

Obligatorio desde 2024 en el campo `CondicionIVAReceptorId` de `FECAESolicitar`. Mapping desde Padron:

| Padron `categoria` | `CondicionIVAReceptorId` (RG 5616) |
|---|---|
| Responsable Inscripto | 1 |
| Monotributo | 6 |
| Exento | 4 |
| No Responsable | 5 |
| Consumidor Final | 7 (default si no aplica otra) |
| IVA No Alcanzado | 15 |

Si CUIT no existe en padron y no hay mas data → default Consumidor Final.

## Cache

Los datos de padron cambian poco (razon social, domicilio). Cachear 24hs en Redis:

```
key: padron:a13:{cuit}
value: { nombre, condicionIva, domicilio, ... }
ttl: 86400s
```

Invalidacion manual via endpoint admin si hace falta (raro).

## Rate limits

ARCA no publica limites duros pero hay quejas de throttling a alto volumen. Medidas:
- Cache agresivo
- Cola de requests con concurrency limit (5 paralelos)
- Retry con backoff en caso de 500s

## Privacidad

Consulta de padron debe estar justificada por uso fiscal. Loguear cada consulta:
- `tenant_id`
- `cuit_consultado`
- `motivo` (siempre: "facturacion")
- `timestamp`

Retencion: 5 años (alineado con requerimientos fiscales).

## Alternativas

- **Scraping del CUIT online de ARCA** (sitio web publico): NO usar, violacion de ToS y fragil
- **Base interna**: cada tenant puede mantener su CRM con clientes recurrentes; preferir esto si el receptor ya aparecio antes

## Links

- [[Padron - Consultas]]
- [[Extraccion Estructurada (NLU)]]
- [[Integracion con ARCA SDK]]
- [[Modelo de Datos]]
