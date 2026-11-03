/**
 * Dados do livro: origens de personagem.
 */

// Origens
const OR = [
  ['Acadêmico', 'Ciências,Investigação', 'Saber é Poder', 'Em teste usando Intelecto, gasta 2 PE para receber +5.', 2],
  ['Agente de Saúde', 'Intuição,Medicina', 'Técnica Medicinal', 'Ao curar, soma seu Intelecto aos PV curados.', 0],
  [
    'Amnésico', '', 'Vislumbres do Passado',
    'Uma vez por sessão, pode fazer teste para reconhecer algo do passado. Se passar, 1d4 PE temporários.', 0
  ],
  ['Artista', 'Artes,Enganação', 'Magnum Opus', 'Recebe +5 em teste de Presença ao ser reconhecido.', 0],
  [
    'Atleta', 'Acrobacia,Atletismo', '110%',
    'Gasta 2 PE para receber +5 em teste de Força ou Agilidade (exceto Luta e Pontaria).', 2
  ],
  ['Chef', 'Fortitude,Profissão', 'Ingrediente Secreto', 'Prepara refeições que concedem bônus a quem comer.', 0],
  [
    'Criminoso', 'Crime,Furtividade', 'O Crime Compensa',
    'No fim da missão, escolhe um item encontrado; ele não conta no limite de categoria (marque no inventário).', 0
  ],
  [
    'Cultista Arrependido', 'Ocultismo,Religião', 'Traços do Outro Lado',
    'Possui um poder paranormal à escolha, mas começa com metade da Sanidade da classe.', 0
  ],
  ['Desgarrado', 'Fortitude,Sobrevivência', 'Calejado', '+1 PV para cada 5% de NEX.', 0],
  [
    'Engenheiro', 'Profissão,Tecnologia', 'Ferramentas Favoritas',
    'Um item (exceto arma) conta como uma categoria abaixo (marque no inventário).', 0
  ],
  [
    'Executivo', 'Diplomacia,Profissão', 'Processo Otimizado',
    'Gasta 2 PE para +5 em testes estendidos ou revisar documento.', 2
  ],
  [
    'Investigador', 'Investigação,Percepção', 'Faro para Pistas',
    'Uma vez por missão, gasta 1 PE para +5 em teste de procurar pista.', 1
  ],
  ['Lutador', 'Luta,Reflexos', 'Mão Pesada', '+2 em rolagens de dano corpo a corpo.', 0],
  ['Magnata', 'Diplomacia,Pilotagem', 'Patrocinador da Ordem', 'Limite de crédito sempre um acima do atual.', 0],
  [
    'Mercenário', 'Iniciativa,Intimidação', 'Posição de Combate',
    'No 1º turno de cada cena de ação, gasta 2 PE para uma ação de movimento adicional.', 2
  ],
  ['Militar', 'Pontaria,Tática', 'Para Bellum', '+2 em rolagens de dano com armas de fogo.', 0],
  [
    'Operário', 'Fortitude,Profissão', 'Ferramenta de Trabalho',
    'Uma arma simples ou tática (marque no inventário): +1 de dano e +1 na margem de ameaça.', 0
  ],
  ['Policial', 'Percepção,Pontaria', 'Patrulha', '+2 em Defesa.', 0],
  [
    'Religioso', 'Religião,Vontade', 'Acalentar',
    '+5 em Religião para acalmar, a pessoa recebe 1d6 + Presença de Sanidade.', 0
  ],
  [
    'Servidor Público', 'Intuição,Vontade', 'Espírito Cívico',
    'Ao ajudar, gasta 1 PE para aumentar o bônus concedido em +2.', 1
  ],
  [
    'Teórico da Conspiração', 'Investigação,Ocultismo', 'Eu Já Sabia',
    'Recebe resistência a dano mental igual ao Intelecto.', 0
  ],
  [
    'T.I.', 'Investigação,Tecnologia', 'Motor de Busca',
    'Com internet, gasta 2 PE para substituir um teste de perícia por Tecnologia.', 2
  ],
  [
    'Trabalhador Rural', 'Adestramento,Sobrevivência', 'Desbravador',
    'Gasta 2 PE para +5 em Adestramento/Sobrevivência, não sofre penalidade em terreno difícil.', 2
  ],
  [
    'Trambiqueiro', 'Crime,Enganação', 'Impostor',
    'Uma vez por cena, gasta 2 PE para substituir um teste de perícia por Enganação.', 2
  ],
  [
    'Universitário', 'Atualidades,Investigação', 'Dedicação',
    '+1 PE a cada NEX ímpar (5%, 15%, 25%...) e +1 em PE/rodada.', 0
  ],
  ['Vítima', 'Reflexos,Vontade', 'Cicatrizes Psicológicas', 'Recebe +1 de Sanidade para cada 5% de NEX.', 0]
];
