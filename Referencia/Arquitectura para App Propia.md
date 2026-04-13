---
tags: [arca, arquitectura, diseño, implementacion]
created: 2026-04-13
---

# Arquitectura para App Propia

Diseño propuesto para construir nuestra propia implementacion de SDK para ARCA, basado en el analisis de [[Comparativa de SDKs|todos los SDKs existentes]].

## Componentes necesarios

### 1. Modulo de Criptografia

Responsabilidad: Firma PKCS#7/CMS del TRA

Referencia: [[arcasdk - TypeScript]] usa `node-forge`:
```typescript
const p7 = forge.pkcs7.createSignedData();
p7.content = forge.util.createBuffer(data, "utf8");
p7.addCertificate(cert);
p7.addSigner({ digestAlgorithm: forge.pki.oids.sha256, ... });
p7.sign();
```

Consideraciones:
- Aceptar cert/key como string PEM (serverless-friendly)
- Tambien soportar rutas a archivos (desarrollo local)
- SHA-256 como algoritmo de digest

### 2. Cliente WSAA

Responsabilidad: [[WSAA - Flujo de Autenticacion|Obtener y cachear Ticket de Acceso]]

Flujo:
1. Crear TRA (XML) con uniqueId, timestamps, service name
2. Firmar con modulo de criptografia
3. Llamar `loginCms(in0=base64CMS)` via SOAP
4. Parsear respuesta → Token + Sign + ExpirationTime
5. Cachear ticket (storage pluggable)
6. Reutilizar hasta expiracion

Interfaz sugerida:
```typescript
interface ITicketStorage {
  get(service: string, cuit: string): AccessTicket | null;
  set(service: string, cuit: string, ticket: AccessTicket): void;
}
```

### 3. Cliente SOAP Generico

Responsabilidad: Ejecutar llamadas SOAP con inyeccion automatica de Auth

Patron recomendado: **Auth Proxy** (como [[arcasdk - TypeScript]])
- Interceptar llamadas SOAP
- Detectar metodos que requieren Auth (via WSDL schema)
- Inyectar Token/Sign/Cuit automaticamente

Consideraciones:
- Embeber WSDLs como strings (serverless)
- O hacer fetch dinamico del WSDL (desarrollo)
- Libreria SOAP: `soap` (npm) para Node.js

### 4. Modulos de Servicio

Un modulo por servicio de negocio:

| Modulo | Servicio | Prioridad |
|---|---|---|
| ElectronicBilling | [[WSFEv1 - Factura Electronica\|WSFEv1]] | Alta |
| Register | [[Padron - Consultas\|Padron A4/A10/A13]] | Alta |
| ExportBilling | [[WSFEXv1 - Factura Exportacion\|WSFEXv1]] | Media |
| DetailedBilling | [[WSMTXCA - Factura con Detalle\|WSMTXCA]] | Media |
| Verification | WSCDC | Baja |

Cada modulo:
- Tipado fuerte (DTOs de entrada y salida)
- Metodos que mapean 1:1 con operaciones WSDL
- Manejo de errores especifico del servicio

### 5. Manejo de Errores

- Errores WSAA: [[Codigos de Error WSAA]]
- Error 10016 (WSFEv1): Comprobante ya autorizado → reprocesar
- Timeout de red: Retry con backoff exponencial
- Ticket expirado: Renovar automaticamente

## Stack tecnologico sugerido

| Componente | Opcion |
|---|---|
| Lenguaje | TypeScript |
| Firma PKCS#7 | `node-forge` |
| Cliente SOAP | `soap` (npm) |
| Parseo XML | `xml2js` o `fast-xml-parser` |
| NTP sync | `ntp-time-sync` (como [[facturajs - TypeScript\|facturajs]]) |
| Testing | Vitest |
| Build | tsup o esbuild |

## Estructura propuesta

```
src/
  core/
    crypto/           # Firma PKCS#7
    wsaa/             # Cliente WSAA + cache
    soap/             # Cliente SOAP generico + Auth Proxy
    storage/          # Interfaces y adaptadores de storage
  services/
    electronic-billing/   # WSFEv1
    export-billing/       # WSFEXv1
    register/             # Padron
    verification/         # WSCDC
  types/                  # DTOs, interfaces compartidas
  config/                 # Endpoints, ambiente
  index.ts                # Fachada principal
```

## Proximos pasos

1. Inicializar proyecto TypeScript con tooling
2. Implementar modulo de criptografia
3. Implementar cliente WSAA con tests contra homologacion
4. Implementar WSFEv1 como primer servicio
5. Agregar servicios adicionales incrementalmente

## Links

- [[Comparativa de SDKs]]
- [[WSAA - Flujo de Autenticacion]]
- [[WSFEv1 - Factura Electronica]]
- [[Endpoints y WSDLs]]
