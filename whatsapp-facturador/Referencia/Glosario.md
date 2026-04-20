---
tags: [glosario, referencia]
created: 2026-04-20
---

# Glosario

Terminos recurrentes en el proyecto.

## ARCA / AFIP

| Termino | Definicion |
|---|---|
| **ARCA** | Agencia de Recaudacion y Control Aduanero. Sucesora de AFIP desde 2024 |
| **AFIP** | Administracion Federal de Ingresos Publicos (nombre hasta 2024) |
| **CUIT** | Clave Unica de Identificacion Tributaria. 11 digitos, con DV |
| **CUIL** | Version para trabajadores en relacion de dependencia |
| **DNI** | Documento Nacional de Identidad |
| **Clave fiscal** | Credencial del contribuyente en ARCA, con niveles de seguridad 1-5 |
| **Condicion IVA** | RI (Responsable Inscripto), Mono (Monotributista), EX (Exento), CF (Consumidor Final) |
| **Monotributo** | Regimen simplificado para pequeños contribuyentes; categorias A-K segun facturacion anual |
| **Factura A** | Emitida entre Responsables Inscriptos; discrimina IVA |
| **Factura B** | Emitida por RI a otros (CF, mono, exento); NO discrimina IVA |
| **Factura C** | Emitida por monotributistas o exentos |
| **Factura M** | Para contribuyentes con riesgo fiscal (retenciones especiales) |
| **Nota de Credito** | Documento para reversar total o parcialmente una factura |
| **Punto de Venta** | Numero que identifica el origen de emision (sucursal, caja, sistema) |
| **CAE** | Codigo de Autorizacion Electronico. 14 digitos que ARCA devuelve al autorizar un comprobante |
| **CAEA** | CAE Anticipado, para regimenes especiales |
| **RG** | Resolucion General de ARCA (ej. RG 1415, RG 5616) |
| **Padron** | Base de contribuyentes; consultable via WS para obtener datos de un CUIT |

## Servicios web

| Termino | Definicion |
|---|---|
| **WSAA** | Web Service de Autenticacion y Autorizacion |
| **WSN** | Web Service de Negocio (generico) |
| **WSFEv1** | Factura Electronica v1 (el mas usado) |
| **WSFEXv1** | Factura de Exportacion v1 |
| **WSMTXCA** | Factura con detalle de items (bienes de capital, etc) |
| **WSCDC** | Constatacion de comprobantes |
| **TRA** | Ticket de Requerimiento de Acceso. XML que firmo para pedir autenticarme |
| **TA** | Ticket de Acceso. Respuesta del WSAA, contiene Token+Sign |
| **Token + Sign** | Credenciales emitidas por WSAA, validas 12hs |
| **SOAP** | Simple Object Access Protocol. XML-based RPC |
| **WSDL** | Descriptor de un servicio SOAP |
| **PKCS#7 / CMS** | Formato de mensaje firmado digitalmente |
| **X.509** | Estandar de certificado digital |

## Proyecto

| Termino | Definicion |
|---|---|
| **SDK** | En este repo: el paquete @arca/sdk que encapsula la integracion con ARCA |
| **Tenant** | Un CUIT/empresa usuaria del sistema. Multi-tenant = muchos en una misma instancia |
| **Operador** | Persona humana que opera el bot en nombre del tenant (dueño, empleado) |
| **Draft** | Borrador de factura pendiente de confirmacion |
| **Preview** | Mensaje interactivo que muestra el draft al usuario antes de emitir |
| **Outbox** | Patron de diseño: escribir la intencion de llamada en DB y que un worker la ejecute |
| **Idempotencia** | Propiedad por la cual una operacion repetida produce el mismo resultado |
| **FSM** | Finite State Machine; maquina de estados de un draft/invoice |
| **Adapter** | Implementacion concreta de un puerto (interfaz de dominio) |
| **Puerto** | Interfaz de dominio que abstrae un recurso externo |

## WhatsApp / integraciones

| Termino | Definicion |
|---|---|
| **WABA** | WhatsApp Business Account |
| **BSP** | Business Solution Provider (ej. Twilio, 360dialog) |
| **Cloud API** | API oficial de Meta para WhatsApp Business, sin BSP |
| **wamid** | ID unico de mensaje WhatsApp |
| **wa_id** | Telefono en formato internacional (ej. 5491144445555) |
| **phone_number_id** | ID del numero del bot en Meta |
| **Interactive message** | Mensaje con botones o lista |
| **Template message** | Mensaje pre-aprobado por Meta para enviar fuera de ventana 24h |
| **Ventana 24h** | Periodo tras el ultimo mensaje del usuario donde el bot puede responder libremente |
| **STT** | Speech to Text (transcripcion de audio) |
| **NLU** | Natural Language Understanding (extraccion de intencion/entidades) |
| **LLM** | Large Language Model |
| **Function calling / Tool use** | Capacidad del LLM de devolver outputs estructurados via schemas |
| **Prompt caching** | Cache de prompts repetidos para reducir costo/latencia |

## Compliance

| Termino | Definicion |
|---|---|
| **AAIP** | Agencia de Acceso a la Informacion Publica. Regula proteccion de datos en AR |
| **DPO** | Data Protection Officer |
| **DPA** | Data Processing Agreement; contrato con procesadores de datos |
| **Ley 25.326** | Ley de Proteccion de Datos Personales (AR) |
| **PII** | Personally Identifiable Information |
| **RLS** | Row Level Security (Postgres) |
| **KMS** | Key Management Service |
| **PITR** | Point In Time Recovery |

## Links

- [[WhatsApp Facturador - Index]]
