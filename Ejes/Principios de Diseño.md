---
tags: [arca, ejes, diseño]
created: 2026-04-19
estado: draft
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Principios de Diseño

Decisiones transversales que rigen el codigo del SDK.

## 1. Directo a ARCA

Ninguna llamada pasa por servidores intermedios. Inspirado en [[arcasdk - TypeScript]] y opuesto a [[AfipSDK - Comercial]].

## 2. Serverless-friendly

- Aceptar certificados como strings PEM, no solo rutas de archivo
- WSDLs embebidos como strings para evitar fetch en cold start
- Sin estado global mutable
- Storage pluggable para entornos sin filesystem

## 3. Tipado fuerte end-to-end

- DTOs estrictos en entrada y salida de cada operacion
- `any` prohibido en API publica
- Enums para codigos de ARCA (tipos de comprobante, conceptos, etc.)

## 4. Separacion core / servicios

- `core/` no conoce servicios especificos
- `services/` no reimplementa nada de `core/`
- Un servicio nuevo = un modulo en `services/` + tipos + WSDL embebido

## 5. Autenticacion implicita

El consumidor pide una operacion de negocio. El SDK decide si necesita ticket nuevo, lo obtiene, y lo inyecta. Ver [[11 - Auth Proxy Pattern]].

## 6. Errores tipados y accionables

Cada error del SDK es una instancia de una clase especifica (`WsaaError`, `WsnError`, `ConfigError`). Ver [[Modelo de Errores]].

## 7. Explicito > inteligente

Preferimos codigo obvio aunque sea mas largo. La magia solo se paga donde el costo de no tenerla es alto (Auth Proxy).

## 8. Tests contra homologacion como primera clase

No nos conformamos con mocks. Hay una suite que corre contra el ambiente de homologacion de ARCA con credenciales reales. Ver [[Estrategia de Testing]].

## Links

- [[Vision y Alcance]]
- [[Stack Tecnologico]]
- [[Modelo de Errores]]
