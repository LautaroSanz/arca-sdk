---
tags: [whatsapp, meta, cloud-api]
created: 2026-04-20
---

# WhatsApp Cloud API (Meta)

Integracion directa con los servidores de Meta, sin BSP intermediario.

## Ventajas

- Sin fees de intermediario (solo pagas a Meta)
- Free tier generoso: 1000 conversaciones service/mes gratis + conversaciones "utility" dentro de ventana 24h gratis (2025-2026)
- Latencia menor (un hop menos)
- Feature parity inmediato con novedades de Meta

## Desventajas

- Onboarding mas engorroso: verificacion de negocio en Meta Business Manager, display name review, etc.
- Soporte de Meta: limitado para cuentas no enterprise
- En caso de suspension, apelar es lento

## Setup

1. Crear cuenta en Meta Business Manager
2. Crear **WhatsApp Business Account (WABA)**
3. Asociar un **phone number** (puede ser nuevo o portado)
4. Crear **System User** con permisos `whatsapp_business_messaging` y `whatsapp_business_management`
5. Generar `access_token` (preferir long-lived: 60 dias, renovable)
6. Configurar webhook con `verify_token` y URL publica
7. Verificar el negocio (Business Verification) para subir limits

## Endpoints clave

| Operacion | Endpoint |
|---|---|
| Enviar mensaje | `POST /v20.0/{PHONE_NUMBER_ID}/messages` |
| Resolver media | `GET /v20.0/{MEDIA_ID}` |
| Descargar media | `GET {temp_url}` con `Authorization: Bearer {TOKEN}` |
| Templates | `GET /v20.0/{WABA_ID}/message_templates` |
| Marcar como leido | `POST /v20.0/{PHONE_NUMBER_ID}/messages` con `status: read` |

## Webhooks

- Configurar en `Meta Business Manager > Webhooks`
- Suscribirse a `messages` field
- URL tiene que ser HTTPS con cert valido
- Verificacion inicial: responder `hub.challenge`
- Signature validation: `X-Hub-Signature-256 = HMAC-SHA256(body, APP_SECRET)`

## Costos (Argentina, 2026)

| Categoria | Precio por conversacion |
|---|---|
| Service (iniciada por user en ventana 24h) | USD 0.00 (free dentro de cap mensual) |
| Utility (notificaciones, confirmaciones, updates) | USD ~0.015 |
| Authentication (OTPs) | USD ~0.015 |
| Marketing | USD ~0.06 |

Conversacion = ventana de 24hs. Mensajes multiples en la misma ventana no se cobran extra.

## Limits

- Messaging tier al arrancar: **tier 1** (1000 unique customers / 24h)
- Upgrade automatico a tier 10K, 100K, ilimitado al subir calidad + volumen
- Rate: 80 mensajes/segundo al mismo numero

## Codigo de referencia

```typescript
// Envio de mensaje con botones
const response = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messaging_product: "whatsapp",
    to: "5491144445555",
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: "Revisa tu factura..." },
      action: {
        buttons: [
          { type: "reply", reply: { id: `confirm:${draftId}`, title: "Confirmar" } },
          { type: "reply", reply: { id: `edit:${draftId}`, title: "Editar" } },
          { type: "reply", reply: { id: `cancel:${draftId}`, title: "Cancelar" } },
        ],
      },
    },
  }),
});
```

## Links

- Docs oficiales: `https://developers.facebook.com/docs/whatsapp/cloud-api`
- [[Ingesta de WhatsApp]]
- [[Comparativa Proveedores WhatsApp]]
- [[Twilio WhatsApp]]
