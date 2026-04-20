---
tags: [whatsapp, webhook, meta, ingesta]
created: 2026-04-20
---

# Ingesta de WhatsApp

## Proveedores

WhatsApp Business no se integra directamente via app: requiere un BSP (Business Solution Provider) o la Cloud API oficial de Meta.

Ver [[Comparativa Proveedores WhatsApp]] para la eleccion.

## Tipos de mensaje relevantes

| Tipo | Uso en este proyecto |
|---|---|
| `audio` / `voice` | Entrada principal — dictado de factura |
| `text` | Entrada alternativa — cuando el usuario prefiere escribir |
| `interactive` (buttons) | Confirmacion/cancelacion de draft |
| `document` | Salida — PDF de la factura emitida |
| `image` | Posible entrada futura (foto de ticket/remito) |

## Webhook

### Verificacion inicial (GET)

Meta valida el endpoint con un `hub.verify_token`. El servidor responde con `hub.challenge`.

### Recepcion de eventos (POST)

Payload tipico de audio:

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WABA_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "5491122223333",
          "phone_number_id": "PHONE_ID"
        },
        "contacts": [{ "profile": { "name": "Juan" }, "wa_id": "5491144445555" }],
        "messages": [{
          "from": "5491144445555",
          "id": "wamid.HBgLNTQ5...",
          "timestamp": "1745123456",
          "type": "audio",
          "audio": {
            "mime_type": "audio/ogg; codecs=opus",
            "sha256": "abc...",
            "id": "MEDIA_ID",
            "voice": true
          }
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### Verificacion de firma

Meta firma cada POST con `X-Hub-Signature-256`. **Obligatorio validar** antes de procesar:

```
HMAC-SHA256(body, APP_SECRET) == header
```

## Descarga de media

El payload trae solo el `id` del archivo. Dos pasos:

1. `GET /v20.0/{MEDIA_ID}` → devuelve `{ url: "https://..." }` (URL temporal, ~5min)
2. `GET url` con `Authorization: Bearer {ACCESS_TOKEN}` → bytes del audio

Formato: **OGG container con codec Opus**, mono, 16kHz, variable bitrate. Tamaño tipico 10-50KB para 10 segundos.

## Limites y cuotas

| Limite | Cloud API | Twilio |
|---|---|---|
| Payload max | 100MB por media | 16MB por media |
| Audio duracion | 16 minutos | 16 minutos |
| Messaging rate | Tier-based (1K/10K/100K/ilimitado por 24h) | Por cuenta |
| Conversaciones pagas | Service/Marketing/Auth/Utility | Varia |

Para el uso real (audios de 5-30s), los limites son holgados.

## Idempotencia

Cada mensaje tiene un `id` unico (`wamid.HBgL...`). **Usar como clave de deduplicacion**: Meta reintenta webhooks si no responde 200.

Ver [[Idempotencia y Estado]].

## Ventana de 24 horas

Regla critica de WhatsApp: fuera de una ventana de 24h desde el ultimo mensaje del usuario, solo se pueden enviar **template messages pre-aprobados**. Para este bot significa:

- Mientras el usuario conversa activamente → respuestas libres
- Si el CAE llega tras 24h (edge case raro pero posible con caidas de ARCA) → enviar template aprobado tipo `factura_lista`

## Links

- [[WhatsApp Cloud API (Meta)]]
- [[Twilio WhatsApp]]
- [[Comparativa Proveedores WhatsApp]]
- [[Idempotencia y Estado]]
- [[Seguridad y Cumplimiento]]
