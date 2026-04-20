import type { SoapClient } from "../../../core/soap/client";
import type { WsaaClient } from "../../../core/wsaa/client";
import type { PersonaReturn } from "../types/persona";
import { WsPadronError } from "../../../core/errors/wsn";
import { normalizePersona, toCuitNumber, throwPadronIfErrors, asArray } from "../_helpers";
import type { PadronApiError } from "../_helpers";

interface RawA10Response {
  personaReturn?: {
    persona?: Parameters<typeof normalizePersona>[0];
    errores?: { error?: PadronApiError | PadronApiError[] };
  };
}

export async function getPersonaA10(
  soap: SoapClient,
  wsaa: WsaaClient,
  cuit: number | string,
): Promise<PersonaReturn> {
  const ticket = await wsaa.getTicket("ws_sr_padron_a10");
  const idPersona = toCuitNumber(cuit);
  const res = await soap.call<RawA10Response>("getPersona", {
    token: ticket.token,
    sign: ticket.sign,
    cuitRepresentada: toCuitNumber(ticket.cuit),
    idPersona,
  });
  const wrap = res.personaReturn;
  if (!wrap) {
    throw new WsPadronError("PADRON.EMPTY_RESPONSE", {
      message: "Padron A10 returned empty response",
      context: { cuit: idPersona },
    });
  }
  throwPadronIfErrors(asArray(wrap.errores?.error), { cuit: idPersona });
  if (!wrap.persona) {
    throw new WsPadronError("PADRON.NO_PERSONA", {
      message: `No persona returned for CUIT ${idPersona}`,
      context: { cuit: idPersona },
    });
  }
  return normalizePersona(wrap.persona);
}
