/**
 * Inicialização: eventos globais e primeira renderização.
 */

document.addEventListener('visibilitychange', () => {
  if (SB_ON && document.visibilityState == 'hidden') {
    clearTimeout(SYNC.t);
    push()
  }
});
// Sem internet / servidor inalcançável: tenta reconectar sozinho a cada 5 s, em silêncio (a tela não pisca).
// Para de tentar quando a pessoa escolhe "Usar offline". Sem mensagem de erro na tela.
function aRetry() {
  if (!SB_ON || AU.rtb || semNet() || AU.ld || !authGate()) return;
  AU.rtb = 1;
  const fim = () => {AU.rtb = 0};
  if (AU.fail)
    aInit(1).then(fim, fim);
  else if (AU.perr && AU.u)
    aEnter(1).then(fim, fim);
  else
    fim()
}
if (typeof window.addEventListener == 'function') {
  window.addEventListener('online', () => {
    if (!authGate()) return;
    if (AU.fail || AU.perr) aRetry();
    else if (!AU.ld) R()
  });
  window.addEventListener('offline', () => {
    if (authGate()) R()
  });
  setInterval(aRetry, 5000)
}
if (SB_ON) aInit();
R();
// App instalável: service worker (rede primeiro, com cópia para uso sem internet)
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
