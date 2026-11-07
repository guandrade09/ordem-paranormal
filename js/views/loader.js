/**
 * Tela/mensagem de carregamento: os 15 símbolos de Ordem Paranormal em sequência (0,5 s cada), em loop.
 * Só CSS anima (sem timers): cada quadro é uma imagem empilhada com atraso de 0,5 s. Imagens em img/load/ (recortadas e centralizadas).
 * Sem internet: o mesmo loader + "SEM TRANSMISSÃO..." em verde, fonte de terminal. Carregando normal: só os símbolos.
 */
const LDR_SEQ = [1, 2, 3, 4, 5, 6, 7, 8, 7, 9, 1, 2, 5, 7, 10],  // ordem enviada pelo usuário (repetições fazem parte)
      LDR_STEP = 0.5,                                              // segundos entre um símbolo e o próximo
      semNet = () => typeof navigator != 'undefined' && navigator.onLine === false,
      ldr = (off, mini) =>
        `<div class="ldr${off ? ' off' : ''}${mini ? ' mini' : ''}" role=status aria-label="${
          off ? 'Sem transmissão' : 'Carregando'}"><div class=ldr-sym>${
          LDR_SEQ.map((n, i) => `<img src="img/load/s${n}.png" alt="" style="animation-delay:${i * LDR_STEP}s">`)
            .join('')}</div>${
          off && !mini ? '<div class=ldr-txt>SEM TRANSMISSÃO<span class=ldr-dots>...</span></div>' : ''}</div>`,
      // status de sincronização: "⏳ …" vira o loader pequeno; os demais continuam texto
      sstH = () => (SYNC.st || '').startsWith('⏳') ? ldr(0, 1) : aesc(SYNC.st || '');
