---
tags: [ux, human-in-the-loop, confirmacion]
created: 2026-04-20
---

# Validacion y Confirmacion

Emision de CAE es **irreversible** desde el punto de vista fiscal (se revierte solo con nota de credito). Por eso **toda factura pasa por confirmacion humana explicita** antes de llamar a `FECAESolicitar`.

## Principio de diseño

> Automatizar la redaccion, no la decision.

El bot ahorra tipeo y calculos; el humano conserva el "OK final".

## Preview message

Mensaje interactivo de WhatsApp (template `interactive` con botones):

```
Revisa los datos:

COMPROBANTE
- Tipo: Factura B
- Punto de venta: 0001
- Fecha: 20/04/2026

RECEPTOR
- Juan Perez
- CUIT: 20-11111111-2
- Condicion IVA: Responsable Inscripto

ITEMS
- Asado x 2 kg  @ $7.000    =  $14.000

TOTALES
- Subtotal (neto): $11.570,25
- IVA 21%:         $ 2.429,75
- TOTAL:           $14.000,00
```

Con botones:
```
[ Confirmar ]  [ Editar ]  [ Cancelar ]
```

## Botones (WhatsApp interactive)

WhatsApp permite hasta 3 quick reply buttons con payload. Mapeo:

| Boton | Payload | Accion |
|---|---|---|
| Confirmar | `confirm:{draftId}` | Ejecuta emision |
| Editar | `edit:{draftId}` | Entra en flujo de correccion |
| Cancelar | `cancel:{draftId}` | Marca draft como descartado |

## Flujo de correccion

Al tocar "Editar":

```
Bot: "Que queres corregir?
      1. Receptor
      2. Items
      3. Tipo de comprobante
      4. Punto de venta
      (o decime en palabras)"

Usuario: "el cliente era Maria no Juan"

Bot: [re-ejecuta NLU con draft + correccion, vuelve a mostrar preview]
```

Opcion alternativa: dejar que el usuario grabe otro audio con la correccion. El pipeline lo toma como "mensaje de correccion sobre draft pendiente".

## Validaciones pre-envio

Antes de mostrar el preview, el draft pasa por reglas duras:

| Regla | Error si falla |
|---|---|
| `sum(items.baseImp) + sum(items.iva) == total` con tolerancia 0.01 | `INVALID_ARITHMETIC` |
| CUIT receptor tiene digito verificador correcto | `INVALID_CUIT` |
| Total > 0 | `INVALID_AMOUNT` |
| Fecha dentro de rango AFIP (hasta 10 dias atras, hasta hoy) | `INVALID_DATE` |
| Tipo de comprobante compatible con condicion IVA del emisor | `INVALID_TYPE_FOR_EMITTER` |
| Si es Factura A o M: receptor debe tener CUIT (no DNI/CF) | `INVALID_RECEIVER_FOR_TYPE` |
| Si emisor es monotributista: solo Factura C | `INVALID_TYPE_FOR_MONO` |
| Monto total no supera limite facturacion monotributo anual (si aplica) | `MONOTRIBUTO_LIMIT_WARNING` (warning, no error) |

## Timeouts

- **Confirmacion pendiente**: 24hs. Pasado ese tiempo, el draft se descarta y el bot avisa.
- **Ventana WhatsApp 24h**: si el usuario no confirma y se cae de la ventana, el bot envia un template message pre-aprobado "Tu factura de $X esta pendiente de confirmacion, responde SI para emitirla".

## Seguridad adicional

Para montos altos (configurable por tenant, ej >$500.000) pedir doble confirmacion:

```
Bot: "Factura por $1.250.000 — confirma escribiendo EMITIR"
Usuario: "EMITIR"
```

Evita emisiones masivas por error / cuenta comprometida.

## Auditoria

Registrar en el modelo de datos:
- `draft.previewSentAt`
- `draft.userAction` (`confirmed` | `edited` | `cancelled` | `timed_out`)
- `draft.confirmedAt`
- Texto exacto del preview enviado (no regenerar en cada vista, guardarlo)

## Links

- [[Flujo End-to-End]]
- [[Extraccion Estructurada (NLU)]]
- [[Idempotencia y Estado]]
- [[Modelo de Datos]]
