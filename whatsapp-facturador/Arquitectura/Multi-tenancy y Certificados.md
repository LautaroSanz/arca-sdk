---
tags: [multi-tenant, certificados, seguridad]
created: 2026-04-20
---

# Multi-tenancy y Certificados

Un solo bot atiende a muchos CUITs emisores. Cada tenant trae su propio certificado X.509 emitido por ARCA.

## Modelo de tenant

```typescript
interface Tenant {
  id: string;                      // UUID interno
  cuit: string;                    // clave fiscal, unique
  razonSocial: string;
  condicionIva: "RI" | "MONO" | "EX" | "CF";
  puntoVentaDefault: number;
  env: "homologation" | "production";

  // Identificacion en WhatsApp
  whatsappPhoneIds: string[];      // numeros autorizados a facturar para este tenant

  // Configuracion
  alicuotaIvaDefault: "0" | "10.5" | "21";
  umbralDobleConfirmacion: number; // ej: 500000
  zonaHoraria: string;             // "America/Argentina/Buenos_Aires"

  // Cert (NO se guarda aca, solo referencia)
  certRef: string;                 // id en el secret store

  createdAt: Date;
  status: "active" | "suspended" | "pending_cert";
}
```

## Identificacion del tenant en un mensaje entrante

El webhook de WhatsApp trae `phone_number_id` (el numero receptor del bot) y `from` (el usuario emisor). Mapeo:

```
phone_number_id + from (wa_id) -> tenant
```

Opciones de modelo:

1. **Un bot por tenant**: cada tenant contrata su propio numero de WhatsApp Business, el bot detecta tenant por `phone_number_id`. **Recomendado para prod.**
2. **Bot compartido**: un solo numero, tenants identificados por enrolamiento previo del `wa_id` del operador. Mas simple para MVP pero con riesgos de confusion.

## Gestion de certificados

### Requerimientos

- Cert emitido por ARCA (tramite online con clave fiscal nivel 3)
- Renovacion: cada 2 años (vida util del cert)
- Puede existir cert de **homologacion** y cert de **produccion** por tenant

### Storage

**Nunca en filesystem del app server. Nunca en env vars largas. Nunca en DB en texto plano.**

Opciones:

| Opcion | Pros | Contras |
|---|---|---|
| AWS Secrets Manager / GCP Secret Manager | Rotacion, auditoria, KMS detras | Costo por secret ($0.40/mes ea.) |
| HashiCorp Vault | Self-hosted, flexible | Operacion |
| AWS KMS + S3 cifrado | Barato, simple | Menos features de rotacion |
| Supabase Vault / Neon Vault | Integrado con DB | Madurez variable |

**Recomendado MVP**: GCP Secret Manager o AWS Secrets Manager. Una entrada por tenant con el par `{cert, privateKey}` en PEM.

### Onboarding del cert

Flujo:

1. Admin del tenant se registra
2. Hace el tramite en ARCA (guia en docs del producto)
3. Sube `.crt` + `.key` via UI del panel (NO por WhatsApp)
4. La app valida:
   - Cert parse OK (X.509)
   - Match entre cert y private key
   - CUIT del cert == CUIT declarado del tenant
   - Fecha de vencimiento > 30 dias
5. Guarda en secret store, persiste solo la referencia
6. Test: hace un `WSAA.loginCms` + `WSFEv1.FEDummy` para confirmar conectividad

### Rotacion

- Aviso automatico 60/30/7 dias antes del vencimiento
- Permitir subir nuevo cert sin downtime (dos certs validos simultaneos durante overlap)
- Auditar cada uso del cert (tenant_id, operacion, timestamp)

## Aislamiento entre tenants

Reglas:
- Consultas a DB siempre con `WHERE tenant_id = $1` — enforced por middleware
- Row Level Security (RLS) en Postgres si se usa Supabase/Neon
- Cache de tickets WSAA con clave `tenant_id + service`
- Logs siempre incluyen `tenant_id`
- Metricas segregadas por tenant

## Limites por tenant

Para proteger a la infra y al tenant:

| Limite | Default |
|---|---|
| Facturas por dia | 500 |
| Facturas por minuto | 10 |
| Monto total por dia | $50M |
| Drafts pendientes max | 20 |

Excederlos -> responder al usuario con mensaje claro y alertar al admin.

## Links

- [[Contexto General]]
- [[Seguridad y Cumplimiento]]
- [[Integracion con ARCA SDK]]
- [[Certificados Digitales]]
