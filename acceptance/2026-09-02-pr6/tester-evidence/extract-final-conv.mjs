// Extract the final full conversation from the LAST model_io snapshot in order.
import fs from 'node:fs';

const path = process.argv[2];
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);
let last;
for (const line of lines) {
  try { last = JSON.parse(line); } catch {}
}
const msgs = last?.messages ?? last?.data?.messages ?? last?.io?.messages ?? [];
console.log('messages in final snapshot:', Array.isArray(msgs) ? msgs.length : typeof msgs);

let step = 0;
const walk = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach(walk); return; }
  if (obj.type === 'tool_use') {
    step++;
    const i = obj.input || {};
    let d = '';
    if (i.command) d = String(i.command).replace(/\s+/g, ' ').slice(0, 200);
    else if (i.file_path) d = i.file_path + (i.text_range ? ` range=${JSON.stringify(i.text_range)}` : '');
    else d = JSON.stringify(i).slice(0, 150);
    console.log(`[${step}] ${obj.name}: ${d}`);
  }
  for (const v of Object.values(obj)) walk(v);
};
walk(msgs);
