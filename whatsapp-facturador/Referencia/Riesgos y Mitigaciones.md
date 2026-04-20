---
tags: [riesgos, mitigacion, analisis]
created: 2026-04-20
---

# Riesgos y Mitigaciones

Mapa de riesgos tecnicos, de negocio y regulatorios. Severidad `S = impacto × probabilidad`.

## Tecnicos

| Riesgo | Impacto | Prob | Mitigacion |
|---|---|---|---|
| Alucinacion del LLM en montos | Alto (factura erronea emitida) | Media | Aritmetica 100% deterministica post-LLM; confirmacion humana obligatoria |
| Error STT en CUITs (numeros confundidos) | Alto | Media | Validacion con digito verificador; cuando falla, pedir texto escrito |
| Error STT en montos (14 vs 40) | Alto | Media | Smart formatting (Deepgram) o post-procesamiento con heuristica; preview siempre |
| Caida de ARCA | Medio (demora) | Alta | Outbox + retries + notificacion al usuario; SLA de ARCA historicamente alto pero con caidas ocasionales |
| Rate limit ARCA | Medio | Baja | Cache padron 24h; batching de FECAESolicitar si aplica |
| Webhook reintentado | Alto (duplicado) | Alta | Idempotencia por wamid; constraint unique en invoices |
| Cert X.509 vencido sin aviso | Alto (bot deja de facturar) | Baja | Alertas 60/30/7 dias antes; monitoring de expiracion |
| Cert comprometido | Critico (fraude fiscal) | Muy baja | Secret manager + auditoria + alertas por uso anomalo; rotacion 2 años |
| Cambio de API WhatsApp | Medio | Media | Adapter pattern, version pinning, monitoreo de changelogs |
| Cambio en WSDL ARCA | Medio | Baja | SDK como capa de aislamiento; WSDLs embebidos; suite de tests contra homologacion |
| Timeout LLM | Bajo | Media | Retry + fallback a pregunta conversacional |
| Usuario toca Confirmar dos veces | Alto (duplicado) | Media | Idempotencia + UI que deshabilita boton post-click |

## De negocio

| Riesgo | Impacto | Prob | Mitigacion |
|---|---|---|---|
| Usuario emite factura errada (CUIT equivocado) | Medio (requiere NC) | Alta | Preview claro con nombre del Padron; NC via WhatsApp en fase 2 |
| Fraude por cuenta operador comprometida | Critico | Baja | Doble confirmacion montos altos; alertas IP/horario anomalo; panel con 2FA |
| Tenant excede limite monotributo | Medio | Media | Warning cuando se acerca al tope; no bloqueante |
| Competencia (AfipSDK + bot rival) | Medio | Alta | Diferenciadores: audio-first, precio, UX |
| Meta suspende cuenta del bot | Alto | Baja | Numeros dedicados por tenant en fase escala; BSP de respaldo |
| Cambio regulatorio ARCA | Medio | Media | Monitoreo de RGs; SDK versionado; fixture tests |
| Resistencia a cambiar de herramienta actual | Medio | Alta | Import de clientes desde CSV; tutoriales; free tier generoso |

## Regulatorios

| Riesgo | Impacto | Prob | Mitigacion |
|---|---|---|---|
| Incumplimiento ley 25.326 | Critico (multa + reputacion) | Media | Registro AAIP; DPO; politicas publicas; DPA con proveedores |
| Transferencia internacional de datos sin base legal | Alto | Media | DPA firmados (OpenAI/Anthropic/etc); consentimiento informado |
| No conservar comprobantes 10 años (RG 1415) | Alto | Baja | Backup cold storage con retencion 10 años minimo |
| WhatsApp ToS: spam / opt-in incorrecto | Alto | Media | Bot solo responde, nunca inicia; opt-in explicito en signup |
| Publicidad engañosa ("factura sin contador") | Bajo | Baja | Copy cuidadoso; disclaimer legal |

## Operacionales

| Riesgo | Impacto | Prob | Mitigacion |
|---|---|---|---|
| Bus factor = 1 (1 dev senior) | Alto | Alta | Documentacion detallada (este vault); codigo legible; on-call con runbook |
| Perdida de secret manager | Critico | Muy baja | Backups de configuracion; disaster recovery runbook |
| Factura en limbo (draft olvidado) | Bajo | Media | Cron job limpia drafts > 24h |
| Facturas rechazadas por ARCA | Medio | Media | Logging + alertas; retry manual desde panel |
| Soporte al usuario saturado | Medio | Media | FAQ por WhatsApp; comando `/ayuda`; panel admin autoservicio |

## Seguridad

| Riesgo | Impacto | Prob | Mitigacion |
|---|---|---|---|
| SQL injection | Critico | Baja | ORM parametrizado (Drizzle); code review |
| XSS en panel admin | Alto | Baja | React auto-escape; CSP strict |
| Token de WhatsApp leak | Alto | Baja | Secret manager; rotacion; monitoreo de Github leaks |
| Webhook sin verificacion de firma | Critico | Baja | Middleware obligatorio; tests que verifican |
| Prompt injection via audio | Medio | Baja | LLM solo retorna via tool call tipado; validaciones duras post-LLM |
| DoS por flood de mensajes | Medio | Media | Rate limit por wa_id y tenant; BullMQ con prioridades |

## Riesgos top (lista corta)

Top 5 que requieren atencion continua:

1. **Alucinacion del LLM en montos** — requiere aritmetica deterministica + confirmacion humana SIEMPRE
2. **Webhook duplicado → factura duplicada** — idempotencia end-to-end es OBLIGATORIA, no opcional
3. **Cert comprometido** — secret manager + auditoria + alertas
4. **Incumplimiento ley 25.326** — hacer el registro AAIP antes de lanzar beta publica
5. **Caida de ARCA con usuarios esperando** — UX clara de "pendiente" + outbox

## Links

- [[Idempotencia y Estado]]
- [[Seguridad y Cumplimiento]]
- [[Validacion y Confirmacion]]
- [[Multi-tenancy y Certificados]]
