---
tags: [stt, comparativa]
created: 2026-04-20
---

# Comparativa STT

| Dimension | OpenAI Whisper | Deepgram Nova-3 | Google Chirp |
|---|---|---|---|
| **Precio on-demand** | USD 0.006/min | USD 0.0043/min | USD 0.018/min |
| **Latencia audio 10s** | ~2-3s | <1s | ~1-2s |
| **Streaming** | Si (gpt-4o-transcribe) | Si (nativo) | Si |
| **OGG/Opus** | Nativo | Nativo | Nativo con config |
| **Calidad es-AR** | Muy buena | Muy buena | Buena |
| **Numeros → digitos** | Manual post-proc | Automatico (smart_format) | Parcial |
| **Vocabulario custom** | `prompt` | Keyword boosting | Phrase hints |
| **DPA / compliance** | Disponible (enterprise) | Disponible | SOC2/ISO27001 default |
| **Region LATAM** | No (US) | No (US) | São Paulo disponible |
| **Dev experience** | Excelente | Excelente | Buena |
| **Docs** | Excelentes | Excelentes | Completas pero densas |

## Decision MVP: **OpenAI Whisper**

Razones:
1. Docs y DX excelentes → mas rapido llegar a MVP
2. Precio aceptable a volumen esperado (100-10K facturas/mes)
3. Calidad probada para es-AR
4. Si el equipo usa otros productos de OpenAI (LLM para NLU), una sola integracion

## Plan de A/B post-MVP

Pipeline que permita plug & play de proveedor STT. Interfaz:

```typescript
interface ISpeechToText {
  transcribe(audio: Buffer, opts: STTOptions): Promise<Transcription>;
}

interface Transcription {
  text: string;
  language: string;
  duration: number;
  confidence: number;
  provider: string;   // para observabilidad
  rawResponse: unknown;
}
```

Adapters: `WhisperSTT`, `DeepgramSTT`, `GoogleSTT`.

Fase 2: A/B sobre muestra de tenants. Metrica a comparar:
- Tasa de correccion del usuario tras preview (señal de error de transcripcion)
- Latencia p50/p95
- Costo por factura
- Confidence auto-reportado

## Links

- [[OpenAI Whisper]]
- [[Deepgram]]
- [[Google Speech-to-Text]]
- [[Transcripcion de Audio (STT)]]
- [[Costos Estimados]]
