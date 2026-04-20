import { promises as fs } from "node:fs";
import * as path from "node:path";
import { type AccessTicket, isExpired } from "../wsaa/access-ticket";
import type { TicketStorage } from "./ticket-storage";
import { type Logger, noopLogger } from "../logging/logger";

export interface FsStorageOptions {
  dir: string;
  fileMode?: number;
  logger?: Logger;
}

interface SerializedTicket {
  service: string;
  cuit: string;
  token: string;
  sign: string;
  generationTime: string;
  expirationTime: string;
  raw: string;
}

export class FsTicketStorage implements TicketStorage {
  private readonly dir: string;
  private readonly fileMode: number;
  private readonly logger: Logger;

  constructor(opts: FsStorageOptions) {
    this.dir = opts.dir;
    this.fileMode = opts.fileMode ?? 0o600;
    this.logger = opts.logger ?? noopLogger;
  }

  private filePath(service: string, cuit: string): string {
    return path.join(this.dir, `${service}.${cuit}.json`);
  }

  private serialize(t: AccessTicket): SerializedTicket {
    return {
      service: t.service,
      cuit: t.cuit,
      token: t.token,
      sign: t.sign,
      generationTime: t.generationTime.toISOString(),
      expirationTime: t.expirationTime.toISOString(),
      raw: t.raw,
    };
  }

  private deserialize(s: SerializedTicket): AccessTicket {
    return {
      service: s.service,
      cuit: s.cuit,
      token: s.token,
      sign: s.sign,
      generationTime: new Date(s.generationTime),
      expirationTime: new Date(s.expirationTime),
      raw: s.raw,
    };
  }

  async get(service: string, cuit: string): Promise<AccessTicket | null> {
    const p = this.filePath(service, cuit);
    let content: string;
    try {
      content = await fs.readFile(p, "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
    let parsed: SerializedTicket;
    try {
      parsed = JSON.parse(content) as SerializedTicket;
    } catch (err) {
      this.logger.warn("ticket file corrupt, ignoring", { path: p, error: String(err) });
      return null;
    }
    const ticket = this.deserialize(parsed);
    if (isExpired(ticket)) {
      await fs.unlink(p).catch(() => {});
      return null;
    }
    return ticket;
  }

  async set(ticket: AccessTicket): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const p = this.filePath(ticket.service, ticket.cuit);
    const content = JSON.stringify(this.serialize(ticket), null, 2);
    await fs.writeFile(p, content, { mode: this.fileMode });
  }

  async delete(service: string, cuit: string): Promise<void> {
    const p = this.filePath(service, cuit);
    try {
      await fs.unlink(p);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
}
