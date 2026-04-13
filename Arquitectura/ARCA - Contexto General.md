---
tags: [arca, afip, contexto]
created: 2026-04-13
---

# ARCA - Contexto General

## Que es ARCA

**ARCA** (Agencia de Recaudacion y Control Aduanero) reemplazo a **AFIP** (Administracion Federal de Ingresos Publicos) en octubre 2024 bajo el Decreto 953/2024.

ARCA heredo toda la infraestructura de facturacion electronica, web services y especificaciones tecnicas de AFIP. Los endpoints siguen usando dominios `afip.gov.ar` / `afip.gob.ar`.

## Arquitectura general

Toda la comunicacion entre entidades externas y ARCA se implementa mediante **Web Services SOAP sobre HTTPS**. No se requieren VPNs ni canales especiales.

La arquitectura tiene dos capas:

1. **[[WSAA - Flujo de Autenticacion|WSAA]]** — Gateway de autenticacion/autorizacion
2. **WSN (Web Services de Negocio)** — Los servicios de negocio propiamente dichos ([[WSFEv1 - Factura Electronica|WSFEv1]], [[Padron - Consultas|Padron]], etc.)

Cada llamada a un WSN requiere un **Ticket de Acceso (TA)** valido obtenido del WSAA. Cada TA es valido para un WSN especifico y tiene una **validez de 12 horas**.

## Ambientes

| Ambiente | Uso | Dominio |
|---|---|---|
| **Homologacion** | Testing/desarrollo | `wsaahomo.afip.gov.ar`, `wswhomo.afip.gov.ar` |
| **Produccion** | Produccion real | `wsaa.afip.gov.ar`, `servicios1.afip.gov.ar` |

## Soporte

- Testing: `webservices-desa@arca.gob.ar`
- Produccion: `sri@arca.gob.ar`

## Links relacionados

- [[Catalogo de Servicios]]
- [[Documentacion Oficial]]
- [[Certificados Digitales]]
