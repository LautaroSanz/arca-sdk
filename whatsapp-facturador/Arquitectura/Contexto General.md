---
tags: [whatsapp, contexto, producto]
created: 2026-04-20
---

# Contexto General

## Problema

El monotributista y la PyME argentina facturan desde el celular, muchas veces en movimiento (delivery, feria, venta ambulante, visita a cliente). Las alternativas actuales son:

- Panel web de ARCA (lento, requiere completar formulario largo en el telefono)
- Apps moviles propias (Facturador Movil AFIP, etc.) — funcionales pero friccionan el flujo comercial
- Sistemas de gestion (Tango, Colppy, Xubio) — potentes pero pensados para escritorio

**Oportunidad**: WhatsApp es el canal de comunicacion comercial dominante en Argentina. Emitir una factura sin salir del chat reduce friccion a cero.

## Producto

Bot de WhatsApp que:

1. Recibe un **audio** (o texto) describiendo una venta
2. Transcribe, interpreta, y arma el borrador de factura
3. Pide confirmacion con los datos extraidos
4. Emite el comprobante contra ARCA y devuelve CAE + PDF

Ejemplo:

```
Usuario (audio): "Factura B a Juan Perez, CUIT 20-11111111-2,
                  dos kilos de asado a siete mil el kilo"

Bot: "Detecte:
      - Factura B a Juan Perez (CUIT 20111111112)
      - 2 x Asado $7.000 c/u
      - Subtotal: $14.000
      - IVA 21%: $2.940
      - Total: $16.940
      [Confirmar] [Editar] [Cancelar]"

Usuario: [Confirmar]

Bot: "Factura emitida.
      CAE: 74123456789012
      Vencimiento: 30/04/2026
      [Descargar PDF]"
```

## Publico objetivo

- **Primario**: Monotributistas y Responsables Inscriptos que venden B2C o B2B con bajo volumen/factura
- **Secundario**: PyMEs con fuerza de venta en campo (comercial visitador, tecnico que cobra en domicilio)

Fuera de alcance inicial:
- Grandes contribuyentes con ERP (ya tienen integracion)
- Facturacion de exportacion (WSFEXv1, requiere mas campos)
- Facturacion con detalle de items obligatorio (WSMTXCA)

## Alcance funcional MVP

- Entrada: audio o texto por WhatsApp
- Salida: Factura A/B/C emitida via [[WSFEv1 - Factura Electronica|WSFEv1]]
- Receptor: consulta automatica a [[Padron ARCA]] para completar datos faltantes
- Confirmacion humana obligatoria antes de emitir CAE
- Historial de facturas emitidas consultable por WhatsApp
- Multi-tenant: un bot atiende a muchos CUITs emisores

## Links

- [[Flujo End-to-End]]
- [[Casos de Uso]]
- [[Plan de Fases]]
- [[ARCA - Contexto General]]
