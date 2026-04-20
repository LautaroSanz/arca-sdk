---
tags: [casos-uso, dialogos, ejemplos]
created: 2026-04-20
---

# Casos de Uso

Dialogos de ejemplo end-to-end para validar el diseño contra escenarios reales.

## Caso 1: Factura B happy path

**Usuario (monotributista emitiendo factura C a consumidor final):**

```
[audio 8s]: "Le hago una factura de doce mil pesos
             a consumidor final por servicio de plomeria"
```

**Pipeline:**
- STT: "Le hago una factura de doce mil pesos a consumidor final por servicio de plomeria"
- NLU: `{ tipo: "C", concepto: "servicios", receptor: CF, items: [{ desc: "servicio de plomeria", cantidad: 1, precio: 12000, alicuota: "no corresponde" }], total: 12000 }`
- No requiere Padron (CF no necesita CUIT)

**Bot:**
```
Preview:
 - Factura C a Consumidor Final
 - Servicio de plomeria x 1  $12.000
 - TOTAL: $12.000
 - Fecha: 20/04/2026
 
[Confirmar] [Editar] [Cancelar]
```

**Usuario:** [Confirmar]

**Bot (tras emision):**
```
Factura emitida.
 - Tipo: C
 - Numero: 0001-00001234
 - CAE: 74123456789012
 - Vencimiento: 30/04/2026
 - Total: $12.000

[PDF adjunto]
```

## Caso 2: Factura A con Padron lookup

**Usuario (Responsable Inscripto):**

```
[audio]: "Factura A a Constructora del Sur,
          CUIT 30-70111222-3, por dos metros de cable por 
          veinticinco mil, mas cinco herramientas a tres mil cada una"
```

**Pipeline:**
- NLU extrae: tipo A, CUIT, 2 items (cable 2x25000, herramienta 5x3000)
- Padron A13 lookup → nombre confirmado "CONSTRUCTORA DEL SUR SA", condicion_iva "RI"
- Calculo: items subtotal $65.000, IVA 21% = $13.650, total $78.650 (asumiendo precio NO incluye IVA — ver caso 3)

**Bot:**
```
Preview:
- Factura A a CONSTRUCTORA DEL SUR SA
  CUIT 30-70111222-3 | Responsable Inscripto
- Cable x 2 @ $25.000 = $50.000
- Herramienta x 5 @ $3.000 = $15.000
- Neto: $65.000
- IVA 21%: $13.650
- TOTAL: $78.650

El precio unitario incluye IVA? [No, son netos] [Si, ya incluyen]
```

**Usuario:** [No, son netos] → calculo ya era correcto

**Usuario:** [Confirmar] → emision.

## Caso 3: Correccion de precios con/sin IVA

Mismo audio que caso 2 pero el monotributista pensaba "25.000 final":

**Usuario (tras preview):** "No, son precios finales, el cable sale veinticinco mil final con iva"

**Pipeline:**
- NLU recibe draft + correccion
- Actualiza `precioIncluyeIva: true`
- Recalcula: subtotal $65.000 es ahora TOTAL, se calcula base = 65000/1.21

**Bot:**
```
Actualizado:
- Neto: $53.719,01
- IVA 21%: $11.280,99
- TOTAL: $65.000
[Confirmar] [Editar] [Cancelar]
```

## Caso 4: Datos faltantes

**Usuario:** "Factura a Juan por 5 mil pesos"

**Pipeline:**
- NLU detecta: `missingFields: ["receptor.nroDoc", "tipoComprobante"]`
- Tenant es RI → ambiguedad entre A (si receptor RI con CUIT) y B (CF o mono)

**Bot:**
```
Necesito mas datos:
- CUIT o DNI de Juan? (escribi el numero o "consumidor final")
```

**Usuario:** "Es consumidor final"

**Bot:**
```
Preview:
- Factura B a Consumidor Final
- Juan x 1 @ $5.000 = $5.000
- Neto: $4.132,23
- IVA 21%: $867,77
- TOTAL: $5.000

El item "Juan" parece un nombre. Queres corregir la descripcion?
[Si, editar descripcion] [Esta bien]
```

(Ejemplo de heuristica: si el LLM detecta que el item es sospechoso, propone correccion)

## Caso 5: Error de transcripcion

**Usuario:** [audio ruidoso]

**Pipeline:**
- STT devuelve `avg_logprob < -1.5` o texto muy corto
- Umbral de confianza disparado

**Bot:**
```
No te entendi bien, podes repetir el audio?
(Probá un lugar mas silencioso o dictá un poco mas despacio)
```

## Caso 6: Doble confirmacion por monto alto

Tenant tiene `umbralDobleConfirmacion = 500000`. Monto = $1.200.000.

**Bot (preview normal):**
```
... TOTAL: $1.200.000 ...

Monto elevado. Para confirmar, escribi EMITIR
(si es un error, tocá Cancelar)

[Cancelar]
```

**Usuario:** "EMITIR" → emision.

## Caso 7: Cancelacion

**Usuario (tras preview):** [Cancelar]

**Bot:**
```
Draft cancelado. Mandame otro audio cuando quieras facturar.
```

Draft se marca `cancelled`, audit log registra accion.

## Caso 8: Consulta de facturas emitidas

**Usuario:** "cuantas facturas emiti hoy?"

**Bot (no emite nada, solo consulta):**
```
Hoy: 7 facturas
- Total facturado: $145.320
- Ultimas 3:
  1. 0001-00001240 | Factura B | $12.000 | 14:22
  2. 0001-00001239 | Factura B | $78.650 | 13:05
  3. 0001-00001238 | Factura C | $5.000  | 12:40
```

Fase 2: comando `/facturas` mas completo.

## Caso 9: Problema con ARCA (caida)

**Pipeline:** FECAESolicitar devuelve timeout tras 3 reintentos.

**Bot:**
```
ARCA esta respondiendo lento. Tu factura quedo pendiente
de emision — la mandamos automaticamente cuando vuelva
y te aviso con el CAE. No hace falta que hagas nada.
```

Worker sigue reintentando con backoff exponencial hasta 1h. Tras eso, marca `failed_cae` y notifica al admin del tenant.

## Caso 10: Emision fuera de horario comercial

Heuristica anti-fraude: si el tenant nunca emite de noche y de repente hay 10 facturas a las 3am → alertar al admin por email y requerir `EMITIR` manual en cada una.

## Links

- [[Flujo End-to-End]]
- [[Extraccion Estructurada (NLU)]]
- [[Validacion y Confirmacion]]
- [[Idempotencia y Estado]]
