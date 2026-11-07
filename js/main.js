/**
 * Inicialização: eventos globais e primeira renderização.
 */

document.addEventListener('visibilitychange', () => {
  if (SB_ON && document.visibilityState == 'hidden') {
    clearTimeout(SYNC.t);
    push()
  }
});
// Voltou a internet (ou o servidor falhou): tenta de novo sozinho, sem mensagem de erro na tela
function aRetry() {
  if (!SB_ON || AU.off || semNet() || AU.ld) return;
  if (AU.fail) {
    AU.fail = 0;
    AU.ld = 1;
    R();
    aInit()
  } else if (AU.perr && AU.u)
    aEnter()
}
if (typeof window.addEventListener == 'function') {
  window.addEventListener('online', () => {
    if (authGate()) {
      aRetry();
      if (!AU.ld) R()
    }
  });
  window.addEventListener('offline', () => {
    if (authGate()) R()
  });
  setInterval(aRetry, 15000)
}
if (SB_ON) aInit();
R();
// App instalável: service worker (rede primeiro, com cópia para uso sem internet)
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
