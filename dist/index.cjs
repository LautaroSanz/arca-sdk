"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Arca: () => Arca,
  ArcaError: () => ArcaError,
  CbteTipo: () => CbteTipo,
  Concepto: () => Concepto,
  ConfigError: () => ConfigError,
  CryptoError: () => CryptoError,
  DocTipo: () => DocTipo,
  DuplicateInvoiceError: () => DuplicateInvoiceError,
  ENDPOINTS: () => ENDPOINTS,
  FsTicketStorage: () => FsTicketStorage,
  IvaId: () => IvaId,
  MemoryTicketStorage: () => MemoryTicketStorage,
  SDK_VERSION: () => SDK_VERSION,
  SoapError: () => SoapError,
  TimeSkewError: () => TimeSkewError,
  TributoId: () => TributoId,
  WsCdcError: () => WsCdcError,
  WsMtxcaError: () => WsMtxcaError,
  WsPadronError: () => WsPadronError,
  WsaaError: () => WsaaError,
  WsfeError: () => WsfeError,
  WsfexError: () => WsfexError,
  WsnError: () => WsnError,
  consoleLogger: () => consoleLogger,
  createNtpClock: () => createNtpClock,
  createSystemClock: () => createSystemClock,
  fetchWsdls: () => fetchWsdls,
  isAboutToExpire: () => isAboutToExpire,
  isExpired: () => isExpired,
  isRetryable: () => isRetryable,
  noopLogger: () => noopLogger
});
module.exports = __toCommonJS(index_exports);

// src/core/wsaa/client.ts
var import_fast_xml_parser = require("fast-xml-parser");

// src/core/wsaa/access-ticket.ts
function isExpired(ticket, now = /* @__PURE__ */ new Date()) {
  return now.getTime() > ticket.expirationTime.getTime();
}
function isAboutToExpire(ticket, marginSeconds, now = /* @__PURE__ */ new Date()) {
  const diffMs = ticket.expirationTime.getTime() - now.getTime();
  return diffMs <= marginSeconds * 1e3;
}

// src/core/storage/memory-storage.ts
var MemoryTicketStorage = class {
  cache = /* @__PURE__ */ new Map();
  key(service, cuit) {
    return `${service}:${cuit}`;
  }
  async get(service, cuit) {
    const k = this.key(service, cuit);
    const ticket = this.cache.get(k);
    if (!ticket) return null;
    if (isExpired(ticket)) {
      this.cache.delete(k);
      return null;
    }
    return ticket;
  }
  async set(ticket) {
    this.cache.set(this.key(ticket.service, ticket.cuit), ticket);
  }
  async delete(service, cuit) {
    this.cache.delete(this.key(service, cuit));
  }
};

// src/core/wsaa/ntp.ts
var import_ntp_time_sync = require("ntp-time-sync");

// src/core/logging/logger.ts
var LEVELS = ["debug", "info", "warn", "error"];
var SENSITIVE_KEYS = /* @__PURE__ */ new Set(["token", "sign", "cert", "key", "password", "secret"]);
function sanitize(meta) {
  if (!meta) return void 0;
  const cleaned = {};
  for (const [k, v] of Object.entries(meta)) {
    cleaned[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return cleaned;
}
var noopLogger = {
  debug() {
  },
  info() {
  },
  warn() {
  },
  error() {
  }
};
function consoleLogger(level = "info") {
  const minIdx = LEVELS.indexOf(level);
  const emit = (lvl, msg, meta) => {
    if (LEVELS.indexOf(lvl) < minIdx) return;
    const clean = sanitize(meta);
    const prefix = `[${lvl}] ${msg}`;
    switch (lvl) {
      case "debug":
        if (clean) console.debug(prefix, clean);
        else console.debug(prefix);
        return;
      case "info":
        if (clean) console.info(prefix, clean);
        else console.info(prefix);
        return;
      case "warn":
        if (clean) console.warn(prefix, clean);
        else console.warn(prefix);
        return;
      case "error":
        if (clean) console.error(prefix, clean);
        else console.error(prefix);
        return;
    }
  };
  return {
    debug: (msg, meta) => emit("debug", msg, meta),
    info: (msg, meta) => emit("info", msg, meta),
    warn: (msg, meta) => emit("warn", msg, meta),
    error: (msg, meta) => emit("error", msg, meta)
  };
}

// src/core/wsaa/ntp.ts
function createSystemClock() {
  return { now: async () => /* @__PURE__ */ new Date() };
}
function createNtpClock(options = {}) {
  const server = options.server ?? "time.afip.gov.ar";
  const logger = options.logger ?? noopLogger;
  const cacheTtlMs = (options.cacheTtlSeconds ?? 300) * 1e3;
  let cachedOffset = null;
  let cachedAt = 0;
  return {
    async now() {
      const sysNow = Date.now();
      if (cachedOffset !== null && sysNow - cachedAt < cacheTtlMs) {
        return new Date(sysNow + cachedOffset);
      }
      try {
        const sync = import_ntp_time_sync.NtpTimeSync.getInstance({ servers: [server] });
        const result = await sync.getTime();
        const offset = result.offset;
        cachedOffset = offset;
        cachedAt = Date.now();
        return new Date(Date.now() + offset);
      } catch (err) {
        logger.warn("NTP sync failed, falling back to system clock", {
          server,
          error: String(err)
        });
        return /* @__PURE__ */ new Date();
      }
    }
  };
}

// src/core/crypto/sign.ts
var import_node_forge = __toESM(require("node-forge"), 1);

// src/core/errors/base.ts
var SENSITIVE_KEYS2 = /* @__PURE__ */ new Set(["token", "sign", "cert", "key", "password", "secret"]);
function sanitizeContext(ctx) {
  if (!ctx) return void 0;
  const cleaned = {};
  for (const [k, v] of Object.entries(ctx)) {
    cleaned[k] = SENSITIVE_KEYS2.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return cleaned;
}
var ArcaError = class extends Error {
  cause;
  context;
  constructor(opts) {
    super(opts.message);
    this.name = this.constructor.name;
    this.cause = opts.cause;
    this.context = sanitizeContext(opts.context);
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...this.context ? { context: this.context } : {}
    };
  }
};

// src/core/errors/crypto.ts
var CryptoError = class extends ArcaError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};

// src/core/crypto/sign.ts
var SHA256_OID = "2.16.840.1.101.3.4.2.1";
function signCms(input) {
  let cert;
  try {
    cert = import_node_forge.default.pki.certificateFromPem(input.cert);
  } catch (err) {
    throw new CryptoError("CRYPTO.CERT_INVALID", {
      message: "Failed to parse certificate PEM",
      cause: err
    });
  }
  let privateKey;
  try {
    privateKey = import_node_forge.default.pki.privateKeyFromPem(input.key);
  } catch (err) {
    throw new CryptoError("CRYPTO.KEY_INVALID", {
      message: "Failed to parse private key PEM",
      cause: err
    });
  }
  try {
    const p7 = import_node_forge.default.pkcs7.createSignedData();
    p7.content = import_node_forge.default.util.createBuffer(input.content, "utf8");
    p7.addCertificate(cert);
    p7.addSigner({
      key: privateKey,
      certificate: cert,
      digestAlgorithm: SHA256_OID
    });
    p7.sign({ detached: false });
    const der = import_node_forge.default.asn1.toDer(p7.toAsn1()).getBytes();
    return { base64: import_node_forge.default.util.encode64(der) };
  } catch (err) {
    throw new CryptoError("CRYPTO.SIGN_FAILED", {
      message: "PKCS#7 signing failed",
      cause: err
    });
  }
}

// src/core/wsaa/tra-builder.ts
function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
function formatWithOffset(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  const offsetMinTotal = -d.getTimezoneOffset();
  const offsetSign = offsetMinTotal >= 0 ? "+" : "-";
  const offsetH = pad(Math.floor(Math.abs(offsetMinTotal) / 60));
  const offsetM = pad(Math.abs(offsetMinTotal) % 60);
  return `${year}-${month}-${day}T${hour}:${min}:${sec}${offsetSign}${offsetH}:${offsetM}`;
}
function buildTra(input) {
  const now = input.now ?? /* @__PURE__ */ new Date();
  const ttl = input.ttlSeconds ?? 600;
  const generationTime = new Date(now.getTime() - 60 * 1e3);
  const expirationTime = new Date(now.getTime() + ttl * 1e3);
  const uniqueId = Math.floor(now.getTime() / 1e3);
  return `<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>${uniqueId}</uniqueId>
    <generationTime>${formatWithOffset(generationTime)}</generationTime>
    <expirationTime>${formatWithOffset(expirationTime)}</expirationTime>
  </header>
  <service>${escapeXml(input.service)}</service>
</loginTicketRequest>`;
}

// src/config/endpoints.ts
var ENDPOINTS = {
  testing: {
    wsaa: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
    wsfev1: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx",
    wsfexv1: "https://wswhomo.afip.gov.ar/wsfexv1/service.asmx",
    wsmtxca: "https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService",
    wscdc: "https://wswhomo.afip.gov.ar/WSCDC/service.asmx",
    padronA4: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA4",
    padronA10: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA10",
    padronA13: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA13",
    ntp: "time.afip.gov.ar"
  },
  production: {
    wsaa: "https://wsaa.afip.gov.ar/ws/services/LoginCms",
    wsfev1: "https://servicios1.afip.gov.ar/wsfev1/service.asmx",
    wsfexv1: "https://servicios1.afip.gov.ar/wsfexv1/service.asmx",
    wsmtxca: "https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService",
    wscdc: "https://servicios1.afip.gov.ar/WSCDC/service.asmx",
    padronA4: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA4",
    padronA10: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA10",
    padronA13: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA13",
    ntp: "time.afip.gov.ar"
  }
};

// src/core/errors/wsaa.ts
var WsaaError = class extends ArcaError {
  code;
  arcaCode;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
    this.arcaCode = opts.arcaCode;
  }
  toJSON() {
    const base = super.toJSON();
    return this.arcaCode ? { ...base, arcaCode: this.arcaCode } : base;
  }
};

// src/core/errors/soap.ts
var SoapError = class extends ArcaError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};

// src/core/soap/client.ts
var import_node_fs = require("fs");
var os = __toESM(require("os"), 1);
var path = __toESM(require("path"), 1);
var soap = __toESM(require("soap"), 1);
async function resolveWsdl(wsdl) {
  if (typeof wsdl === "string") {
    const dir = await import_node_fs.promises.mkdtemp(path.join(os.tmpdir(), "arca-wsdl-"));
    const file = path.join(dir, "service.wsdl");
    await import_node_fs.promises.writeFile(file, wsdl);
    return {
      wsdlPath: file,
      cleanup: async () => {
        await import_node_fs.promises.rm(dir, { recursive: true, force: true });
      }
    };
  }
  return { wsdlPath: wsdl.url, cleanup: async () => {
  } };
}
function withTimeout(promise, timeoutMs, method) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new SoapError("SOAP.TIMEOUT", {
          message: `SOAP call timed out after ${timeoutMs}ms`,
          context: { method, timeoutMs }
        })
      );
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}
async function createSoapClient(opts) {
  const timeoutMs = opts.timeoutMs ?? 3e4;
  const { wsdlPath, cleanup } = await resolveWsdl(opts.wsdl);
  let client;
  try {
    client = await soap.createClientAsync(wsdlPath, { endpoint: opts.endpoint });
  } catch (err) {
    await cleanup();
    throw new SoapError("SOAP.WSDL_FAILED", {
      message: "Failed to create SOAP client from WSDL",
      cause: err,
      context: { endpoint: opts.endpoint }
    });
  }
  await cleanup();
  client.setEndpoint(opts.endpoint);
  return {
    async call(method, args) {
      const record = client;
      const methodAsync = record[`${method}Async`];
      if (typeof methodAsync !== "function") {
        throw new SoapError("SOAP.METHOD_UNKNOWN", {
          message: `Method "${method}" not found on SOAP client`,
          context: { method }
        });
      }
      const invoke = methodAsync;
      try {
        const result = await withTimeout(invoke.call(client, args), timeoutMs, method);
        return result[0];
      } catch (err) {
        if (err instanceof SoapError) throw err;
        const fault = err.root?.Envelope?.Body?.Fault;
        if (fault) {
          throw new SoapError("SOAP.FAULT", {
            message: "SOAP fault returned by server",
            cause: err,
            context: { method, fault }
          });
        }
        throw new SoapError("SOAP.NETWORK", {
          message: err.message ?? "SOAP transport error",
          cause: err,
          context: { method }
        });
      }
    }
  };
}

// src/core/wsaa/client.ts
async function defaultLoginCmsFn(endpoint, cmsBase64) {
  const soapClient = await createSoapClient({
    wsdl: { url: `${endpoint}?wsdl` },
    endpoint
  });
  const result = await soapClient.call("loginCms", {
    in0: cmsBase64
  });
  return result.loginCmsReturn ?? "";
}
var WsaaClient = class {
  cuit;
  cert;
  key;
  endpoint;
  storage;
  clock;
  ttlSeconds;
  logger;
  loginCmsFn;
  constructor(opts) {
    this.cuit = opts.cuit;
    this.cert = opts.cert;
    this.key = opts.key;
    this.endpoint = ENDPOINTS[opts.environment].wsaa;
    this.storage = opts.storage ?? new MemoryTicketStorage();
    this.clock = opts.clock ?? createNtpClock({ logger: opts.logger });
    this.ttlSeconds = opts.ttlSeconds ?? 600;
    this.logger = opts.logger ?? noopLogger;
    this.loginCmsFn = opts.loginCmsFn ?? defaultLoginCmsFn;
  }
  async getTicket(service) {
    const cached = await this.storage.get(service, this.cuit);
    if (cached) {
      this.logger.debug("WSAA ticket cache hit", { service, cuit: this.cuit });
      return cached;
    }
    const now = await this.clock.now();
    const tra = buildTra({ service, now, ttlSeconds: this.ttlSeconds });
    const cms = signCms({ content: tra, cert: this.cert, key: this.key });
    let loginResponse;
    try {
      loginResponse = await this.loginCmsFn(this.endpoint, cms.base64);
    } catch (err) {
      throw this.mapSoapErrorToWsaa(err);
    }
    if (!loginResponse) {
      throw new WsaaError("WSAA.EMPTY_RESPONSE", {
        message: "WSAA returned empty loginCmsReturn",
        context: { service, cuit: this.cuit }
      });
    }
    const ticket = this.parseLoginCmsResponse(service, loginResponse);
    await this.storage.set(ticket);
    this.logger.info("WSAA ticket issued", {
      service,
      cuit: this.cuit,
      expiresAt: ticket.expirationTime.toISOString()
    });
    return ticket;
  }
  parseLoginCmsResponse(service, xml) {
    const parser = new import_fast_xml_parser.XMLParser({ ignoreAttributes: true });
    let parsed;
    try {
      parsed = parser.parse(xml);
    } catch (err) {
      throw new WsaaError("WSAA.PARSE_FAILED", {
        message: "Failed to parse WSAA response XML",
        cause: err,
        context: { service, cuit: this.cuit }
      });
    }
    const resp = parsed.loginTicketResponse;
    const token = resp?.credentials?.token;
    const sign = resp?.credentials?.sign;
    const generationTimeStr = resp?.header?.generationTime;
    const expirationTimeStr = resp?.header?.expirationTime;
    if (!token || !sign || !generationTimeStr || !expirationTimeStr) {
      throw new WsaaError("WSAA.INCOMPLETE_RESPONSE", {
        message: "WSAA response missing required fields",
        context: { service, cuit: this.cuit }
      });
    }
    return {
      service,
      cuit: this.cuit,
      token,
      sign,
      generationTime: new Date(generationTimeStr),
      expirationTime: new Date(expirationTimeStr),
      raw: xml
    };
  }
  mapSoapErrorToWsaa(err) {
    if (err instanceof SoapError) {
      if (err.code === "SOAP.FAULT") {
        const fault = err.context?.["fault"];
        if (fault?.faultstring) return this.mapFaultString(fault.faultstring, err);
      }
      return err;
    }
    const e = err;
    const faultString = e?.root?.Envelope?.Body?.Fault?.faultstring;
    if (faultString) return this.mapFaultString(faultString, err);
    return new SoapError("SOAP.NETWORK", {
      message: e?.message ?? "SOAP transport error",
      cause: err
    });
  }
  mapFaultString(faultstring, cause) {
    if (/vigente|has not expired/i.test(faultstring)) {
      return new WsaaError("WSAA.TICKET_STILL_VALID", { message: faultstring, cause });
    }
    if (/expir/i.test(faultstring)) {
      return new WsaaError("WSAA.TRA_EXPIRED", { message: faultstring, cause });
    }
    return new WsaaError("WSAA.FAULT", { message: faultstring, cause });
  }
};

// src/core/soap/auth-proxy.ts
function defaultShouldAuthenticate(method) {
  if (/Dummy$/i.test(method)) return false;
  return true;
}
function withAuth(opts) {
  const authParamName = opts.authParamName ?? "Auth";
  const shouldAuthenticate = opts.shouldAuthenticate ?? defaultShouldAuthenticate;
  return {
    async call(method, args) {
      if (!shouldAuthenticate(method)) {
        return opts.soap.call(method, args);
      }
      const ticket = await opts.wsaa.getTicket(opts.service);
      const authed = {
        ...args ?? {},
        [authParamName]: {
          Token: ticket.token,
          Sign: ticket.sign,
          Cuit: ticket.cuit
        }
      };
      return opts.soap.call(method, authed);
    }
  };
}

// src/services/electronic-billing/operations/dummy.ts
async function dummy(client) {
  const res = await client.call("FEDummy", {});
  return res.FEDummyResult ?? { AppServer: "NO", DbServer: "NO", AuthServer: "NO" };
}

// src/core/errors/wsn.ts
var WsnError = class extends ArcaError {
};
var WsfeError = class extends WsnError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};
var WsfexError = class extends WsnError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};
var WsPadronError = class extends WsnError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};
var WsMtxcaError = class extends WsnError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};
var WsCdcError = class extends WsnError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};

// src/core/utils.ts
function asArray(val) {
  if (val === void 0 || val === null) return [];
  return Array.isArray(val) ? val : [val];
}

// src/services/electronic-billing/_helpers.ts
function throwWsfeIfErrors(errors, context) {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  throw new WsfeError(`WSFE.${first.Code}`, {
    message: first.Msg,
    context: { ...context, code: first.Code, errors }
  });
}

// src/services/electronic-billing/operations/ultimo-autorizado.ts
async function ultimoAutorizado(client, input) {
  const res = await client.call("FECompUltimoAutorizado", {
    PtoVta: input.PtoVta,
    CbteTipo: input.CbteTipo
  });
  const wrap = res.FECompUltimoAutorizadoResult;
  if (!wrap) {
    throwWsfeIfErrors([{ Code: 0, Msg: "FECompUltimoAutorizado: empty response" }], { ...input });
    throw new Error("unreachable");
  }
  throwWsfeIfErrors(asArray(wrap.Errors?.Err), { ...input });
  return {
    PtoVta: wrap.PtoVta,
    CbteTipo: wrap.CbteTipo,
    CbteNro: wrap.CbteNro,
    Events: asArray(wrap.Events?.Evt)
  };
}

// src/services/electronic-billing/operations/fecae-solicitar.ts
var DuplicateInvoiceError = class extends WsfeError {
  existingCae;
  cbteNro;
  constructor(opts = {}) {
    super("WSFE.DUPLICATE_INVOICE", {
      message: opts.message ?? "Comprobante ya autorizado",
      cause: opts.cause,
      context: {
        ...opts.context,
        ...opts.existingCae ? { existingCae: opts.existingCae } : {},
        ...opts.cbteNro !== void 0 ? { cbteNro: opts.cbteNro } : {}
      }
    });
    this.existingCae = opts.existingCae;
    this.cbteNro = opts.cbteNro;
  }
};
function normalizeDetResp(raw) {
  const obs = asArray(raw.Observaciones?.Obs);
  const err = asArray(raw.Errores?.Err);
  const base = {
    Concepto: raw.Concepto,
    DocTipo: raw.DocTipo,
    DocNro: raw.DocNro,
    CbteDesde: raw.CbteDesde,
    CbteHasta: raw.CbteHasta,
    CbteFch: raw.CbteFch,
    Resultado: raw.Resultado,
    Observaciones: obs,
    Errores: err
  };
  if (raw.CAE !== void 0) base.CAE = raw.CAE;
  if (raw.CAEFchVto !== void 0) base.CAEFchVto = raw.CAEFchVto;
  return base;
}
async function solicitarCae(client, input) {
  if (input.FeCabReq.CantReg !== input.FeDetReq.length) {
    throw new WsfeError("WSFE.CANT_REG_MISMATCH", {
      message: `FeCabReq.CantReg (${input.FeCabReq.CantReg}) does not match FeDetReq length (${input.FeDetReq.length})`,
      context: {
        CantReg: input.FeCabReq.CantReg,
        detLength: input.FeDetReq.length
      }
    });
  }
  const raw = await client.call("FECAESolicitar", {
    FeCAEReq: {
      FeCabReq: input.FeCabReq,
      FeDetReq: { FECAEDetRequest: input.FeDetReq }
    }
  });
  const wrap = raw.FECAESolicitarResult;
  if (!wrap) {
    throw new WsfeError("WSFE.EMPTY_RESPONSE", {
      message: "FECAESolicitar returned empty response"
    });
  }
  throwWsfeIfErrors(asArray(wrap.Errors?.Err));
  const FeCabResp = wrap.FeCabResp;
  if (!FeCabResp) {
    throw new WsfeError("WSFE.MISSING_CAB_RESP", {
      message: "FECAESolicitar missing FeCabResp"
    });
  }
  const FeDetResp = asArray(wrap.FeDetResp?.FECAEDetResponse).map(normalizeDetResp);
  for (const det of FeDetResp) {
    const errs = det.Errores ?? [];
    if (errs.length === 0) continue;
    const first = errs[0];
    if (!first) continue;
    if (first.Code === 10016) {
      throw new DuplicateInvoiceError({
        message: first.Msg,
        ...det.CAE !== void 0 ? { existingCae: det.CAE } : {},
        cbteNro: det.CbteDesde,
        context: { errores: errs }
      });
    }
    throw new WsfeError(`WSFE.${first.Code}`, {
      message: first.Msg,
      context: { detail: det, errores: errs }
    });
  }
  return {
    FeCabResp,
    FeDetResp,
    Events: asArray(wrap.Events?.Evt),
    raw
  };
}

// src/services/electronic-billing/operations/params.ts
async function callList(client, method, itemKey) {
  const res = await client.call(method, {});
  const wrap = res[`${method}Result`];
  if (!wrap) return [];
  throwWsfeIfErrors(asArray(wrap.Errors?.Err));
  const raw = wrap.ResultGet?.[itemKey];
  return asArray(raw);
}
async function getTiposCbte(client) {
  return callList(client, "FEParamGetTiposCbte", "CbteTipo");
}
async function getTiposConcepto(client) {
  return callList(client, "FEParamGetTiposConcepto", "ConceptoTipo");
}
async function getTiposDoc(client) {
  return callList(client, "FEParamGetTiposDoc", "DocTipo");
}
async function getTiposIva(client) {
  return callList(client, "FEParamGetTiposIva", "IvaTipo");
}
async function getTiposMonedas(client) {
  return callList(client, "FEParamGetTiposMonedas", "Moneda");
}
async function getTiposOpcional(client) {
  return callList(client, "FEParamGetTiposOpcional", "OpcionalTipo");
}
async function getTiposTributos(client) {
  return callList(client, "FEParamGetTiposTributos", "TributoTipo");
}
async function getPtosVenta(client) {
  return callList(client, "FEParamGetPtosVenta", "PtoVenta");
}
async function getCotizacion(client, monId) {
  const res = await client.call("FEParamGetCotizacion", { MonId: monId });
  const wrap = res.FEParamGetCotizacionResult;
  if (!wrap) {
    throwWsfeIfErrors([{ Code: 0, Msg: "FEParamGetCotizacion: empty response" }], { monId });
    throw new Error("unreachable");
  }
  throwWsfeIfErrors(asArray(wrap.Errors?.Err), { monId });
  if (!wrap.ResultGet) {
    throw new Error(`FEParamGetCotizacion: missing ResultGet for MonId=${monId}`);
  }
  return wrap.ResultGet;
}

// src/services/register/_helpers.ts
function throwPadronIfErrors(errors, context) {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  const code = `PADRON.${first.code ?? "UNKNOWN"}`;
  throw new WsPadronError(code, {
    message: first.mensaje ?? first.descripcion ?? String(code),
    context: { ...context, errors }
  });
}
function normalizePersona(raw) {
  const tipoPersona = raw.tipoPersona === "JURIDICA" ? "JURIDICA" : "FISICA";
  const categorias = asArray(raw.categoriaMonotributo ?? raw.categoria);
  const result = {
    idPersona: raw.idPersona ?? 0,
    tipoPersona,
    tipoClave: raw.tipoClave ?? "",
    estadoClave: raw.estadoClave ?? "",
    domicilio: asArray(raw.domicilio),
    actividad: asArray(raw.actividad),
    impuesto: asArray(raw.impuesto),
    categoriasMonotributo: categorias
  };
  if (raw.nombre !== void 0) result.nombre = raw.nombre;
  if (raw.apellido !== void 0) result.apellido = raw.apellido;
  if (raw.razonSocial !== void 0) result.razonSocial = raw.razonSocial;
  if (raw.fechaInscripcion !== void 0) result.fechaInscripcion = raw.fechaInscripcion;
  if (raw.fechaNacimiento !== void 0) result.fechaNacimiento = raw.fechaNacimiento;
  if (raw.fechaFallecimiento !== void 0) result.fechaFallecimiento = raw.fechaFallecimiento;
  if (raw.tipoDocumento !== void 0) result.tipoDocumento = raw.tipoDocumento;
  if (raw.numeroDocumento !== void 0) result.numeroDocumento = raw.numeroDocumento;
  return result;
}
function toCuitNumber(cuit) {
  if (typeof cuit === "number") return cuit;
  const cleaned = cuit.replace(/[-\s]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) {
    throw new WsPadronError("PADRON.INVALID_CUIT", {
      message: `Invalid CUIT: ${cuit}`,
      context: { cuit }
    });
  }
  return n;
}

// src/services/register/operations/a4.ts
async function getPersonaA4(soap2, wsaa, cuit) {
  const ticket = await wsaa.getTicket("ws_sr_padron_a4");
  const idPersona = toCuitNumber(cuit);
  const res = await soap2.call("getPersona", {
    token: ticket.token,
    sign: ticket.sign,
    cuitRepresentada: toCuitNumber(ticket.cuit),
    idPersona
  });
  const wrap = res.personaReturn;
  if (!wrap) {
    throw new WsPadronError("PADRON.EMPTY_RESPONSE", {
      message: "Padron A4 returned empty response",
      context: { cuit: idPersona }
    });
  }
  throwPadronIfErrors(asArray(wrap.errores?.error), { cuit: idPersona });
  if (!wrap.persona) {
    throw new WsPadronError("PADRON.NO_PERSONA", {
      message: `No persona returned for CUIT ${idPersona}`,
      context: { cuit: idPersona }
    });
  }
  return normalizePersona(wrap.persona);
}

// src/services/register/operations/a10.ts
async function getPersonaA10(soap2, wsaa, cuit) {
  const ticket = await wsaa.getTicket("ws_sr_padron_a10");
  const idPersona = toCuitNumber(cuit);
  const res = await soap2.call("getPersona", {
    token: ticket.token,
    sign: ticket.sign,
    cuitRepresentada: toCuitNumber(ticket.cuit),
    idPersona
  });
  const wrap = res.personaReturn;
  if (!wrap) {
    throw new WsPadronError("PADRON.EMPTY_RESPONSE", {
      message: "Padron A10 returned empty response",
      context: { cuit: idPersona }
    });
  }
  throwPadronIfErrors(asArray(wrap.errores?.error), { cuit: idPersona });
  if (!wrap.persona) {
    throw new WsPadronError("PADRON.NO_PERSONA", {
      message: `No persona returned for CUIT ${idPersona}`,
      context: { cuit: idPersona }
    });
  }
  return normalizePersona(wrap.persona);
}

// src/services/register/operations/a13.ts
async function getPersonaA13(soap2, wsaa, cuit) {
  const ticket = await wsaa.getTicket("ws_sr_padron_a13");
  const idPersona = toCuitNumber(cuit);
  const res = await soap2.call("getPersona", {
    token: ticket.token,
    sign: ticket.sign,
    cuitRepresentada: toCuitNumber(ticket.cuit),
    idPersona
  });
  const wrap = res.personaReturn;
  if (!wrap) {
    throw new WsPadronError("PADRON.EMPTY_RESPONSE", {
      message: "Padron A13 returned empty response",
      context: { cuit: idPersona }
    });
  }
  throwPadronIfErrors(asArray(wrap.errores?.error), { cuit: idPersona });
  if (!wrap.persona) {
    throw new WsPadronError("PADRON.NO_PERSONA", {
      message: `No persona returned for CUIT ${idPersona}`,
      context: { cuit: idPersona }
    });
  }
  return normalizePersona(wrap.persona);
}

// src/services/export-billing/operations/dummy.ts
async function fexDummy(client) {
  const res = await client.call("FEXDummy", {});
  return res.FEXDummyResult ?? {
    AppServer: "NO",
    DbServer: "NO",
    AuthServer: "NO"
  };
}

// src/services/export-billing/_helpers.ts
function throwWsfexIfError(err, context) {
  const list = asArray(err);
  if (list.length === 0) return;
  const first = list[0];
  if (!first || !first.ErrCode || Number(first.ErrCode) === 0) return;
  const code = `WSFEX.${first.ErrCode}`;
  throw new WsfexError(code, {
    message: first.ErrMsg,
    context: { ...context, errors: list }
  });
}

// src/services/export-billing/operations/authorize.ts
async function fexAuthorize(client, input) {
  const raw = await client.call("FEXAuthorize", {
    Id: input.Id,
    Cmp: input.Cmp
  });
  const wrap = raw.FEXAuthorizeResult;
  if (!wrap) {
    throwWsfexIfError(
      [{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXAuthorize returned empty response" }],
      { id: input.Id }
    );
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { id: input.Id });
  if (!wrap.FEXResultAuth) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXAuthorize missing FEXResultAuth" }],
      { id: input.Id }
    );
    throw new Error("unreachable");
  }
  return {
    FEXResultAuth: wrap.FEXResultAuth,
    FEXEvents: asArray(wrap.FEXEvents),
    raw
  };
}

// src/services/export-billing/operations/last-cmp.ts
async function fexLastCmp(client, input) {
  const raw = await client.call("FEXGetLast_CMP", input);
  const wrap = raw.FEXGetLast_CMPResult;
  if (!wrap) {
    throwWsfexIfError(
      [{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetLast_CMP empty response" }],
      { ...input }
    );
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { ...input });
  const r = wrap.FEXResult_LastCMP;
  if (!r) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetLast_CMP missing FEXResult_LastCMP" }],
      { ...input }
    );
    throw new Error("unreachable");
  }
  return { Cbte_tipo: r.Cbte_tipo, Punto_vta: r.Punto_vta, Cbte_nro: r.Cbte_nro };
}

// src/services/export-billing/operations/last-id.ts
async function fexLastId(client) {
  const raw = await client.call("FEXGetLast_ID", {});
  const wrap = raw.FEXGetLast_IDResult;
  if (!wrap) {
    throwWsfexIfError([{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetLast_ID empty" }]);
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr);
  const r = wrap.FEXResultGet;
  if (!r) {
    throwWsfexIfError([{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetLast_ID missing id" }]);
    throw new Error("unreachable");
  }
  return { Id: r.Id };
}

// src/services/export-billing/operations/cotizacion.ts
async function fexCotizacion(client, monId) {
  const raw = await client.call("FEXGetCotizacion", { Mon_id: monId });
  const wrap = raw.FEXGetCotizacionResult;
  if (!wrap) {
    throwWsfexIfError([{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetCotizacion empty" }], {
      monId
    });
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { monId });
  const r = wrap.FEXResGetCotizacion;
  if (!r) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetCotizacion missing cotizacion" }],
      { monId }
    );
    throw new Error("unreachable");
  }
  return r;
}

// src/services/detailed-billing/operations/dummy.ts
async function mtxcaDummy(client) {
  const res = await client.call("dummy", {});
  return res.return ?? { appserver: "NO", dbserver: "NO", authserver: "NO" };
}

// src/services/detailed-billing/_helpers.ts
function throwMtxcaIfErrors(errors, context) {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  const rawCode = first.codigoDescripcion?.codigo ?? first.codigo ?? "UNKNOWN";
  const msg = first.codigoDescripcion?.descripcion ?? first.descripcion ?? String(rawCode);
  throw new WsMtxcaError(`MTXCA.${rawCode}`, {
    message: msg,
    context: { ...context, errors }
  });
}

// src/services/detailed-billing/operations/autorizar.ts
async function mtxcaAutorizar(client, comprobante) {
  const raw = await client.call("autorizarComprobante", {
    comprobanteCAERequest: comprobante
  });
  throwMtxcaIfErrors(asArray(raw.arrayErrores?.error), {
    comprobante: comprobante.numeroComprobante
  });
  if (!raw.comprobanteResponse) {
    throw new WsMtxcaError("MTXCA.EMPTY_RESPONSE", {
      message: "autorizarComprobante missing comprobanteResponse"
    });
  }
  return {
    comprobanteResponse: raw.comprobanteResponse,
    eventos: asArray(raw.arrayEventos?.evento),
    raw
  };
}

// src/services/detailed-billing/operations/ultimo-autorizado.ts
async function mtxcaUltimoAutorizado(client, input) {
  const raw = await client.call("consultarUltimoComprobanteAutorizado", {
    consultaUltimoComprobanteAutorizadoRequest: input
  });
  throwMtxcaIfErrors(asArray(raw.arrayErrores?.error), { ...input });
  const r = raw.consultaUltimoComprobanteAutorizadoReturn;
  if (!r) {
    throw new WsMtxcaError("MTXCA.EMPTY_RESPONSE", {
      message: "consultarUltimoComprobanteAutorizado missing result",
      context: { ...input }
    });
  }
  return r;
}

// src/services/verification/operations/dummy.ts
async function cdcDummy(client) {
  const res = await client.call("ComprobanteDummy", {});
  return res.ComprobanteDummyResult ?? { AppServer: "NO", DbServer: "NO", AuthServer: "NO" };
}

// src/services/verification/_helpers.ts
function throwCdcIfErrors(errors, context) {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  throw new WsCdcError(`CDC.${first.Code}`, {
    message: first.Msg,
    context: { ...context, errors }
  });
}

// src/services/verification/operations/constatar.ts
async function constatar(client, req) {
  const raw = await client.call("ComprobanteConstatar", { CmpReq: req });
  const wrap = raw.ComprobanteConstatarResult;
  if (!wrap) {
    throw new WsCdcError("CDC.EMPTY_RESPONSE", {
      message: "ComprobanteConstatar returned empty response"
    });
  }
  throwCdcIfErrors(asArray(wrap.Errors?.Err));
  if (!wrap.Resultado) {
    throw new WsCdcError("CDC.NO_RESULT", {
      message: "ComprobanteConstatar missing Resultado"
    });
  }
  const result = {
    Resultado: wrap.Resultado,
    Events: asArray(wrap.Events?.Evt),
    Observaciones: asArray(wrap.Observaciones?.Obs)
  };
  if (wrap.Cuit !== void 0) result.Cuit = wrap.Cuit;
  if (wrap.Cuit_cdc !== void 0) result.Cuit_cdc = wrap.Cuit_cdc;
  if (wrap.FchProceso !== void 0) result.FchProceso = wrap.FchProceso;
  return result;
}

// src/services/electronic-billing/types/ids.ts
var CbteTipo = {
  FacturaA: 1,
  NotaDebitoA: 2,
  NotaCreditoA: 3,
  ReciboA: 4,
  FacturaB: 6,
  NotaDebitoB: 7,
  NotaCreditoB: 8,
  ReciboB: 9,
  FacturaC: 11,
  NotaDebitoC: 12,
  NotaCreditoC: 13,
  ReciboC: 15,
  FacturaMiPymeA: 201,
  NotaDebitoMiPymeA: 202,
  NotaCreditoMiPymeA: 203,
  FacturaMiPymeB: 206,
  NotaDebitoMiPymeB: 207,
  NotaCreditoMiPymeB: 208,
  FacturaMiPymeC: 211,
  NotaDebitoMiPymeC: 212,
  NotaCreditoMiPymeC: 213
};
var Concepto = {
  Productos: 1,
  Servicios: 2,
  ProductosYServicios: 3
};
var DocTipo = {
  CUIT: 80,
  CUIL: 86,
  CDI: 87,
  DNI: 96,
  ConsumidorFinal: 99,
  Pasaporte: 94
};
var IvaId = {
  NoGravado: 1,
  Exento: 2,
  Cero: 3,
  IVA10_5: 4,
  IVA21: 5,
  IVA27: 6,
  IVA5: 8,
  IVA2_5: 9
};
var TributoId = {
  ImpuestosNacionales: 1,
  ImpuestosProvinciales: 2,
  ImpuestosMunicipales: 3,
  ImpuestosInternos: 4,
  Otro: 99
};

// src/core/storage/fs-storage.ts
var import_node_fs2 = require("fs");
var path2 = __toESM(require("path"), 1);
var FsTicketStorage = class {
  dir;
  fileMode;
  logger;
  constructor(opts) {
    this.dir = opts.dir;
    this.fileMode = opts.fileMode ?? 384;
    this.logger = opts.logger ?? noopLogger;
  }
  filePath(service, cuit) {
    return path2.join(this.dir, `${service}.${cuit}.json`);
  }
  serialize(t) {
    return {
      service: t.service,
      cuit: t.cuit,
      token: t.token,
      sign: t.sign,
      generationTime: t.generationTime.toISOString(),
      expirationTime: t.expirationTime.toISOString(),
      raw: t.raw
    };
  }
  deserialize(s) {
    return {
      service: s.service,
      cuit: s.cuit,
      token: s.token,
      sign: s.sign,
      generationTime: new Date(s.generationTime),
      expirationTime: new Date(s.expirationTime),
      raw: s.raw
    };
  }
  async get(service, cuit) {
    const p = this.filePath(service, cuit);
    let content;
    try {
      content = await import_node_fs2.promises.readFile(p, "utf8");
    } catch (err) {
      if (err.code === "ENOENT") return null;
      throw err;
    }
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      this.logger.warn("ticket file corrupt, ignoring", { path: p, error: String(err) });
      return null;
    }
    const ticket = this.deserialize(parsed);
    if (isExpired(ticket)) {
      await import_node_fs2.promises.unlink(p).catch(() => {
      });
      return null;
    }
    return ticket;
  }
  async set(ticket) {
    await import_node_fs2.promises.mkdir(this.dir, { recursive: true });
    const p = this.filePath(ticket.service, ticket.cuit);
    const content = JSON.stringify(this.serialize(ticket), null, 2);
    await import_node_fs2.promises.writeFile(p, content, { mode: this.fileMode });
  }
  async delete(service, cuit) {
    const p = this.filePath(service, cuit);
    try {
      await import_node_fs2.promises.unlink(p);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }
};

// src/core/errors/config.ts
var ConfigError = class extends ArcaError {
  code;
  constructor(code, opts = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context
    });
    this.code = code;
  }
};

// src/core/errors/time.ts
var TimeSkewError = class extends ArcaError {
  code = "TIME.SKEW";
  constructor(opts = {}) {
    super({
      message: opts.message ?? "TIME.SKEW",
      cause: opts.cause,
      context: opts.context
    });
  }
};

// src/core/errors/retry.ts
var RETRYABLE_CODES = /* @__PURE__ */ new Set([
  "SOAP.TIMEOUT",
  "SOAP.NETWORK",
  "TIME.SKEW"
]);
function isRetryable(err) {
  if (!(err instanceof ArcaError)) return false;
  return RETRYABLE_CODES.has(err.code);
}

// src/index.ts
var SDK_VERSION = "0.6.0";
async function fetchWsdls(environment) {
  const eps = ENDPOINTS[environment];
  const keys = [
    "wsfev1",
    "wsfexv1",
    "wsmtxca",
    "wscdc",
    "padronA4",
    "padronA10",
    "padronA13"
  ];
  const entries = await Promise.all(
    keys.map(async (key) => {
      const url = `${eps[key]}?wsdl`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch WSDL for ${key}: HTTP ${response.status}`);
      }
      return [key, await response.text()];
    })
  );
  return Object.fromEntries(entries);
}
var Arca = class {
  electronicBilling;
  register;
  exportBilling;
  detailedBilling;
  verification;
  constructor(opts) {
    const wsaa = new WsaaClient({
      cuit: opts.cuit,
      cert: opts.cert,
      key: opts.key,
      environment: opts.environment,
      ...opts.storage ? { storage: opts.storage } : {},
      ...opts.clock ? { clock: opts.clock } : {},
      ...opts.logger ? { logger: opts.logger } : {}
    });
    const endpoints = ENDPOINTS[opts.environment];
    const rawClients = /* @__PURE__ */ new Map();
    const getRaw = (serviceKey) => {
      let p = rawClients.get(serviceKey);
      if (p) return p;
      const endpoint = endpoints[serviceKey];
      const inlineWsdl = opts.wsdls?.[serviceKey];
      p = createSoapClient({
        wsdl: inlineWsdl ?? { url: `${endpoint}?wsdl` },
        endpoint
      });
      rawClients.set(serviceKey, p);
      return p;
    };
    let wsfeAuthed = null;
    const getAuthed = async () => {
      if (wsfeAuthed) return wsfeAuthed;
      const raw = await getRaw("wsfev1");
      wsfeAuthed = withAuth({ soap: raw, wsaa, service: "wsfe" });
      return wsfeAuthed;
    };
    this.electronicBilling = {
      dummy: async () => dummy(await getAuthed()),
      createInvoice: async (input) => solicitarCae(await getAuthed(), input),
      lastAuthorized: async (input) => ultimoAutorizado(await getAuthed(), input),
      params: {
        tiposCbte: async () => getTiposCbte(await getAuthed()),
        tiposConcepto: async () => getTiposConcepto(await getAuthed()),
        tiposDoc: async () => getTiposDoc(await getAuthed()),
        tiposIva: async () => getTiposIva(await getAuthed()),
        tiposMonedas: async () => getTiposMonedas(await getAuthed()),
        tiposOpcional: async () => getTiposOpcional(await getAuthed()),
        tiposTributos: async () => getTiposTributos(await getAuthed()),
        ptosVenta: async () => getPtosVenta(await getAuthed()),
        cotizacion: async (monId) => getCotizacion(await getAuthed(), monId)
      }
    };
    this.register = {
      personaA4: async (cuit) => getPersonaA4(await getRaw("padronA4"), wsaa, cuit),
      personaA10: async (cuit) => getPersonaA10(await getRaw("padronA10"), wsaa, cuit),
      personaA13: async (cuit) => getPersonaA13(await getRaw("padronA13"), wsaa, cuit)
    };
    let fexAuthed = null;
    const getFexAuthed = async () => {
      if (fexAuthed) return fexAuthed;
      const raw = await getRaw("wsfexv1");
      fexAuthed = withAuth({ soap: raw, wsaa, service: "wsfex" });
      return fexAuthed;
    };
    this.exportBilling = {
      dummy: async () => fexDummy(await getFexAuthed()),
      createInvoice: async (input) => fexAuthorize(await getFexAuthed(), input),
      lastAuthorized: async (input) => fexLastCmp(await getFexAuthed(), input),
      lastId: async () => fexLastId(await getFexAuthed()),
      cotizacion: async (monId) => fexCotizacion(await getFexAuthed(), monId)
    };
    let mtxcaAuthed = null;
    const getMtxcaAuthed = async () => {
      if (mtxcaAuthed) return mtxcaAuthed;
      const raw = await getRaw("wsmtxca");
      mtxcaAuthed = withAuth({ soap: raw, wsaa, service: "wsmtxca" });
      return mtxcaAuthed;
    };
    this.detailedBilling = {
      dummy: async () => mtxcaDummy(await getMtxcaAuthed()),
      createInvoice: async (input) => mtxcaAutorizar(await getMtxcaAuthed(), input),
      lastAuthorized: async (input) => mtxcaUltimoAutorizado(await getMtxcaAuthed(), input)
    };
    let cdcAuthed = null;
    const getCdcAuthed = async () => {
      if (cdcAuthed) return cdcAuthed;
      const raw = await getRaw("wscdc");
      cdcAuthed = withAuth({ soap: raw, wsaa, service: "wscdc" });
      return cdcAuthed;
    };
    this.verification = {
      dummy: async () => cdcDummy(await getCdcAuthed()),
      constatar: async (req) => constatar(await getCdcAuthed(), req)
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Arca,
  ArcaError,
  CbteTipo,
  Concepto,
  ConfigError,
  CryptoError,
  DocTipo,
  DuplicateInvoiceError,
  ENDPOINTS,
  FsTicketStorage,
  IvaId,
  MemoryTicketStorage,
  SDK_VERSION,
  SoapError,
  TimeSkewError,
  TributoId,
  WsCdcError,
  WsMtxcaError,
  WsPadronError,
  WsaaError,
  WsfeError,
  WsfexError,
  WsnError,
  consoleLogger,
  createNtpClock,
  createSystemClock,
  fetchWsdls,
  isAboutToExpire,
  isExpired,
  isRetryable,
  noopLogger
});
//# sourceMappingURL=index.cjs.map