import path from 'node:path';
import { spawn } from 'node:child_process';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = process.argv[2];
const port = 9600 + Math.floor(Math.random() * 80);
const chrome = spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(process.env.TEMP || '.', 'dump-' + port)}`, 'about:blank'],
  { stdio: 'ignore' },
);
let page;
for (let i = 0; i < 100 && !page; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    page = list.find((t) => t.type === 'page');
  } catch {}
  if (!page) await sleep(200);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
let seq = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);
  }
};
const send = (method, params = {}) => {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(3500);
const r = await send('Runtime.evaluate', {
  expression: `(() => {
    const S = window.__legacy.getS();
    return JSON.stringify({
      seq: S.seq,
      seed4: S.seed4, sim14: S.sim14,
      packages: S.packages.map(p => ({ id: p.id, n: p.name, t: p.type, q: (p.qs||[]).length, sim: p.sim||0, pub: p.pub })),
      totalSoal: S.packages.reduce((a,p)=>a+(p.qs||[]).length,0),
      parseSoal: typeof window.parseSoal,
      SQ: String.fromCharCode(167), SO: String.fromCharCode(166)
    }, null, 1);
  })()`,
  returnByValue: true,
});
console.log(r.result.value);
ws.close();
chrome.kill();
process.exit(0);
