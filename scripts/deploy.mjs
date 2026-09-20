#!/usr/bin/env node
/**
 * Production deploy for https://1e1b.org
 *
 * Production is the `oneearthonebreath` Worker in the Brainclubeast Cloudflare
 * account (04ac64317dea9158c772ec0c91465660), which also hosts the 1e1b.org
 * zone and the 1e1b.org / www.1e1b.org custom domains. The account is pinned in
 * wrangler.jsonc, so a deploy can never land on another account that happens to
 * use the same Worker name.
 *
 * Token lookup order (first one that can actually reach the account wins):
 *   1. CLOUDFLARE_API_TOKEN in .env.deploy.local   (gitignored, preferred)
 *   2. $CF_BRAINCLUB_TOKEN
 *   3. $CLOUDFLARE_API_TOKEN
 *
 * Usage:
 *   npm run deploy              # build the OpenNext bundle + wrangler deploy
 *   npm run deploy -- --dry-run # validate without deploying
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ACCOUNT_ID = "04ac64317dea9158c772ec0c91465660"; // Brainclubeast — owns the 1e1b.org zone
const ACCOUNT_LABEL = "Brainclubeast@gmail.com's Account";
const ENV_FILE = resolve(ROOT, ".env.deploy.local");
const PROD_URL = "https://1e1b.org/";
const PROD_LOCALE_URL = "https://1e1b.org/zh-Hant";

function readEnvFile(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

async function accountFor(token) {
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    return body?.success === true ? body.result?.name || "(unnamed account)" : null;
  } catch {
    return null;
  }
}

const fileEnv = readEnvFile(ENV_FILE);
const candidates = [
  ["CLOUDFLARE_API_TOKEN from .env.deploy.local", fileEnv.CLOUDFLARE_API_TOKEN],
  ["CF_BRAINCLUB_TOKEN", process.env.CF_BRAINCLUB_TOKEN],
  ["CLOUDFLARE_API_TOKEN", process.env.CLOUDFLARE_API_TOKEN],
].filter(([, value]) => value);

if (candidates.length === 0) {
  console.error(`No Cloudflare API token available for ${ACCOUNT_LABEL} (${ACCOUNT_ID}).

Create ${ENV_FILE} with:

  CLOUDFLARE_API_TOKEN=<token scoped to ${ACCOUNT_ID} with Workers Scripts:Edit>

The file is gitignored (.env.* in .gitignore), so it stays on this machine.`);
  process.exit(1);
}

let token = null;
for (const [source, value] of candidates) {
  const name = await accountFor(value);
  if (name) {
    console.log(`✔ Token ${source} → ${name}`);
    token = value;
    break;
  }
  console.log(`· ${source} cannot access ${ACCOUNT_ID}, trying next`);
}

if (!token) {
  console.error(`\nNone of the available tokens can access ${ACCOUNT_LABEL} (${ACCOUNT_ID}).
Recreate ${ENV_FILE} with a token from that account (Workers Scripts:Edit).`);
  process.exit(1);
}

const passthrough = process.argv.slice(2);
console.log(`\n▸ Deploying to ${PROD_URL} (account ${ACCOUNT_ID})\n`);

/* The hero globe's browser key rides along in .env.deploy.local and is pushed as
   a Worker secret first, so the key never has to be committed and a deploy is
   all it takes to set or rotate it. Without it the hero simply keeps its
   stylised earth, so a failure here is a warning, not a failed deploy. */
const heroKey = fileEnv.MAPTILER_API_KEY || process.env.MAPTILER_API_KEY;
if (heroKey && !passthrough.includes("--dry-run")) {
  const put = spawnSync("npx", ["wrangler", "secret", "put", "MAPTILER_API_KEY"], {
    cwd: ROOT,
    input: `${heroKey}\n`,
    stdio: ["pipe", "inherit", "inherit"],
    env: { ...process.env, CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID },
  });
  console.log(
    put.status === 0
      ? "✔ MAPTILER_API_KEY secret set"
      : "· MAPTILER_API_KEY was not set — the hero keeps its stylised earth"
  );
}

const deploy = spawnSync("npx", ["wrangler", "deploy", ...passthrough], {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID },
});
if (deploy.status !== 0) process.exit(deploy.status ?? 1);

if (passthrough.includes("--dry-run")) {
  console.log("\nDry run complete — nothing was deployed.");
  process.exit(0);
}

let failed = false;
for (const url of [PROD_URL, PROD_LOCALE_URL]) {
  const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
  const html = await res.text();
  const served = res.status === 200 && res.headers.get("x-opennext") === "1" && html.includes("<html");
  console.log(`${served ? "✔" : "✖"} ${url} → HTTP ${res.status}${served ? " (OpenNext Worker)" : " — unexpected response"}`);
  if (!served) failed = true;
}
if (failed) process.exitCode = 1;
