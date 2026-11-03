/**
 * Textos: descrições do Grimório Ritualístico e itens especiais (BR).
 */

// Descrições de itens
const BR = {
  'Grimório Ritualístico':
    'Armazena rituais que sua mente não seria capaz de guardar (capacidade conforme a habilidade). Para conjurar, empunhe o grimório e gaste uma ação completa folheando-o. Se perdido, pode ser replicado com duas ações de interlúdio.',
  'Coração Pulsante':
    'Reação: reduz o dano à metade; **Fortitude DT 15** (+5 por uso extra no dia) ou o item é destruído.',
  'Frasco de Vitalidade':
    'Sofra até **20 de dano** para guardar seu sangue; beber (ação padrão) recupera o mesmo PV (**Fortitude DT 20**).',
  'Pérola de Sangue':
    'Ação de movimento: **+5** em Agilidade, Força e Vigor até o fim da cena; **Fortitude DT 20** ao final.',
  'Punhos Enraivecidos':
    'Desarmado causa **1d8 de dano de Sangue**; ataque extra pagando **2 PE** (+2 por ataque já feito no turno).',
  'Seringa de Transfiguração':
    'Ação padrão: suga o sangue de um alvo e injeta em outro, transfigurando a aparência dele.',
  'Casaco de Lodo': '**Resistência 5** a corte, impacto, Morte e perfuração; vulnerável a balístico e Energia.',
  'Coletora': 'Punhal: ação completa em alguém morrendo mata e guarda **1d8 PE** (máx. 20 PE).',
  'Crânio Espiral': 'Ação livre: **ação padrão adicional** na rodada; **Vontade DT 15** (+5 por uso extra no dia).',
  'Frasco de Lodo':
    'Ação padrão: ferida recente cura **6d8+20 PV**; antiga: par **3d8+10 PV**, ímpar **3d8+10 de dano de Morte**.',
  'Vislumbre do Fim': 'Óculos: ação de movimento para ver informações sobre a morte de um ser.',
  'Anéis do Elo Mental': 'Dois anéis usados por 24h criam uma ligação telepática entre os usuários.',
  'Lanterna Reveladora':
    'Ação padrão e **1 PE**: luz com efeito de Terceiro Olho por uma cena; atrai criaturas de Sangue.',
  'Máscara das Pessoas nas Sombras':
    '**Resistência a Conhecimento 10**; ação de movimento e **2 PE** para se teleportar entre sombras.',
  'Pergaminho da Pertinácia':
    'Ação padrão: **5 PE temporários** até o fim da cena; **Ocultismo DT 15** (+5 por uso extra) ou se desfaz.',
  'Arcabuz dos Moretti': 'Arma de fogo simples de uma mão com **+2 no ataque** e efeito extra ao disparar.',
  'Peitoral da Segunda Chance': 'Ao chegar a 0 PV, gasta **5 PE** e reanima você com **4d10 PV**.',
  'Relógio de Arnaldo': '**1 PE**: rola de novo um dado que tirou 1 (custo +1 por uso extra no dia).',
  'Talismã da Sorte': 'Reação e **3 PE** ao sofrer dano: **1d4** (2–3 evita; 4 evita e queima; 1 dobra o dano).',
  'Teclado de Conexão Neural': 'Conecta sua mente ao computador: **+10** para hackear e metade do tempo.',
  'Tela do Pesadelo':
    'Ação padrão e **2 PE**: quem tocar a tela vê uma ilusão aterrorizante; **Vontade** (DT do usuário +5).',
  'Veículo Energizado': 'Sem combustível; **Pilotagem DT 25** (reação) para atravessar objetos em forma de energia.',
  'Jaqueta de Veríssimo': '**Resistência a dano paranormal 15**.',
  'Kit de perícia': 'Ferramentas para usar perícias que exigem equipamento.',
  'Utensílio': 'Item que ajuda em uma perícia específica.',
  'Vestimenta': 'Roupa para uma situação específica.',
  'Granada de atordoamento': 'Explosão de luz e som que atordoa os atingidos.',
  'Granada de fragmentação': 'Explosão de estilhaços que causa dano em área.',
  'Granada de fumaça': 'Nuvem de fumaça que dá camuflagem.',
  'Granada incendiária': 'Dano de fogo em área; pode incendiar.',
  'Mina antipessoal': 'Explosivo armado no chão; detona ao ser pisado.',
  'Algemas': 'Prendem os pulsos de uma pessoa.',
  'Arpéu': 'Gancho com corda para escalar.',
  'Bandoleira': 'Faixa para carregar munição e itens pequenos.',
  'Binóculos': 'Permitem enxergar à distância.',
  'Bloqueador de sinal': 'Bloqueia sinais de rádio e celular na área.',
  'Cicatrizante': 'Cura **2d8+2 PV** em você ou em um ser adjacente.',
  'Corda': 'Corda resistente para escalar ou amarrar.',
  'Equipamento de sobrevivência': 'Kit para sobreviver na natureza.',
  'Lanterna tática': 'Lanterna potente que ilumina e pode ofuscar.',
  'Máscara de gás': '**+10** em Fortitude contra efeitos de respiração.',
  'Mochila militar': 'Não ocupa espaço e aumenta a carga em **2 espaços**.',
  'Óculos de visão térmica': 'Eliminam a penalidade por camuflagem.',
  'Pé de Cabra': '**+5** em Força para arrombar; serve de bastão.',
  'Pistola de dardos': 'Dardo sonífero: alvo inconsciente até o fim da cena (**Fortitude** reduz).',
  'Pistola sinalizadora': 'Sinal luminoso; arma curta de **2d6 de fogo**.',
  'Soqueira': '**+1** de dano desarmado.',
  'Spray de pimenta': 'Cega por **1d4 rodadas** (**Fortitude** evita).',
  'Taser': '**1d6 de eletricidade** e atordoa por 1 rodada (**Fortitude** evita).',
  'Traje hazmat': '**+5** contra efeitos ambientais e **resistência a químico 10**.',
  'Proteção leve': '**+5 Defesa**.',
  'Proteção pesada': '**+10 Defesa** e resistência a dano físico.',
  'Escudo': '**+2 Defesa**.',
  'Balas curtas': 'Pacote: 30 ataques (pistola, revólver, submetralhadora).',
  'Balas longas': 'Pacote: 30 ataques (fuzis e metralhadora).',
  'Cartuchos': 'Pacote: 20 ataques (espingarda).',
  'Flechas': 'Pacote: 20 ataques (arcos e bestas).',
  'Foguete': '1 ataque (bazuca).',
  'Combustível': 'Pacote: 20 ataques (lança-chamas).',
  'Amarras de (Elemento)':
    'Armadilha 3x3m (**2 PE**, ação completa, **Reflexos DT Int**) ou laçar (**1 PE**, **Vontade DT Agi**; 1 PE/rodada).',
  'Câmera de Aura Paranormal': 'Ação padrão e **1 PE**: a foto revela auras paranormais.',
  'Componentes Ritualísticos de (Elemento)': 'Necessários para conjurar rituais do elemento.',
  'Emissor de Pulsos Paranormais':
    'Ação completa e **1 PE**: atrai criaturas do elemento e afasta as do oposto (**Vontade DT Pre**).',
  'Escuta de Ruídos Paranormais':
    'Ação completa e **2 PE**: grava por 24h; **+5** em Ocultismo para identificar criatura.',
  'Medidor de Estabilidade da Membrana': 'Com Ocultismo treinado, avalia o estado da Membrana na área.',
  'Scanner de Manifestação Paranormal de (Elemento)':
    'Ação padrão e **1 PE/rodada**: mostra a direção das manifestações do elemento (alcance longo).'
};
CAT.amd.push([
  'Jaqueta de Veríssimo', 2, 1, {},
  '**Medo.** Uma jaqueta de estilo aviador feita de couro marrom com a gola forrada de pele branca. Esta vestimenta de aparência comum já foi usada por vários agentes importantes e experientes da Ordem, e presenciou inúmeras batalhas e sacrifícios. Você recebe resistência a dano paranormal 15.'
]);
