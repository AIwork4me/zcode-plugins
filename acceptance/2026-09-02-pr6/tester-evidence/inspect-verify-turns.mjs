import fs from 'node:fs';
const lines = fs.readFileSync('C:/Users/rocm/.zcode/cli/rollout/model-io-sess_c9988976-9739-4fe8-bc28-72e3fa5a9217.jsonl', 'utf8').split('\n').filter(Boolean);
for (const idx of [28, 29, 30]) {
  const j = JSON.parse(lines[idx]);
  console.log('=== record', idx + 1, j.completedAt);
  for (const tc of j.response?.toolCalls || []) {
    console.log('TOOL', tc.name, JSON.stringify(tc.input).slice(0, 420));
  }
  const t = String(j.response?.text || '').replace(/\s+/g, ' ');
  if (t) console.log('TEXT:', t.slice(0, 400));
}
