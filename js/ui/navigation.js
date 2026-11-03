/**
 * Navegação do menu do Mestre para as telas.
 */

// Abrir tela do menu do Mestre
function go(m) {
  S.v = m == 'Grimório Paranormal'     ? 'grim' :
    m == 'Inventário de Itens e Armas' ? 'minv' :
    m == 'NPCs'                        ? 'npc' :
    m == 'Criador de Combates'         ? 'cmb' :
    m == 'Monstruário (Ameaças)'       ? 'thr' :
                                         'wip';
  S.w = m;
  R()
}
