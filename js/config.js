/**
 * Configuração do Supabase (login e banco). A chave "publishable" é pública por design; a segurança vem do RLS em supabase.sql.
 */

const CFG = {
  url: 'https://hjenrdssyowpfmhthuhi.supabase.co',
  key: 'sb_publishable_PcLiGoEGt7vqvxJkOZqonw_L0y_XEyp'
},
      SB_ON = !!(CFG.url && CFG.key);
