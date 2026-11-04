/**
 * Configuração do Supabase (login e banco). A chave "publishable" é pública por design; a segurança vem do RLS em supabase.sql.
 */

const CFG = {
  url: 'https://hjenrdssyowpfmhthuhi.supabase.co',
  key: 'sb_publishable_PcLiGoEGt7vqvxJkOZqonw_L0y_XEyp'
},
      SB_ON = !!(CFG.url && CFG.key);

// Versão do app (aparece ao lado de BETA na tela inicial para conferir se a versão nova já chegou). Suba a cada publicação.
const APP_VERSION = '0.12.0';
