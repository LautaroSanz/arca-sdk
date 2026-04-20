---
tags: [whatsapp, arquitectura, flujo, pipeline]
created: 2026-04-20
---

# Flujo End-to-End

Pipeline completo desde que el usuario envia un audio hasta que recibe el CAE.

## Diagrama

```
[Usuario WhatsApp]
       |
       | (1) audio.ogg
       v
[Webhook Meta/Twilio] ---- (2) verificacion firma HMAC
       |
       | (3) encolar mensaje (idempotencia por wamid)
       v
[Cola de eventos] ----+---- mensaje duplicado? -> skip
       |              |
       v              |
[Worker: STT]         |
       |              |
       | (4) descargar media + transcribir
       v              |
[Worker: NLU]         |
       |              |
       | (5) LLM function calling -> DraftInvoice
       v              |
[Worker: Enriquecimiento]
       |              |
       | (6) consultar Padron para datos receptor
       | (7) validar aritmetica IVA + redondeos
       v              |
[Storage: Draft]      |
       |              |
       | (8) enviar preview por WhatsApp
       v              |
[Usuario confirma] <--+
       |
       | (9) quick reply: Confirmar
       v
[Worker: Emision]
       |
       | (10) WSAA.getTicket(wsfe, cuit)
       | (11) WSFEv1.FECompUltimoAutorizado
       | (12) WSFEv1.FECAESolicitar
       v
[ARCA]
       |
       | (13) CAE + CAEFchVto
       v
[Storage: Invoice]
       |
       | (14) generar PDF
       | (15) responder WhatsApp con CAE + PDF
       v
[Usuario WhatsApp]
```

## Partes sincronas vs asincronas

| Paso | Modo | Latencia objetivo |
|---|---|---|
| Webhook recibe evento | sync | <200ms (responder 200 a Meta) |
| STT | async | 2-5s |
| NLU | async | 1-3s |
| Padron lookup | async | <1s (cacheable 24hs) |
| Preview al usuario | async | total <10s desde audio |
| Confirmacion | async | lo que tarde el humano |
| Emision CAE | async | 3-8s |

**Regla dura**: el webhook de WhatsApp devuelve 200 inmediatamente y procesa en background. Meta reintenta si no respondemos rapido.

## Maquinas y estados

Ver [[Idempotencia y Estado]] para la definicion completa del FSM.

Estados principales:
- `received` → `transcribed` → `extracted` → `awaiting_confirmation` → `confirmed` → `invoiced` → `delivered`
- Estados terminales de error: `rejected_by_user`, `failed_transcription`, `failed_extraction`, `failed_cae`

## Rutas alternativas

- **Texto en vez de audio**: saltea STT, va directo a NLU
- **Datos incompletos**: el bot pregunta (CUIT del receptor, tipo de comprobante) antes del preview
- **Correccion**: si el usuario elige "Editar", abre mini-dialogo para ajustar campos especificos
- **Timeout de confirmacion**: tras N horas sin respuesta, el draft se descarta

## Links

- [[Ingesta de WhatsApp]]
- [[Transcripcion de Audio (STT)]]
- [[Extraccion Estructurada (NLU)]]
- [[Validacion y Confirmacion]]
- [[Integracion con ARCA SDK]]
- [[Idempotencia y Estado]]
