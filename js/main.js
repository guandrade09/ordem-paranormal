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
