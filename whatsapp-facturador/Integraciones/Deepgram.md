---
tags: [stt, deepgram]
created: 2026-04-20
---

# Deepgram

Proveedor de speech-to-text focalizado en baja latencia y streaming.

## Caracteristicas

- Modelos: `nova-2`, `nova-3` (ultima gen, 2025)
- Latencia: <500ms para audios cortos; streaming real-time
- Idiomas: 40+ incluido es-AR
- Features: diarization, keyword boosting, smart formatting (numeros a digitos, fechas, monedas)

## Endpoint

```
POST https://api.deepgram.com/v1/listen?model=nova-3&language=es&smart_format=true
Authorization: Token ...
Content-Type: audio/ogg
```

O multipart, o URL remoto (deepgram descarga el audio).

## Smart formatting

Feature clave para este proyecto: convierte numeros hablados a digitos automaticamente:

- "siete mil quinientos" → "7500"
- "veinte once ciento once mil ciento once, dos" → "20-11111111-2" (con config)
- Fechas, monedas ("cinco pesos" → "$5")

Reduce significativamente el post-processing en NLU.

## Keyword boosting

Permite aumentar probabilidad de reconocimiento de terminos:

```json
{
  "keywords": [
    "CUIT:2", "IVA:2", "monotributo:1.5",
    "responsable inscripto:1.5", "factura B:2"
  ]
}
```

## Precio

| Modelo | Precio |
|---|---|
| Nova-3 pre-recorded | USD 0.0043 / minuto (pay-as-you-go) |
| Nova-3 streaming | USD 0.0077 / minuto |
| Enterprise tier | Negociable, <$0.003/min |

Comparable a Whisper pero algo mas barato a volumen.

## Ejemplo de respuesta

```json
{
  "metadata": { "duration": 8.4, "model": "nova-3" },
  "results": {
    "channels": [{
      "alternatives": [{
        "transcript": "Factura B a Juan Perez CUIT 20-11111111-2 por 2 kilos de asado a $7000 el kilo",
        "confidence": 0.95,
        "words": [
          { "word": "factura", "start": 0.1, "end": 0.5, "confidence": 0.98 },
          ...
        ]
      }]
    }]
  }
}
```

## Latencia (pre-recorded)

- 10s audio → respuesta en <800ms
- Mas rapido que Whisper para uso interactivo

## Streaming

Permite feedback progresivo al usuario ("estoy transcribiendo..." con resultado parcial). Util para fase 2, overkill para MVP.

## Trade-offs vs Whisper

| | Deepgram Nova-3 | OpenAI Whisper |
|---|---|---|
| Latencia | Menor (<1s) | Mayor (~2-3s) |
| Calidad es-AR | Muy buena | Muy buena |
| Numeros a digitos | Automatico (smart_format) | Manual (post-processing) |
| Precio | USD 0.004/min | USD 0.006/min |
| Vocabulario custom | Keyword boosting fino | Via `prompt` (mas limitado) |
| DPA / compliance | Disponible | Disponible |
| Streaming | Si | Solo gpt-4o-transcribe |

## Recomendacion

- **MVP**: Whisper (mas simple, docs mejores para arrancar)
- **Post-MVP**: A/B test con Deepgram. Si calidad similar y latencia mejor, migrar.

## Links

- Docs: `https://developers.deepgram.com`
- [[Transcripcion de Audio (STT)]]
- [[OpenAI Whisper]]
- [[Comparativa STT]]
