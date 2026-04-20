---
tags: [stt, audio, whisper, transcripcion]
created: 2026-04-20
---

# Transcripcion de Audio (STT)

## Caracteristicas del audio de WhatsApp

- **Container**: OGG
- **Codec**: Opus (no MP3, no WAV)
- **Sample rate**: 16 kHz
- **Canales**: mono
- **Bitrate**: variable, tipicamente 16-32 kbps
- **Duracion tipica**: 5-60 segundos para dictado de factura

## Consideracion clave: formato

No todos los proveedores STT aceptan OGG/Opus directamente. Opciones:

1. Usar un STT que soporte OGG nativo (Whisper, Deepgram, Google)
2. Transcodificar a WAV/MP3 con `ffmpeg` antes de enviar

Transcodificar suma 100-300ms por audio y requiere `ffmpeg` en el runtime. Preferir soporte nativo.

## Requisitos funcionales

- **Idioma**: es-AR (prioritario), es-ES como fallback aceptable
- **Domain**: terminologia fiscal y comercial argentina — "factura", "CUIT", "IVA", "monotributo", jergas de montos ("luca", "palo", "gamba")
- **Numeros**: clave — montos, cantidades, CUITs. Sensible a confusion (14 vs 40, once vs onze)
- **Latencia**: <3 segundos para audio de 10s
- **Costo**: <USD 0.01 por audio tipico

## Proveedores evaluados

Ver notas detalladas:
- [[OpenAI Whisper]]
- [[Deepgram]]
- [[Google Speech-to-Text]]
- [[Comparativa STT]]

## Estrategia recomendada

**Fase 1 (MVP)**: OpenAI Whisper API
- Soporte OGG nativo
- Buen resultado out-of-the-box en es-AR
- USD 0.006 / minuto
- Latencia ~2-3s para audios cortos

**Fase 2 (optimizacion)**: A/B con Deepgram Nova-2
- Latencia menor (<1s)
- Similar calidad
- Permite streaming si mas adelante se quiere feedback en tiempo real

## Post-procesamiento

Tras la transcripcion, aplicar:

1. **Normalizacion de numeros hablados → digitos**
   - "siete mil quinientos" → "7500"
   - "veinte mil" → "20000"
   - "ciento veinte" → "120"
   - Problema: algunos STT ya lo hacen, otros no. Normalizar en nuestro lado con una pasada deterministica sobre el output.

2. **Normalizacion de CUIT**
   - "veinte, once millones, etc" → "20-11111111-2"
   - "dos cero guion..." → "20-..."
   - Validar digito verificador

3. **Correccion de terminos de dominio** (opcional, via LLM)
   - "factura ve" → "factura B"
   - "tres punto quince" en contexto de CUIT → posible prefijo

## Error handling

- Audio ilegible / silencio: responder "No te entendi, podes repetir?"
- Idioma no esperado: responder en idioma del audio con disculpa
- Duracion >60s: pedir resumen ("Contame la venta en menos palabras")
- Fallo de API: reintentar con backoff, 3 intentos max

## Privacidad

El audio contiene PII (nombre, a veces CUIT hablado, a veces direccion). Ver [[Seguridad y Cumplimiento]]:
- No persistir el audio original mas alla del procesamiento
- Transcripciones si se guardan, con politica de retencion clara
- Providers con DPA (Data Processing Agreement) firmado

## Links

- [[OpenAI Whisper]]
- [[Deepgram]]
- [[Google Speech-to-Text]]
- [[Comparativa STT]]
- [[Extraccion Estructurada (NLU)]]
- [[Seguridad y Cumplimiento]]
