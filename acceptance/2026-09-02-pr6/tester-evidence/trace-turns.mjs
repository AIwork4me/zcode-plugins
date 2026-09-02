// Chronological action trace: one line per model turn (tool calls + text snippet).
import fs from 'node:fs';

const path = process.argv[2];
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);
let turn = 0;
for (const line of lines) {
  let j;
  try { j = JSON.parse(line); } catch { continue; }
  turn++;
  const resp = j.response || {};
  const parts = [];
  for (const tc of resp.toolCalls || []) {
    const i = tc.input || tc.arguments || {};
    let d = '';
    if (i.command) d = String(i.command).replace(/\s+/g, ' ').slice(0, 170);
    else if (i.file_path) d = String(i.file_path).slice(0, 140);
    else if (i.skill) d = `skill=${i.skill} ${JSON.stringify(i.args || i.task || '').slice(0, 90)}`;
    else if (i.description) d = `${i.description} ${(i.prompt || '').slice(0, 80)}`;
    else d = JSON.stringify(i).slice(0, 120);
    parts.push(`${tc.name}(${d})`);
  }
  const txt = (resp.text || '').replace(/\s+/g, ' ').slice(0, 110);
  console.log(`--- turn ${turn} (${j.completedAt})`);
  if (parts.length) parts.forEach((p) => console.log('  TOOL', p));
  if (txt) console.log('  TEXT', txt);
}
