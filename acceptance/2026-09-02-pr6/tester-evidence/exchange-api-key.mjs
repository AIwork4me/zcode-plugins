// Acceptance-test harness: perform the same BigModel coding-plan API-key
// exchange the official `zcode login` flow performs (getCustomerInfo ->
// find-or-create "zcode-api-key" -> copy -> "<id>.<secretKey>"), then store it
// in ~/.zcode/cli/config.json. Secrets are never printed.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import { homedir } from 'node:os';

const HOST = 'https://bigmodel.cn';
const KEY_NAME = 'zcode-api-key';

const secret = process.env.ZCODE_CREDENTIAL_SECRET?.trim()
  ?? `zcode-credential-fallback:${os.platform()}:${homedir()}:${os.userInfo().username}`;
const key = crypto.createHash('sha256').update(secret).digest();

function decrypt(v) {
  const P = 'enc:v1:';
  if (!v.startsWith(P)) return v;
  const [ivB64, tagB64, ctB64] = v.slice(P.length).split('.');
  const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64url'));
  d.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([d.update(Buffer.from(ctB64, 'base64url')), d.final()]).toString('utf-8');
}

const creds = JSON.parse(fs.readFileSync('C:/Users/rocm/.zcode/v2/credentials.json', 'utf8'));
const token = decrypt(creds['oauth:bigmodel:access_token']);
console.log('token decrypted: OK (not printed)');

async function call(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: token, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}: ${text.slice(0, 300)}`);
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`non-JSON response at ${url}`); }
  const okCodes = [null, undefined, 0, 200, '0', '200'];
  const code = json?.code ?? json?.statusCode;
  if (!okCodes.includes(code)) throw new Error(`API code ${code} at ${url}: ${text.slice(0, 300)}`);
  return json?.data ?? json;
}

const info = await call(`${HOST}/api/biz/customer/getCustomerInfo`);
const orgs = info?.organizations ?? [];
const org = orgs.find((o) => (o.organizationName || '').includes('默认机构')) ?? orgs[0];
const proj = (org?.projects ?? []).find((p) => (p.projectName || '').includes('默认项目')) ?? (org?.projects ?? [])[0];
if (!org?.organizationId || !proj?.projectId) throw new Error('unable to resolve organization/project');
console.log(`org/project resolved: ${org.organizationId}/${proj.projectId} (ids only)`);

const listUrl = `${HOST}/api/biz/v1/organization/${org.organizationId}/projects/${proj.projectId}/api_keys`;
let keys = await call(listUrl);
let entry = (keys ?? []).find((k) => k.name === KEY_NAME);
if (!entry) {
  console.log('no existing zcode-api-key; creating one (same as official login flow)');
  entry = await call(listUrl, { method: 'POST', body: JSON.stringify({ name: KEY_NAME }) });
}
const keyId = entry?.apiKey?.trim();
if (!keyId) throw new Error('api key id missing');
const copied = await call(`${listUrl}/copy/${encodeURIComponent(keyId)}`);
const secretKey = copied?.secretKey?.trim() ?? '';
const finalKey = secretKey ? `${keyId}.${secretKey}` : keyId;
console.log('api key obtained: OK (not printed, form: ' + (secretKey ? 'id.secret' : 'id') + ')');

const cfgPath = 'C:/Users/rocm/.zcode/cli/config.json';
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
cfg.provider.bigmodel.options.apiKey = finalKey;
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
console.log('cli/config.json updated with exchanged api key');
