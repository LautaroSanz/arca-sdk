import type { AccessTicket } from "../wsaa/access-ticket";

export interface TicketStorage {
  get(service: string, cuit: string): Promise<AccessTicket | null>;
  set(ticket: AccessTicket): Promise<void>;
  delete(service: string, cuit: string): Promise<void>;
}
