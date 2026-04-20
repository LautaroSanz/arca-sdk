import { type AccessTicket, isExpired } from "../wsaa/access-ticket";
import type { TicketStorage } from "./ticket-storage";

export class MemoryTicketStorage implements TicketStorage {
  private readonly cache = new Map<string, AccessTicket>();

  private key(service: string, cuit: string): string {
    return `${service}:${cuit}`;
  }

  async get(service: string, cuit: string): Promise<AccessTicket | null> {
    const k = this.key(service, cuit);
    const ticket = this.cache.get(k);
    if (!ticket) return null;
    if (isExpired(ticket)) {
      this.cache.delete(k);
      return null;
    }
    return ticket;
  }

  async set(ticket: AccessTicket): Promise<void> {
    this.cache.set(this.key(ticket.service, ticket.cuit), ticket);
  }

  async delete(service: string, cuit: string): Promise<void> {
    this.cache.delete(this.key(service, cuit));
  }
}
