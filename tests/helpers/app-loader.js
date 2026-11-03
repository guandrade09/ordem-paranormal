/**
 * Carrega o app dentro de um contexto isolado do Node (módulo `vm`), imitando o navegador:
 * cada <script src> do index.html roda em ordem, no mesmo escopo global, como numa página real.
 * Não precisa de nenhuma dependência instalada.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const FIXED_TIME = 1700000000000; // data fixa para resultados repetíveis

/** Armazenamento em memória (localStorage / sessionStorage falsos). */
function memoryStorage() {
  const data = {};
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
    _data: data,
  };
}

/** Lista os scripts do index.html (na ordem) ou, para um arquivo antigo de página única, o script inline. */
function readScripts(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const external = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/g)].map((m) => m[1]);
  if (external.length) {
    return external.map((src) => ({ name: src, code: fs.readFileSync(path.join(path.dirname(htmlPath), src), 'utf8') }));
  }
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).sort((a, b) => b.length - a.length);
  return [{ name: 'inline', code: inline[0] }];
}

/**
 * @param {object} opts
 * @param {string} [opts.html]       caminho do HTML (padrão: index.html do projeto)
 * @param {object} [opts.cfg]        {url,key} para ligar o login (substitui js/config.js)
 * @param {object} [opts.supabase]   cliente Supabase falso
 * @param {Function} [opts.confirm]  resposta do confirm()
 */
function loadApp(opts = {}) {
  const htmlPath = opts.html || path.join(ROOT, 'index.html');
  const el = {
    innerHTML: '', outerHTML: '', className: '', textContent: '', value: '', scrollTop: 0, dataset: {},
    style: { setProperty() {} }, classList: { toggle() { return 1; }, remove() {}, add() {} },
  };
  const inputs = {}; // valores dos campos por seletor, ex.: inputs['#cmn'] = {value: 'Ana'}
  const documentStub = {
    querySelector: (s) => inputs[s] || el,
    querySelectorAll: () => [],
    addEventListener() {},
    documentElement: { dataset: {} },
    createElement: () => ({ click() {}, remove() {} }),
    head: { appendChild(node) { if (node.onload) node.onload(); } },
    body: { appendChild() {}, dataset: {} },
  };
  const ctx = vm.createContext({
    document: documentStub, localStorage: memoryStorage(), sessionStorage: memoryStorage(),
    location: { origin: 'https://exemplo.github.io', pathname: '/app/' },
    confirm: opts.confirm || (() => true), scrollTo() {}, scrollY: 0,
    Image: function () {}, FileReader: function () {}, URL: {}, setTimeout, clearTimeout, console,
  });
  ctx.window = ctx;
  if (opts.supabase) ctx.supabase = opts.supabase;
  vm.runInContext(
    `Math.random=()=>0.5;const _D=Date;Date=class extends _D{constructor(...a){a.length?super(...a):super(${FIXED_TIME})}static now(){return ${FIXED_TIME}}}`,
    ctx,
  );

  const scripts = readScripts(htmlPath);
  for (const s of scripts) {
    let code = s.code;
    if (opts.cfg && /(^|\/)config\.js$/.test(s.name)) {
      code = code.replace(/const CFG\s*=\s*\{[^}]*\}/, `const CFG=${JSON.stringify(opts.cfg)}`);
    } else if (opts.cfg && s.name === 'inline') {
      code = code.replace(/const CFG\s*=\s*\{[^}]*\}/, `const CFG=${JSON.stringify(opts.cfg)}`);
    }
    vm.runInContext(code, ctx, { filename: s.name });
  }

  const ev = (expr) => vm.runInContext(expr, ctx);
  return {
    ctx, el, inputs, scripts, ev,
    /** Acesso a qualquer variável/função global do app: app.g.R(), app.g.S ... */
    g: new Proxy({}, { get: (_, name) => ev(name) }),
    /** Define S (estado) com um objeto. */
    setState(obj) { ctx.__tmp = obj; ev('S=__tmp'); },
    html: () => el.innerHTML,
  };
}

module.exports = { loadApp, ROOT, memoryStorage };
