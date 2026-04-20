---
tags: [stt, whisper, openai]
created: 2026-04-20
---

# OpenAI Whisper

Modelo de speech-to-text de OpenAI. Dos formas de usarlo:

1. **API hosted** (`whisper-1` / `gpt-4o-transcribe`) — recomendado para prod
2. **Self-hosted** (modelo open weights) — opcional si hay razones de privacidad/costo

## API hosted

### Endpoint

```
POST https://api.openai.com/v1/audio/transcriptions
Authorization: Bearer sk-...
Content-Type: multipart/form-data

file: audio.ogg
model: whisper-1
language: es
prompt: "Factura, CUIT, IVA, monotributo, pesos"
response_format: verbose_json
```

### Modelos disponibles

| Modelo | Descripcion | Precio |
|---|---|---|
| `whisper-1` | Whisper large-v2 hosted | USD 0.006 / minuto |
| `gpt-4o-transcribe` | Siguiente gen, mejor calidad | USD 0.006 / min (input) |
| `gpt-4o-mini-transcribe` | Version rapida | USD 0.003 / min |

### Formatos soportados

mp3, mp4, mpeg, mpga, m4a, wav, webm, **ogg** (valido, container con codec opus es aceptado).

Tamaño max: 25MB. Para audios mas largos, chunking.

### Parametros utiles

- `language: "es"` — forzar español para evitar deteccion equivocada
- `prompt: "..."` — hint de vocabulario (util para "CUIT", nombres de productos recurrentes, jergas)
- `response_format: "verbose_json"` — devuelve segmentos con timestamps y probabilidades
- `temperature: 0` — deterministico

### Ejemplo de respuesta

```json
{
  "task": "transcribe",
  "language": "spanish",
  "duration": 8.4,
  "text": "Factura B a Juan Perez CUIT 20-11111111-2 por dos kilos de asado a siete mil el kilo",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 4.2,
      "text": "Factura B a Juan Perez CUIT 20-11111111-2",
      "avg_logprob": -0.23,
      "no_speech_prob": 0.001
    }
  ]
}
```

`avg_logprob` y `no_speech_prob` sirven para detectar baja confianza y pedir repeticion.

## Calidad en es-AR

- Muy buena para español general
- Acento argentino: bien (large-v2 entrena con dataset diverso)
- Terminos fiscales: bien con prompt hint
- Numeros: mayormente como palabras — necesita normalizacion post (ver [[Transcripcion de Audio (STT)]])

## Latencia

- Audio de 10s: ~2-3 segundos de respuesta
- Audio de 60s: ~4-6 segundos
- Sin streaming en la API clasica; `gpt-4o-transcribe` soporta SSE

## Costos en el proyecto

Audio promedio estimado: 15 segundos = 0.25 min
Costo por transcripcion: `0.25 * 0.006` = USD 0.0015

A 1000 facturas/mes: USD 1.50/mes. A 100K: USD 150/mes.

## Consideraciones de privacidad

- OpenAI NO entrena con datos de API (politica desde 2023)
- DPA firmable con OpenAI (requiere pedir en sales)
- Datos transitan EE.UU. — relevante para ley 25.326
- Opcion "Zero Data Retention" (ZDR) disponible para clientes enterprise

## Self-hosted (alternativa)

Si razones de privacidad / costo lo justifican:

- `whisper.cpp` — inferencia en CPU, viable en Mac M-series para dev
- `faster-whisper` (CTranslate2) — GPU, ~4x mas rapido
- Modelo `large-v3` (open weights, ~1.5GB)
- Runtime: podes desplegar en Replicate, Modal, RunPod, Beam, AWS/GCP con GPU

Costo estimado self-hosted con GPU dedicada: rentable solo a >500K audios/mes.

## Links

- [[Transcripcion de Audio (STT)]]
- [[Comparativa STT]]
- [[Deepgram]]
- [[Google Speech-to-Text]]
- [[Seguridad y Cumplimiento]]
