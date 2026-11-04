/**
 * Inicialização: eventos globais e primeira renderização.
 */

document.addEventListener('visibilitychange', () => {
  if (SB_ON && document.visibilityState == 'hidden') {
    clearTimeout(SYNC.t);
    push()
  }
});
if (SB_ON) aInit();
R();
// App instalável: service worker (rede primeiro, com cópia para uso sem internet)
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
