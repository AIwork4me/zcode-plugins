// Analyze the E2E session model-io transcript: tool calls, skill usage, image attempts.
import fs from 'node:fs';

const path = process.argv[2];
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);
const events = [];
for (const line of lines) {
  let j;
  try { j = JSON.parse(line); } catch { continue; }
  events.push(j);
}
console.log('total records:', events.length);
// discover record shapes
const shapes = new Map();
for (const e of events) {
  const k = e.type || e.role || Object.keys(e).slice(0, 3).join('.');
  shapes.set(k, (shapes.get(k) || 0) + 1);
}
console.log('record types:', JSON.stringify([...shapes.entries()]));

// Walk messages for tool_use / tool_result
let toolCalls = [];
const scan = (obj, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 6) return;
  if (Array.isArray(obj)) { obj.forEach((o) => scan(o, depth + 1)); return; }
  if (obj.type === 'tool_use' || obj.type === 'toolCall' || (obj.name && obj.input)) {
    toolCalls.push({ name: obj.name, input: obj.input });
  }
  for (const v of Object.values(obj)) scan(v, depth + 1);
};
events.forEach((e) => scan(e));
console.log('tool calls found:', toolCalls.length);
const byName = new Map();
for (const t of toolCalls) byName.set(t.name, (byName.get(t.name) || 0) + 1);
console.log('by tool:', JSON.stringify([...byName.entries()]));
// print compact list of Bash commands and Read paths
for (const t of toolCalls) {
  if (t.name === 'Bash' && t.input?.command) {
    const c = String(t.input.command).replace(/\s+/g, ' ').slice(0, 150);
    console.log('BASH:', c);
  } else if ((t.name === 'Read' || t.name === 'read') && t.input) {
    console.log('READ:', JSON.stringify(t.input).slice(0, 160));
  }
}
