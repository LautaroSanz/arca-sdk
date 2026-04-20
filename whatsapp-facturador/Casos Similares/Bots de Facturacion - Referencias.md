---
tags: [competencia, benchmarks, referencias]
created: 2026-04-20
---

# Bots de Facturacion - Referencias

Productos y proyectos que abordan parte del problema.

## AR - Facturacion

### TusFacturas.app

- Web + API + app movil; no WhatsApp-first
- Emite contra AFIP todos los tipos de comprobante
- Pricing desde ARS ~10K/mes
- **Fortaleza**: feature-complete, muchos años
- **Debilidad**: UX de formulario tradicional

### Contabilium

- Suite contable completa, no solo facturacion
- Web principalmente
- Integraciones con bancos, e-commerce
- **Fortaleza**: todo-en-uno
- **Debilidad**: overkill para monotributista

### Colppy

- Similar a Contabilium; orientado a PyMEs
- Buenos conectores a ARCA
- **Debilidad**: web-only, UX pesada

### Xubio

- Contable + facturador
- Publico similar
- Plan free existia pero limitado

### Facturador Movil (AFIP oficial)

- App oficial de ARCA
- Gratis
- **Fortaleza**: oficial, confiable
- **Debilidad**: UX lenta, no integrable, sin conversacion

### AfipSDK

- Ya analizado en [[AfipSDK - Comercial]]
- SaaS que proxea a ARCA
- No tiene bot, es infra para devs
- Competidor indirecto (si alguien construye un bot lo haria sobre AfipSDK)

## AR - Bots WhatsApp (no facturacion)

### Wala / Walmeric

- WhatsApp para atencion al cliente / marketing
- No factura
- Util como referencia de UX conversacional

### Cliengo

- Chatbots multi-canal, orientado a ventas
- No cierra el loop fiscal

### Keybe / Leadsales

- CRM conversacional
- Integracion con WhatsApp Business
- No factura

## Internacional (referencias de UX)

### Xendit Chat (SEA)

- Bot de WhatsApp para pagos en Indonesia
- Modelo conversacional similar al que proponemos
- Buena inspiracion para UX

### Instapay / Revolut Chat

- Comandos bancarios por chat
- Referencia de "menu command" dentro del chat

### TurboTax (via chat)

- Intuit experimento con impuestos conversacionales
- Show of what's possible en fiscal conversational

## Open source

### pyafipws (Python)

- No es un bot, es un SDK para Python
- Ver [[pyafipws - Python]] en arca-sdk research
- Cubre 15+ servicios ARCA

### facturajs (TypeScript)

- Ver [[facturajs - TypeScript]]
- Solo cliente, no interface

### arcasdk (TypeScript)

- Ver [[arcasdk - TypeScript]]
- La mejor referencia arquitectonica para nuestro SDK

### No hay bots WhatsApp-ARCA open source conocidos

Oportunidad: podriamos publicar partes como OSS a futuro (el SDK, el motor de NLU fiscal, adapters). Beneficios: SEO, adopcion, reputacion.

## Diferenciadores potenciales

Lo que ningun competidor AR combina hoy:

1. **WhatsApp como canal unico** (no complemento web)
2. **Entrada por audio** (natural para monotributista de a pie)
3. **Confirmacion conversacional** (no formularios)
4. **Precio accesible por volumen real** (free para <20 facturas/mes)
5. **Setup <10 minutos** (cert, listo, facturá)

## Lecciones clave

- **Confianza importa mas que features**: el usuario firmante del CUIT se juega plata ante ARCA. Comunicar claridad, logs, reversibilidad via nota de credito.
- **Onboarding de cert es el bottleneck #1**: todos los productos que vi tienen soporte humano en ese paso. Invertir en tutorial o en "hecho con vos" humano.
- **El monotributista quiere simplicidad, no power features**: no intentar ganar a Contabilium en features. Ganar en simplicidad.

## Links

- [[Conversational Commerce - Estado del Arte]]
- [[AfipSDK - Comercial]]
- [[Comparativa de SDKs]]
- [[Contexto General]]
- [[Plan de Fases]]
