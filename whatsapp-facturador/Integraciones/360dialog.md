---
tags: [whatsapp, 360dialog, bsp]
created: 2026-04-20
---

# 360dialog

BSP especializado en WhatsApp Business. Popular en Europa y con presencia en LATAM.

## Ventajas

- **Pricing transparente y bajo**: flat fee mensual por numero (desde EUR 39/mes) + costos de Meta. **No hay markup por mensaje.**
- Pionero en WhatsApp Business API (antes de que existiera la Cloud API)
- Focalizado 100% en WhatsApp (no una plataforma generalista)
- Soporte tecnico a nivel API/webhooks
- Docs en ingles y aleman; soporte en español disponible

## Desventajas

- Menos conocido que Twilio en LATAM
- Requiere suscripcion mensual fija (no pay-per-use puro)
- UI del panel menos pulida que Twilio

## Modelo de precios

| Plan | Precio | Incluye |
|---|---|---|
| Partner | EUR 39/mes por numero | Cloud API, webhook, panel basico |
| Scale | Custom | Multi-numero, SLAs, account manager |

**Importante**: sobre esto se suman los costos de Meta por conversacion (misma tabla que Cloud API directa).

Efecto: para alto volumen, 360dialog es **mas barato que Twilio** porque no hay markup por mensaje.

## API

Es un proxy al Cloud API de Meta — endpoints **casi identicos**. Cambia el hostname y se agrega un header `D360-API-KEY`:

```typescript
await fetch("https://waba-v2.360dialog.io/messages", {
  method: "POST",
  headers: {
    "D360-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messaging_product: "whatsapp",
    to: "5491144445555",
    type: "text",
    text: { body: "Tu factura esta lista" },
  }),
});
```

**Ventaja**: migrar entre 360dialog y Cloud API directo de Meta es casi trivial (cambian hostname y auth header).

## Webhooks

Payload **identico** al de Meta Cloud API (mismo shape JSON, mismo campo `messages`, etc).

## Recomendacion

Buena opcion para fase de crecimiento (entre MVP-Twilio y full-Meta):
- Si el volumen supera ~10K conversaciones/mes, sale **mucho** mas barato que Twilio
- La compatibilidad con Meta permite migrar facil

## Links

- Docs: `https://docs.360dialog.com`
- [[WhatsApp Cloud API (Meta)]]
- [[Twilio WhatsApp]]
- [[Comparativa Proveedores WhatsApp]]
