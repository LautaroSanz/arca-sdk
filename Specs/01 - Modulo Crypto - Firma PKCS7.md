---
tags: [arca, spec, crypto]
created: 2026-04-19
estado: draft
fase: 1
depende_de: ["[[00 - Bootstrap del Proyecto]]"]
proyecto: "[[ARCA SDK - Index|ARCA SDK]]"
---

# Spec 01 — Modulo Crypto (Firma PKCS#7)

## Objetivo

Firmar un string (el TRA XML) con certificado X.509 + clave privada usando PKCS#7/CMS, devolviendo el resultado en base64 listo para enviar a `loginCms`.

## Ubicacion

`src/core/crypto/sign.ts`

## API publica

```typescript
export interface SignInput {
  content: string;   // TRA XML
  cert: string;      // PEM
  key: string;       // PEM
}

export interface SignedCms {
  base64: string;    // lo que va en loginCms(in0)
}

export function signCms(input: SignInput): SignedCms;
```

## Implementacion

Con `node-forge`:

1. `forge.pkcs7.createSignedData()`
2. `content = forge.util.createBuffer(input.content, "utf8")`
3. `addCertificate(cert)`
4. `addSigner({ key, certificate, digestAlgorithm: sha256 })`
5. `sign({ detached: false })`
6. Serializar a DER → base64

## Errores

- `CryptoError("CRYPTO.CERT_INVALID")` si el PEM no parsea
- `CryptoError("CRYPTO.KEY_INVALID")` si la key no parsea
- `CryptoError("CRYPTO.SIGN_FAILED", { cause })` envolviendo cualquier error de forge

## Criterios de aceptacion

- [ ] Firma un TRA de referencia y produce un CMS valido verificable con `openssl cms -verify`
- [ ] Falla con `CryptoError` ante PEM corrupto
- [ ] No toca filesystem ni red

## Tests minimos

- Unit: firma de TRA fixture y verificacion estructural
- Unit: cert invalido → `CryptoError("CRYPTO.CERT_INVALID")`

## Links

- [[Certificados Digitales]]
- [[02 - TRA Builder]]
- [[09 - WSAA Client]]
