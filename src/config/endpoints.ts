export type Environment = "testing" | "production";

export interface ServiceEndpoints {
  wsaa: string;
  wsfev1: string;
  wsfexv1: string;
  wsmtxca: string;
  padronA4: string;
  padronA10: string;
  padronA13: string;
  ntp: string;
}

export const ENDPOINTS = {
  testing: {
    wsaa: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
    wsfev1: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx",
    wsfexv1: "https://wswhomo.afip.gov.ar/wsfexv1/service.asmx",
    wsmtxca: "https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService",
    padronA4: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA4",
    padronA10: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA10",
    padronA13: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA13",
    ntp: "time.afip.gov.ar",
  },
  production: {
    wsaa: "https://wsaa.afip.gov.ar/ws/services/LoginCms",
    wsfev1: "https://servicios1.afip.gov.ar/wsfev1/service.asmx",
    wsfexv1: "https://servicios1.afip.gov.ar/wsfexv1/service.asmx",
    wsmtxca: "https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService",
    padronA4: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA4",
    padronA10: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA10",
    padronA13: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA13",
    ntp: "time.afip.gov.ar",
  },
} as const satisfies Record<Environment, ServiceEndpoints>;
