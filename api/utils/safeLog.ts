import { format } from "util";

// Redacts secrets from everything the Lambda logs. install() patches console once at cold start.
// "auth" alone is not a secret (author, authority); match whole words or camelCase/snake/kebab parts
const SENSITIVE_WORDS = /(?:^|[^a-z])(?:tokens?|secret|password|passwd|pwd|api[_-]?key|project[_-]?key|authorization|auth[_-]?token|cookie|set-cookie|credentials?|creds|private[_-]?key|service[_-]?account[_-]?details|authservice[_-]?data)(?:$|[^a-z])/;
// split camelCase first so clientSecret -> client_secret; then word-boundary match
const isSensitive = (k: unknown): boolean => SENSITIVE_WORDS.test(String(k).replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase());
const SAFE_KEYS = /^(token_type|tokentype)$/i;
const MASK = "[REDACTED]";
const MAX_DEPTH = 6;
const MAX_ITEMS = 500;

const PEM = /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g;

const scrubString = (s: string): string =>
  s
    .replace(PEM, MASK)
    .replace(/(Bearer|Basic)\s+[A-Za-z0-9._~+\/=-]+/gi, `$1 ${MASK}`)
    .replace(/("?[A-Za-z_-]*(?:token|secret|password|api[_-]?key|project[_-]?key|authorization|authtoken|cookie|private[_-]?key|authservice[_-]?data)[A-Za-z_-]*"?\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s,;&}]+)/gi, `$1"${MASK}"`);

const describeError = (e: any): Record<string, unknown> => {
  const r = e?.response;
  return {
    name: e?.name,
    message: typeof e?.message === "string" ? scrubString(e.message) : undefined,
    code: e?.code,
    status: r?.status,
    statusText: r?.statusText,
    url: typeof e?.config?.url === "string" ? scrubString(e.config.url) : undefined,
    method: e?.config?.method,
    // upstream error bodies are logged redacted, never the request config (carries auth headers)
    data: r?.data === undefined ? undefined : redact(r.data),
  };
};

function redact(v: any, depth = 0, seen = new WeakSet<object>()): any {
  if (typeof v === "string") return scrubString(v);
  if (v === null || typeof v !== "object") return typeof v === "function" ? "[Function]" : v;
  if (v instanceof Error || v?.isAxiosError) return describeError(v);
  if (Buffer.isBuffer(v)) return `[Buffer ${v.length}b]`;
  if (v instanceof Date) return v;
  if (depth >= MAX_DEPTH) return "[Truncated]";
  if (seen.has(v)) return "[Circular]";
  seen.add(v);
  if (v instanceof Set) v = Array.from(v);
  if (Array.isArray(v)) return v.slice(0, MAX_ITEMS).map((x) => redact(x, depth + 1, seen));
  if (v instanceof Map) v = Object.fromEntries(Array.from(v).slice(0, MAX_ITEMS).map(([k, x]: [any, any]) => [String(k), x]));
  const out: Record<string, any> = {};
  for (const k of Object.keys(v).slice(0, MAX_ITEMS)) {
    let val: any;
    try { val = v[k]; } catch { val = "[Unreadable]"; }
    out[k] = isSensitive(k) && !SAFE_KEYS.test(k) ? MASK : redact(val, depth + 1, seen);
  }
  return out;
}

// a logging failure must never break the Lambda
const safeRedact = (a: unknown) => { try { return redact(a); } catch { return "[Unloggable]"; } };

const install = (c: any = console): void => {
  if (c.__safeLog) return;
  for (const m of ["log", "info", "warn", "error", "debug", "trace", "dir", "table"]) {
    if (typeof c[m] !== "function") continue;
    const orig: (...a: any[]) => void = c[m].bind(c);
    c[m] = (...args: any[]) => {
      const safe = args.map(safeRedact);
      // format placeholders (password=%s) are only visible after formatting, so scrub the formatted line
      if (typeof args[0] === "string" && /%[sdifjoOc]/.test(args[0])) {
        try { return orig(scrubString(format(args[0], ...safe.slice(1)))); } catch { /* fall through */ }
      }
      return orig(...safe);
    };
  }
  c.__safeLog = true;
};

export { install, redact, describeError, scrubString };
