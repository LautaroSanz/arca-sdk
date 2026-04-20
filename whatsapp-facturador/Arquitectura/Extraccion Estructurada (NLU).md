---
tags: [nlu, llm, extraccion, function-calling]
created: 2026-04-20
---

# Extraccion Estructurada (NLU)

De texto transcripto (o escrito) a una estructura fuertemente tipada que sea consumible por [[WSFEv1 - Factura Electronica|WSFEv1]].

## Output target

```typescript
interface DraftInvoice {
  tipoComprobante: "A" | "B" | "C" | null;  // null si no fue especificado
  puntoVenta: number | null;                 // usar default del tenant si null
  concepto: "productos" | "servicios" | "ambos";
  receptor: {
    tipoDoc: "CUIT" | "DNI" | "CF" | null;   // CF = Consumidor Final
    nroDoc: string | null;
    nombre: string | null;
    condicionIva: string | null;             // se completa via Padron
  };
  items: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;                  // con o sin IVA? ver flag
    alicuotaIva: "0" | "10.5" | "21" | "27";
  }>;
  precioIncluyeIva: boolean;                 // clave — heuristica o preguntar
  moneda: "PES" | "USD";
  cotizacion: number | null;
  fechaComprobante: string | null;           // YYYY-MM-DD, default hoy
  confidence: number;                        // 0-1
  missingFields: string[];                   // campos a preguntar
}
```

## Estrategia: LLM con function calling

Usar un LLM con herramientas tipadas. Ver [[LLMs para NLU]] para eleccion del modelo.

Schema de la funcion:

```json
{
  "name": "extract_invoice",
  "description": "Extrae datos de una venta descripta en lenguaje natural",
  "input_schema": {
    "type": "object",
    "properties": {
      "tipoComprobante": { "type": "string", "enum": ["A", "B", "C"] },
      "receptor": { ... },
      "items": { "type": "array", ... },
      "precioIncluyeIva": { "type": "boolean" },
      "missingFields": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```

## Pipeline de extraccion

```
texto transcripto
     |
     v
[LLM extract_invoice]    <-- prompt con contexto del tenant
     |                       (tipo IVA, pto venta default, alicuota default)
     v
draft (potencialmente incompleto / inconsistente)
     |
     v
[Validador deterministico]
     |
     +-- aritmetica: sum(items) == subtotal; subtotal + iva == total
     +-- CUIT: digito verificador correcto
     +-- monto: >= 0, <= limite monotributo si aplica
     +-- fecha: no futura, no > 10 dias atras (AFIP rechaza)
     +-- coherencia tipo cbte <-> condicion IVA emisor
     |
     v
draft validado
     |
     v
[Enriquecimiento]
     |
     +-- Padron A13(nroDoc) -> nombre, condicionIva
     +-- Cache local de clientes previos del tenant
     |
     v
DraftInvoice completo
```

## Regla dura: el LLM NO hace aritmetica

**Nunca confiar en que el LLM calcule IVA, totales, o redondeos.**

El LLM extrae campos discretos:
- Items (descripcion, cantidad, precioUnitario)
- Alicuota declarada (21%, 10.5%)
- Flag "precio incluye IVA"

El calculo lo hace codigo deterministico:

```typescript
for (const item of items) {
  const subtotal = item.cantidad * item.precioUnitario;
  if (draft.precioIncluyeIva) {
    item.baseImp = round(subtotal / (1 + alicuota/100), 2);
    item.iva = round(subtotal - item.baseImp, 2);
  } else {
    item.baseImp = round(subtotal, 2);
    item.iva = round(subtotal * alicuota/100, 2);
  }
}

const impNeto = sum(items.map(i => i.baseImp));
const impIVA = sum(items.map(i => i.iva));
const impTotal = round(impNeto + impIVA, 2);
```

Motivo: alucinaciones del LLM en numeros son inaceptables cuando se emite un CAE (irreversible).

## Heuristicas y defaults

| Caso | Default |
|---|---|
| Usuario no dice tipo comprobante | Mirar condicion IVA del tenant: RI→preguntar A/B, Mono→C |
| No dice punto venta | Usar default del tenant |
| No dice alicuota IVA | 21% (la mas comun en AR) si tenant es RI, "no corresponde" si Mono |
| No dice receptor | Consumidor Final si monto < umbral AFIP, si no preguntar |
| No dice "incluye IVA" | Asumir que SI incluye (es lo natural al hablar) |

## Campos faltantes: conversacion iterativa

Si `missingFields` no es vacio, el bot pregunta uno a la vez:

```
Bot: "Para facturar necesito el CUIT del cliente"
Usuario: "20-30111222-3"
Bot: [actualiza draft, consulta Padron, muestra preview]
```

## Manejo de correcciones

Tras mostrar el preview, si el usuario dice "no, era 3 kilos no 2":

- Re-enviar el mensaje de correccion al mismo pipeline, con contexto del draft actual
- Prompt: "El usuario quiere corregir el draft. Draft actual: {...}. Correccion: {texto}. Devolve el draft actualizado"

## Observabilidad

Loguear para cada extraccion:
- Texto de entrada
- Funcion llamada + argumentos
- Tokens consumidos
- Latencia
- `confidence` (auto-reportada por el LLM, con todas las reservas)
- Si hubo correccion posterior (señal de error de extraccion)

Analisis offline: confusion matrix, campos con mayor tasa de correccion → mejorar prompt.

## Links

- [[Transcripcion de Audio (STT)]]
- [[Validacion y Confirmacion]]
- [[LLMs para NLU]]
- [[Padron ARCA]]
- [[Modelo de Datos]]
