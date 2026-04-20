---
tags: [whatsapp, twilio, bsp]
created: 2026-04-20
---

# Twilio WhatsApp

Twilio es un BSP (Business Solution Provider) de WhatsApp. Agrega una capa entre tu app y la Cloud API de Meta.

## Ventajas

- Sandbox instantaneo (sin verification de negocio) para dev/testing
- Onboarding guiado, menos friccion que Meta directo
- SDKs oficiales en muchos lenguajes (`twilio` en Node/Python/PHP)
- Soporte 24/7 enterprise
- Unifica SMS, voz, WhatsApp, email (util si se extiende)
- Dashboard con logs y debugging

## Desventajas

- **Costo adicional** por encima de Meta (~USD 0.005-0.01 por mensaje, varia)
- Feature lag: novedades de Meta tardan en aparecer en Twilio API
- Abstraccion propia (formato de payload distinto a Cloud API)
- Migracion a otro BSP/directo es costosa

## Sandbox

Para desarrollo:
1. Crear cuenta Twilio
2. Activar WhatsApp Sandbox en consola
3. Numero compartido: `+14155238886`
4. Usuarios se "unen" enviando `join <codigo>` al numero
5. Sin verificacion, sin costo (solo pagas outbound a ~$0.005)

## Produccion

1. Solicitar numero dedicado (requiere Business Verification con Meta, Twilio guia el proceso)
2. Configurar templates y esperar aprobacion
3. Deploy

## API

Twilio usa **TwiML** o REST:

```typescript
import twilio from "twilio";

const client = twilio(accountSid, authToken);

await client.messages.create({
  from: "whatsapp:+14155238886",
  to: "whatsapp:+5491144445555",
  body: "Tu factura esta lista, CAE: 74123456789012",
  mediaUrl: ["https://cdn.tuapp.com/pdf/factura-123.pdf"],
});
```

Webhooks: Twilio POSTea en `application/x-www-form-urlencoded` (no JSON). Campos clave:

| Campo | Descripcion |
|---|---|
| `MessageSid` | ID unico (equivalente a wamid) |
| `From` | `whatsapp:+5491144445555` |
| `To` | `whatsapp:+14155238886` |
| `NumMedia` | Cantidad de media adjunta |
| `MediaUrl0`, `MediaContentType0` | URL de media (descargable con Auth de Twilio) |
| `Body` | Texto del mensaje |
| `ButtonText` / `ButtonPayload` | Si es respuesta a template interactive |

## Verificacion de firma

Twilio firma con `X-Twilio-Signature` usando HMAC-SHA1(url + params, authToken). SDK lo valida:

```typescript
import { validateRequest } from "twilio";
const valid = validateRequest(authToken, signature, url, params);
```

## Costos (Argentina, 2026)

Twilio factura **su markup** + **lo que Meta le cobra**:

| Categoria | Twilio fee | Meta fee | Total aprox |
|---|---|---|---|
| Service (dentro de 24h, iniciada por user) | USD 0.005 | USD 0.00 | USD 0.005 |
| Utility | USD 0.005 | USD 0.015 | USD 0.020 |
| Marketing | USD 0.005 | USD 0.06 | USD 0.065 |

## Recomendacion

- **MVP / beta privada**: Twilio Sandbox — setup en 10 minutos
- **Produccion de pocos tenants**: Twilio con numero dedicado — vale el markup por el soporte y velocidad de iteracion
- **Escala (>1000 tenants)**: migrar a Cloud API directo de Meta

## Links

- Docs: `https://www.twilio.com/docs/whatsapp`
- [[WhatsApp Cloud API (Meta)]]
- [[Comparativa Proveedores WhatsApp]]
