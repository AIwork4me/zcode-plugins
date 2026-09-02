// Acceptance-test harness: enable the ZCode CLI engine to run headless sessions
// using the same BigModel coding-plan credentials the desktop app already stores.
// The decrypted token is written ONLY into ~/.zcode/cli/config.json (the file the
// engine itself reads) and never printed.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import { homedir } from 'node:os';

const credPath = 'C:/Users/rocm/.zcode/v2/credentials.json';
const cfgPath = 'C:/Users/rocm/.zcode/cli/config.json';

const env = process.env.ZCODE_CREDENTIAL_SECRET?.trim()
  ? { ZCODE_CREDENTIAL_SECRET: process.env.ZCODE_CREDENTIAL_SECRET.trim() }
  : {};
const secret = env.ZCODE_CREDENTIAL_SECRET
  ?? `zcode-credential-fallback:${os.platform()}:${homedir()}:${os.userInfo().username}`;
const key = crypto.createHash('sha256').update(secret).digest();

const PREFIX = 'enc:v1:';
function decrypt(v) {
  if (!v.startsWith(PREFIX)) return v;
  const [ivB64, tagB64, ctB64] = v.slice(PREFIX.length).split('.');
  const iv = Buffer.from(ivB64, 'base64url');
  const tag = Buffer.from(tagB64, 'base64url');
  const ct = Buffer.from(ctB64, 'base64url');
  if (iv.length !== 12) throw new Error('invalid IV length');
  if (tag.length !== 16) throw new Error('invalid auth tag length');
  const d = crypto.createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString('utf-8');
}

const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
const accessToken = decrypt(creds['oauth:bigmodel:access_token']);
if (!accessToken || accessToken.length < 20) throw new Error('decrypt produced no usable token');
console.log('access token decrypted: OK (length ' + accessToken.length + ', not printed)');

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
cfg.provider = cfg.provider || {};
cfg.provider.bigmodel = {
  kind: 'anthropic',
  name: 'BigModel Coding Plan',
  options: {
    apiKeyRequired: true,
    baseURL: 'https://open.bigmodel.cn/api/anthropic',
    apiKey: accessToken,
  },
};
cfg.model = { main: 'bigmodel/glm-5.1', lite: 'bigmodel/glm-4.7' };
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
console.log('cli/config.json provider.bigmodel + model written; plugins state preserved:',
  JSON.stringify(cfg.plugins?.enabledPlugins ?? {}));
