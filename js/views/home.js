/**
 * Telas iniciais: início, menu do Mestre e conta.
 */

// Lista de personagens
const home = () =>
  `<div class=fade>${gear(1)}${logoH()}<div class=bar>Fichas de Agente</div>${
    S.chars.filter(c => !c.npc)
      .map(c => `<div class="card row" onclick="S.bk=null;S.cid=${c.id};S.v='sheet';S.tab=0;R()">${ph(c)}<div><b>${
             c.name}</b><br><small>${c.classe} · ${c.origem} · NEX ${
             c.nex}%</small></div><button class=x onclick="event.stopPropagation();delC(${c.id})">✕</button></div>`)
      .join('') ||
    '<small>Nenhum agente ainda.</small>'}<button class=btn onclick="newC()">+ Novo agente</button></div>`;

// Menu do Mestre
const mestre = () => `<div class=fade>${
  gear(1)}${logoH()}<div class=bar>Área do Mestre</div><div class=grid2>${
  MS.map(m => `<button class=card onclick="go('${m}')">${m}</button>`).join('')}</div></div>`;

// Tela da conta
const conta = () => `<div class=fade><button onclick="S.v=S.from||'start';R()">← Voltar</button><div class=bar>Conta</div>${
  SB_ON && AU.u ?
    `<div class=card><b>${aesc(AU.u.email || '')}</b><br><small class=sst>${
      sstH()}</small><br><small style="opacity:.7">Suas fichas são salvas na sua conta e ficam disponíveis em qualquer aparelho.</small></div><button onclick="syncNow()">🔄 Sincronizar agora</button><button onclick="aOut()">🚪 Sair da conta</button>` :
    `<div class=card>Modo local: suas fichas ficam salvas só neste navegador. Use <b>Exportar backup</b> nas configurações.</div>`}</div>`;
