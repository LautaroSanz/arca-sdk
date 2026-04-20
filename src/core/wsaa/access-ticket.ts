export interface AccessTicket {
  service: string;
  cuit: string;
  token: string;
  sign: string;
  generationTime: Date;
  expirationTime: Date;
  raw: string;
}

export function isExpired(ticket: AccessTicket, now: Date = new Date()): boolean {
  return now.getTime() > ticket.expirationTime.getTime();
}

export function isAboutToExpire(
  ticket: AccessTicket,
  marginSeconds: number,
  now: Date = new Date(),
): boolean {
  const diffMs = ticket.expirationTime.getTime() - now.getTime();
  return diffMs <= marginSeconds * 1000;
}
