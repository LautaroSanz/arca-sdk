---
tags: [whatsapp, comparativa, bsp]
created: 2026-04-20
---

# Comparativa Proveedores WhatsApp

| Dimension | Meta Cloud API | Twilio | 360dialog |
|---|---|---|---|
| **Tipo** | Directo | BSP (generalista) | BSP (especialista WA) |
| **Setup friction** | Alto (Business Verification obligatoria) | Bajo (sandbox inmediato) | Medio |
| **Pricing model** | Pay-per-conversation | Markup + pay-per-conv | Flat mensual + pay-per-conv sin markup |
| **Markup por mensaje** | 0 | ~USD 0.005 | 0 |
| **Soporte** | Limitado (self-serve) | 24/7 enterprise | Tecnico, email |
| **SDKs oficiales** | No (HTTP puro) | Si (Node, Python, PHP, etc) | No (HTTP, compatible con libs de Meta) |
| **Migrabilidad** | - | Dificil (formato propio) | Facil (payloads Meta-compat) |
| **Feature lag** | 0 | Semanas-meses | Dias-semanas |
| **Ideal para** | Escala / integracion profunda | MVP, dev rapido, multi-canal | Volumen medio-alto |

## Costo estimado por 1000 facturas emitidas

Asumiendo:
- 1 conversacion "service" para el audio + preview + confirmacion (dentro de 24h)
- 1 conversacion "utility" con el PDF final (si cae fuera de ventana, raro)

| Proveedor | Service (1K) | Utility (100, estimado 10% fuera de ventana) | Fee fijo / mes | **Total / mes** |
|---|---|---|---|---|
| Meta directo | $0 (free tier cubre) | $1.5 | $0 | **$1.5** |
| Twilio | $5 | $2 | $0 | **$7** |
| 360dialog | $0 | $1.5 | $42 (EUR 39) | **$43.5** |

Escala a 100K facturas/mes (25K conversaciones utility):
| Proveedor | Service (100K) | Utility (10K) | Fee fijo | **Total / mes** |
|---|---|---|---|---|
| Meta directo | $0-40 (segun tier) | $150 | $0 | **$150** |
| Twilio | $500 | $200 | $0 | **$700** |
| 360dialog | $0 | $150 | $42 | **$192** |

Conclusion: a volumen, **Meta directo** es mas barato; **Twilio** pesa mas.

## Recomendacion por fase

- **Fase 0 / Dev**: Twilio Sandbox
- **Fase 1 / Beta privada (5-20 tenants)**: Twilio con numero dedicado
- **Fase 2 / Lanzamiento (50-500 tenants)**: 360dialog
- **Fase 3 / Escala**: Meta Cloud API directo

La abstraccion en nuestro codigo debe permitir **cambiar de proveedor sin reescribir la app**: ver [[Stack Tecnologico]] — interfaz `IWhatsAppProvider`.

## Links

- [[WhatsApp Cloud API (Meta)]]
- [[Twilio WhatsApp]]
- [[360dialog]]
- [[Costos Estimados]]
- [[Plan de Fases]]
