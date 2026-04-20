import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import type { WsaaClient } from "../../../core/wsaa/client";
import type { AccessTicket } from "../../../core/wsaa/access-ticket";
import { getPersonaA4 } from "./a4";
import { WsPadronError } from "../../../core/errors/wsn";

function fakeTicket(): AccessTicket {
  return {
    service: "ws_sr_padron_a4",
    cuit: "20111111112",
    token: "T",
    sign: "S",
    generationTime: new Date(),
    expirationTime: new Date(Date.now() + 3600_000),
    raw: "<x/>",
  };
}

function makeSoap(response: unknown): { soap: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { soap: { call: call as unknown as SoapClient["call"] }, call };
}

function makeWsaa(ticket: AccessTicket = fakeTicket()): WsaaClient {
  const getTicket = vi.fn(async () => ticket);
  return { getTicket } as unknown as WsaaClient;
}

describe("getPersonaA4", () => {
  it("returns a PersonaReturn on successful lookup", async () => {
    const { soap, call } = makeSoap({
      personaReturn: {
        persona: {
          idPersona: 20111111112,
          tipoPersona: "FISICA",
          tipoClave: "CUIT",
          estadoClave: "ACTIVO",
          nombre: "JUAN",
          apellido: "PEREZ",
          domicilio: {
            codigoPostal: "1425",
            direccion: "AV CORRIENTES 1234",
            localidad: "CABA",
          },
        },
      },
    });
    const wsaa = makeWsaa();
    const persona = await getPersonaA4(soap, wsaa, "30-11111111-1");
    expect(persona.idPersona).toBe(20111111112);
    expect(persona.tipoPersona).toBe("FISICA");
    expect(persona.nombre).toBe("JUAN");
    expect(persona.domicilio).toHaveLength(1);
    expect(call).toHaveBeenCalledWith(
      "getPersona",
      expect.objectContaining({ token: "T", sign: "S", cuitRepresentada: 20111111112 }),
    );
  });

  it("throws WsPadronError on empty response", async () => {
    const { soap } = makeSoap({});
    const wsaa = makeWsaa();
    await expect(getPersonaA4(soap, wsaa, 20111111112)).rejects.toBeInstanceOf(WsPadronError);
  });

  it("throws WsPadronError on errores in response", async () => {
    const { soap } = makeSoap({
      personaReturn: {
        errores: { error: { code: "202", mensaje: "persona no encontrada" } },
      },
    });
    const wsaa = makeWsaa();
    try {
      await getPersonaA4(soap, wsaa, 20000000001);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsPadronError);
      expect((err as WsPadronError).code).toBe("PADRON.202");
    }
  });

  it("normalizes array fields (actividad/impuesto) from single item", async () => {
    const { soap } = makeSoap({
      personaReturn: {
        persona: {
          idPersona: 20111111112,
          tipoPersona: "FISICA",
          tipoClave: "CUIT",
          estadoClave: "ACTIVO",
          actividad: { idActividad: 620100, descripcionActividad: "Servicios de TI" },
          impuesto: { idImpuesto: 30, descripcionImpuesto: "IVA", estado: "ACTIVO" },
        },
      },
    });
    const persona = await getPersonaA4(soap, makeWsaa(), 20111111112);
    expect(persona.actividad).toHaveLength(1);
    expect(persona.impuesto).toHaveLength(1);
  });

  it("throws WsPadronError.INVALID_CUIT on malformed CUIT input", async () => {
    const { soap } = makeSoap({});
    try {
      await getPersonaA4(soap, makeWsaa(), "not-a-cuit");
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsPadronError);
      expect((err as WsPadronError).code).toBe("PADRON.INVALID_CUIT");
    }
  });
});
