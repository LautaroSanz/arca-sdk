---
tags: [stt, google, chirp]
created: 2026-04-20
---

# Google Speech-to-Text

Servicio de STT de Google Cloud.

## Modelos

- `chirp` / `chirp-2` — universal, multilingue (recomendado)
- `latest_long` — modelos legacy, audios largos
- `telephony` — calidad de llamada

## Ventajas

- Integracion natural con GCP (IAM, logs, Pub/Sub, etc)
- Multi-region incluyendo sa-east1 (São Paulo) — **menor latencia desde AR**
- Compliance enterprise (SOC2, ISO27001, HIPAA)
- Soporte de audios hasta 480 min (no solo cortos)

## Desventajas

- Precio mas alto que competencia para pay-as-you-go
- API menos "plug and play" que Whisper/Deepgram para devs pequeños
- Formato OGG/Opus soportado pero con configuracion explicita

## Endpoint

REST v2 (recomendado) o gRPC:

```
POST https://speech.googleapis.com/v2/projects/{PROJECT}/locations/southamerica-east1/recognizers/{RECOGNIZER}:recognize
Authorization: Bearer {token}
Content-Type: application/json

{
  "config": {
    "model": "chirp_2",
    "languageCodes": ["es-AR"],
    "autoDecodingConfig": {}
  },
  "content": "<base64 audio>"
}
```

## Precio

| Modelo | Precio |
|---|---|
| Standard | USD 0.024 / minuto |
| Dynamic batch (cola, mas barato) | USD 0.003 / minuto |
| Chirp | USD 0.018 / minuto |

Con commitment de uso, baja a ~USD 0.012-0.016/min.

**Mas caro que Whisper y Deepgram en modo on-demand.**

## Cuando elegirlo

- Ya estas en GCP y queres facturacion unificada
- Necesitas region SA (latencia / data residency)
- Compliance enterprise obligatorio
- Volumen alto con commitment

Para este proyecto probablemente **no** es primera opcion — Whisper y Deepgram cubren el caso de uso a menor costo.

## Links

- Docs: `https://cloud.google.com/speech-to-text/v2/docs`
- [[OpenAI Whisper]]
- [[Deepgram]]
- [[Comparativa STT]]
