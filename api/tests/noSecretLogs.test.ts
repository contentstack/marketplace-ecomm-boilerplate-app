import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { install, describeError } from "../utils/safeLog.ts";

const fakeId = (p: string) => `${p}-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
const read = (f: string) => fs.readFileSync(path.join(import.meta.dirname, f), "utf8");

test("noSecretLogs: bearer token, access token and decrypted creds never reach the logs", () => {
  const bearer = fakeId("bt"), clientSecret = fakeId("cs"), accessTok = fakeId("ac"), authToken = fakeId("at");
  const err: any = Object.assign(new Error("Request failed with status code 401"), {
    isAxiosError: true,
    config: { url: "https://shop.example.test/products", headers: { Authorization: `Bearer ${bearer}` } },
    response: { status: 401, statusText: "Unauthorized", data: { error: "denied" } },
  });
  const query = { authToken, authservice_data: JSON.stringify({ access_token: accessTok }) };
  const body = { client_secret: clientSecret, name: "cfg" };

  const lines: string[] = [];
  const log = (...a: unknown[]) => { lines.push(JSON.stringify(a)); };
  const c: any = { error: log, info: log };
  install(c);
  c.error(err); // raw axios error, as the old code logged it
  c.error(describeError(err));
  c.info("query", query);
  c.info("body", body);
  const out = lines.join("\n");

  for (const s of [bearer, clientSecret, accessTok, authToken]) assert.ok(!out.includes(s), "leaked a secret");
  assert.ok(out.includes("401") && out.includes("denied"), "status and message kept");
});

test("noSecretLogs: Lambda entry installs safeLog as its first statement", () => {
  assert.match(read("../index.ts").trimStart(), /^import "\.\/utils\/installSafeLog";/);
  assert.match(read("../utils/installSafeLog.ts"), /install\(\);/);
});

test("noSecretLogs: no raw query/body/error logs remain", () => {
  for (const f of ["../index.ts", "../handler/index.ts", "../root_config/index.ts"]) {
    const src = read(f);
    assert.doesNotMatch(src, /console\.\w+\([^;]*,\s*(e|err|error|query|body)\s*\)/, `${f} logs a raw value`);
    assert.doesNotMatch(src, /console\.\w+\(\s*(e|err|error|query|body)\s*[,)]/, `${f} logs a raw value`);
    assert.doesNotMatch(src, /e\?\.stack/, `${f} logs a stack`);
  }
});
