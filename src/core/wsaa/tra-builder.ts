export interface BuildTraInput {
  service: string;
  now?: Date;
  ttlSeconds?: number;
}

function escapeXml(s: string): string {
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

function formatWithOffset(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
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

export function buildTra(input: BuildTraInput): string {
  const now = input.now ?? new Date();
  const ttl = input.ttlSeconds ?? 600;
  const generationTime = new Date(now.getTime() - 60 * 1000);
  const expirationTime = new Date(now.getTime() + ttl * 1000);
  const uniqueId = Math.floor(now.getTime() / 1000);
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
