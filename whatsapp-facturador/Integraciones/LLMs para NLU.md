---
tags: [nlu, llm, claude, gpt, gemini, function-calling]
created: 2026-04-20
---

# LLMs para NLU

Eleccion del modelo para extraccion estructurada de datos de factura desde texto.

## Requerimientos

- **Function calling / tool use**: output estructurado obligatorio
- **Español neutro / es-AR**: comprension de jerga monetaria argentina ("luca", "palo", "gamba")
- **Seguir instrucciones**: respetar schema y NO hacer aritmetica
- **Latencia**: <2s para prompt + respuesta
- **Costo**: <USD 0.001 por factura

## Candidatos

### Claude (Anthropic)

- Modelo recomendado: `claude-haiku-4-5` para NLU (costo-eficiente) o `claude-sonnet-4-6` para casos dificiles
- Tool use nativo
- Excelente en seguir schemas y decir "no se" cuando faltan datos (menos alucinacion)
- Context caching baja costo 90% en prompts repetidos (util: system prompt grande con tablas de parametros ARCA)
- Precio Haiku 4.5: ~USD 1/MTok input, USD 5/MTok output

### GPT (OpenAI)

- Modelo recomendado: `gpt-4.1-mini` o `gpt-4.1`
- Function calling maduro, JSON mode estricto
- Si ya hay integracion con Whisper, misma API key / vendor
- Precio gpt-4.1-mini: USD 0.15/MTok input, USD 0.60/MTok output (barato)

### Gemini (Google)

- `gemini-2.5-flash` — muy barato, soporta function calling
- Integracion con GCP si ya esta en la pila
- Precio: USD 0.075/MTok input, USD 0.30/MTok output

## Benchmark informal (plan)

Armar un set de 100 audios etiquetados con el draft correcto. Medir:

| Metrica | Como |
|---|---|
| Exact match del draft | Comparacion estructural |
| Tasa de campos con error | Por campo |
| Alucinaciones (datos no presentes en el audio) | Inspeccion manual |
| Latencia p50/p95 | Timer |
| Costo por llamada | Tokens * precio |

## Decision MVP: **Claude Haiku 4.5**

Razones:
1. Mejor historico siguiendo instrucciones estrictas y reconociendo incertidumbre ("no se el CUIT")
2. Prompt caching permite system prompt grande con tablas de IVA/tipos cbte/condiciones sin cobrar por cada call
3. Balance costo/calidad adecuado al MVP
4. Tool use con schema validation estricta

## Estructura del prompt

System prompt (cacheable):
- Descripcion de la tarea
- Schema completo del `DraftInvoice` (ver [[Extraccion Estructurada (NLU)]])
- Tablas de parametros ARCA (tipos cbte, alicuotas IVA, condiciones IVA, tipos doc)
- **Reglas duras**: "NO calculas totales", "NO inventas datos", "si falta un campo, lista en missingFields"
- Ejemplos few-shot (3-5 casos variados)

User message:
- Contexto del tenant (condicion IVA, punto venta default, alicuota default)
- Texto transcripto
- Draft previo (si es correccion)

Tool: `extract_invoice` con input_schema detallado.

## Fallback

Si el LLM devuelve algo que no pasa validacion deterministica:
1. Reintentar una vez con prompt extendido que indique el error
2. Si falla de nuevo, entrar en modo conversacional: preguntar campos uno a uno

## Observabilidad

Loguear por request:
- `model`, `version`
- `tokens_input`, `tokens_output`, `cache_hit`
- `latency_ms`
- `tool_called`
- `validation_passed: bool`
- `user_edited_after: bool` (post-facto)

## Links

- [[Extraccion Estructurada (NLU)]]
- [[Stack Tecnologico]]
- [[Costos Estimados]]
