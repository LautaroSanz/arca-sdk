import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { FsTicketStorage } from "./fs-storage";
import { runTicketStorageContract } from "./contract";
import type { AccessTicket } from "../wsaa/access-ticket";

let currentDir: string | null = null;

runTicketStorageContract("FsTicketStorage", {
  setup: async () => {
    currentDir = await fs.mkdtemp(path.join(os.tmpdir(), "arca-fs-storage-"));
    return new FsTicketStorage({ dir: currentDir });
  },
  teardown: async () => {
    if (currentDir) {
      await fs.rm(currentDir, { recursive: true, force: true });
      currentDir = null;
    }
  },
});

describe("FsTicketStorage specifics", () => {
  it("creates files with 0o600 perms", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arca-fs-perms-"));
    try {
      const storage = new FsTicketStorage({ dir });
      const ticket: AccessTicket = {
        service: "wsfe",
        cuit: "20111111112",
        token: "tok",
        sign: "sig",
        generationTime: new Date("2099-01-01T00:00:00Z"),
        expirationTime: new Date("2099-01-01T12:00:00Z"),
        raw: "<xml/>",
      };
      await storage.set(ticket);
      const stat = await fs.stat(path.join(dir, "wsfe.20111111112.json"));
      expect(stat.mode & 0o777).toBe(0o600);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it("returns null on corrupt file and does not throw", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arca-fs-corrupt-"));
    try {
      const storage = new FsTicketStorage({ dir });
      await fs.writeFile(path.join(dir, "wsfe.20111111112.json"), "{ not valid json");
      const got = await storage.get("wsfe", "20111111112");
      expect(got).toBeNull();
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it("creates directory if missing", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arca-fs-mkdir-"));
    const nested = path.join(dir, "nested", "deep");
    try {
      const storage = new FsTicketStorage({ dir: nested });
      await storage.set({
        service: "wsfe",
        cuit: "20111111112",
        token: "t",
        sign: "s",
        generationTime: new Date("2099-01-01T00:00:00Z"),
        expirationTime: new Date("2099-01-01T12:00:00Z"),
        raw: "<x/>",
      });
      const stat = await fs.stat(nested);
      expect(stat.isDirectory()).toBe(true);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
