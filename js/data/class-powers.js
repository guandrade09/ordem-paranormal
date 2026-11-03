/**
 * Dados do livro: poderes de classe e trilhas por NEX.
 */

// Classes e poderes por NEX
const
  D =
    {
      'Combatente': {
        'pow': [
          {'n': 'Armamento Pesado', 't': 'Você recebe proficiência com armas pesadas.', 'p': 'For 2'}, {
            'n': 'Artista Marcial',
            't':
              'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas dgeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
            'p': ''
          },
          {
            'n': 'Ataque de Oportunidade',
            't':
              'Sempre que um ser sair voluntariamente de um espaco adjacente ao seu, você pode gastar uma reacio e 1 PE para fazer um ataque corpo a corpo contra ele.',
            'p': ''
          },
          {
            'n': 'Combater com Duas Armas',
            't':
              'Se estiver usando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre -@ em todos os testes de ataque até o seu próximo turno. Pré- -requisitos: Agi 3, treinado em Luta ou Pontaria.',
            'p': ''
          },
          {
            'n': 'Combate Defensivo',
            't':
              'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre -@ em todos os testes de ataque, mas recebe +5 na Defesa.',
            'p': 'Int 2'
          },
          {
            'n': 'Golpe Demolidor',
            't':
              'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma.',
            'p': 'For 2, treinado em Luta'
          },
          {
            'n': 'Golpe Pesado',
            't': 'O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo.',
            'p': ''
          },
          {
            'n': 'Incansável',
            't':
              'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigacao adicional, mas deve usar Força ou Agilidade como atributo-base do teste. Presi a Atlética. Quando faz. um teste de facilitar a investigagao, você pode gastar 1 PE para usar Forca ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +@ no teste.',
            'p': ''
          },
          {'n': 'Proteção Pesada', 't': 'Você recebe proficiência com', 'p': 'NEX 30%'},
          {'n': 'Reflexos Defensivos', 't': 'Você recebe +2 em Defesa e-em testes de resistência.', 'p': 'Agi 2'}, {
            'n': 'Saque Rápido',
            't':
              'Você pode sacar ou guardar itens como uma acio livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de municao, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre.',
            'p': 'treinado em Iniciativa'
          },
          {
            'n': 'Segurar o Gatilho',
            't':
              'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque -CARACTERISTICAS 4 PV (+Vig) A cada novo nivel de exposicio PONTOS DE ESFORCOINICIAIS _2+PRESENCA A cada novo nivel de exposição 2 PE (+Pre) SANIDADE INICIAL 12 AN A cada novo nivel de exposi PERICIAS TREINADAS Luta ou Pontaria (uma das duas) e Fortitude ou Reflexos (uma das duas), mais uma quantidade de perícias 4 sua escolha igual a 1 + Intelecto. PROFICIENCIAS Armas simples, armas taticas e proteges leves. TABELA 1.3: O COMBATENTE Habilidades Ataque especial (2 PE, +5) Habilidade de trilha Poder de combatente Aumento de atributo Ataque especial (3 PE, +10) Poder de combatente Grau de treinamento Habilidade de trilha Poder de combatente Aumento de atributo, versatilidade Ataque especial (4 PE, +15) Poder de combatente Habilidade de trilha Grau de treinamento Poder de combatente Aumento de atributo Ataque especial (5 PE, +20) Poder de combatente Aumento de atributo Habilidade de trilha com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque jé realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PEe, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada.',
            'p': 'NEX 60%'
          },
          {
            'n': 'Sentido Tático',
            't':
              'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena.',
            'p': 'Int 2, treinado em Percepgao e Tática'
          },
          {
            'n': 'Tanque de Guerra',
            't':
              'Se estiver usando uma protecao pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2.',
            'p': 'Protecao Pesada'
          },
          {
            'n': 'Tiro Certeiro',
            't':
              'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar).',
            'p': 'treinado em Pontaria'
          },
          {
            'n': 'Tiro de Cobertura',
            't':
              'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direcéo de um personagem no alcance da arma para forcd-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde esta e sofre —5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo.',
            'p': ''
          },
          {
            'n': 'Transcender',
            't':
              'Escolha um poder paranormal (veja a pagina 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder varias vezes.',
            'p': ''
          },
          {
            'n': 'Treinamento em Perícia',
            't':
              'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais jd é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais jé é veterano para se tornar expert. Você pode escolher este poder varias vezes.',
            'p': ''
          }
        ],
        'tr': [
          {
            'n': 'Aniquilador',
            'prof':
              'Você é treinado para abater alvos com eficiéncia e velocidade, Suas armas são suas melhores amigas € você cuida tao bem delas quanto de seus companheiros de equipe. Talvez até melhor.',
            'ab': [
              {
                'nex': 10,
                'n': 'A Favorita',
                't':
                  'Escolha uma arma para ser sua favorita, como katana ou fuzil de assalto. A categoria da arma escolhida é reduzida em I. (Marque a arma favorita na aba Inventário.)'
              },
              {
                'nex': 40,
                'n': 'Técnica Secreta',
                't':
                  'A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional. Amplo: o ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos). Destruidor: aumenta o multiplicador de crítico da arma em +1.'
              },
              {
                'nex': 65,
                'n': 'Técnica Sublime',
                't':
                  'Você adiciona os seguintes efeitos à lista de sua Técnica Secreta (2 PE cada): Letal: aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5. Perfurante: ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.'
              },
              {
                'nex': 99,
                'n': 'Máquina de Matar',
                't':
                  'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.'
              }
            ]
          },
          {
            'n': 'Comandante de Campo',
            'prof': 'rapidas e tirando melhor proveito da situação e do talento de seus aliados.',
            'ab': [
              {
                'nex': 10,
                'n': 'Inspirar Confiança',
                't':
                  'Sua lideranga inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em aleance curto rolar novamente um teste recém realizado.'
              },
              {
                'nex': 40,
                'n': 'Estrategista',
                't':
                  'Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.'
              },
              {
                'nex': 65,
                'n': 'Brecha na Guarda',
                't':
                  'Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, você pode gastar uma reação € 2 PE para que você ou outro aliado em alcance curto faça um ataque adicional contra o mesmo inimigo. Além disso, o alcance de inspirar confianga e estrategista aumenta para médio.'
              },
              {
                'nex': 99,
                'n': 'Oficial Comandante',
                't':
                  'Você pode gastar uma ação padrão e 5 PE para que cada aliado que você possa ver em alcance médio receba uma ação padrão adicional no próximo turno dele.'
              }
            ]
          },
          {
            'n': 'Guerreiro',
            'prof':
              'Você treinou sua musculatura e movimentos a ponto de transformar seu corpo em uma verdadeira arma. Com golpes corpo a corpo tio poderosos quanto uma bala, você encara os perigos de frente.',
            'ab': [
              {
                'nex': 10,
                'n': 'Técnica Letal',
                't': 'Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo.'
              },
              {
                'nex': 40,
                'n': 'Revidar',
                't':
                  'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.'
              },
              {
                'nex': 65,
                'n': 'Força Opressora',
                't':
                  'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caido.'
              },
              {
                'nex': 99,
                'n': 'Potência Máxima',
                't':
                  'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos sdo dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.'
              }
            ]
          },
          {
            'n': 'Operações Especiais',
            'prof':
              'Você é um combatente eficaz. Suas ações são calculadas e otimizadas, sempre antevendo os movimentos inimigos e se posicionando da maneira mais inteligente no campo de batalha.',
            'ab': [
              {
                'nex': 10,
                'n': 'Iniciativa Aprimorada',
                't': 'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.'
              },
              {
                'nex': 40,
                'n': 'Ataque Extra',
                't': 'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.'
              },
              {
                'nex': 65,
                'n': 'Surto de Adrenalina',
                't':
                  'Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.'
              },
              {
                'nex': 99,
                'n': 'Sempre Alerta',
                't': 'Você recebe uma ação padrão adicional no inicio de cada cena de combate.'
              }
            ]
          },
          {
            'n': 'Tropa de Choque',
            'prof':
              'Você é duro na queda. Treinou seu corpo para resistir a traumas fisicos, tornando-o praticamente inquebravel, e por isso não teme se colocar entre seus aliados e o perigo.',
            'ab': [
              {
                'nex': 10,
                'n': 'Casca Grossa',
                't':
                  'Você recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida.'
              },
              {
                'nex': 40,
                'n': 'Cai Dentro',
                't':
                  'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque a distância). Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.'
              },
              {
                'nex': 65,
                'n': 'Duro de Matar',
                't':
                  'Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.'
              },
              {
                'nex': 99,
                'n': 'Inquebrável',
                't':
                  'INQUEBRAVEL, Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5, Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.'
              }
            ]
          }
        ]
      },
      'Especialista': {
        'pow': [
          {
            'n': 'Balística Avançada',
            't': 'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com essas armas.',
            'p': ''
          },
          {
            'n': 'Conhecimento Aplicado',
            't':
              'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para',
            'p': 'Int 2'
          },
          {
            'n': 'Hacker',
            't':
              'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessario para hackear qualquer sistema para uma ação completa.',
            'p': 'treinado em Tecnologia'
          },
          {
            'n': 'Mãos Rápidas',
            't': 'Ao fazer um teste de Crime, você pode pagar 1 PE para fazé-lo como uma ação livre.',
            'p': 'Agi 3, treinado em Crime'
          },
          {
            'n': 'Mochila de Utilidades',
            't': 'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espago a menos.',
            'p': ''
          },
          {
            'n': 'Movimento Tático',
            't':
              'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno dificil e por escalar até o final do turno.',
            'p': 'treinado em Atletismo'
          },
          {
            'n': 'Nerd',
            't':
              'Você é um repositério de conhecimento itil (eimatil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informacio ttil para essa cena (se for uma investigagao, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informagao pode ser desde um livro antigo que você leu na biblioteca até um episédio de sua série de ficcao favorita. z Ninja Urbano. Você recebe proficiência com armas taticas de ataque corpo a corpo e de dis- -CARACTERISTICAS PONTOS DE VIDAINICIAIS 16. A cada novo nivel de exposic PV (+Vig) PONTOS DE ESFORCOINICIAIS _3+PRESENCA A cada novo nivel de exposi 3 PE (+Pre) SANIDADE INICIAL 16 AN A cada novo nivel de exposi 45A\\ PERICIAS TREINADAS Uma quantidade de perícias a sua escolha igual a7 + Intelecto. PROFICIENCIAS Armas simples e proti TABELA 1.4: O ESPECIALISTA NEX Habilidades 5% — Eclético, perito (2 PE, +1d6) 10% — Habilidade de trilha 15% specialista 20% Aumento de atributo 25% —Perito (3 PE, +148) 30% Poder de especialista 35% Grau de treinamento 40% Engenhosidade (veterano), habilidade de trilha 45% Poder de especialista 50% | Aumento de atributo, versatilidade Perito (4 PE, +1d10) Poder de especialista Habilidade de trilha Grau de treinamento Engenhosidade (expert), Aumento de atributo Perito (5 PE, +1412) Poder de especialista Aumento de atributo Habilidade de trilha 30 paro (exceto de fogo) +2 em rolagens de dano com essas armas.',
            'p': ''
          },
          {
            'n': 'Pensamento Ágil',
            't':
              'Uma vez por rodada, durante uma cena de investigacao, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.',
            'p': ''
          },
          {
            'n': 'Perito em Explosivos',
            't':
              'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosdo um mimero de alvos igual ao seu valor de Intelecto. 3',
            'p': ''
          },
          {
            'n': 'Primeira Impressão',
            't':
              'Você recebe +2d20 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.',
            'p': ''
          },
          {
            'n': 'Transcender',
            't':
              'Escolha um poder paranormal (veja a pagina 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder varias vezes.',
            'p': ''
          },
          {
            'n': 'Treinamento em Perícia',
            't':
              'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perfcias nas quais j4é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder varias vezes.',
            'p': ''
          }
        ],
        'tr': [
          {
            'n': 'Atirador de Elite',
            'prof':
              'Um tiro, uma morte. Ao contrario dos combatentes, você é perito em neutralizar ameaças de longe, termi- nando uma briga antes mesmo que ela comece. Você trata sua arma como uma ferramenta de precisao, sendo capaz de executar faganhas incriveis.',
            'ab': [
              {
                'nex': 10,
                'n': 'Mira de Elite',
                't':
                  'Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.'
              },
              {
                'nex': 40,
                'n': 'Disparo Letal',
                't':
                  'Quando faz a ação mirar você pode gastar 1 PE para aumentar em +2 a margem de ameaca do próximo ataque que fizer até 0 final de seu próximo turno.'
              },
              {
                'nex': 65,
                'n': 'Disparo Impactante',
                't':
                  'Se estiver usando uma arma de fogo com calibre grosso você pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar e quebrar usando um ataque a distância.'
              },
              {
                'nex': 99,
                'n': 'Atirar para Matar',
                't':
                  'Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.'
              }
            ]
          },
          {
            'n': 'Infiltrador',
            'prof':
              'Você é um perito em infiltracgdo e sabe neutralizar alvos desprevenidos sem causar alarde. Combinando talento acrobatico, destreza manual e conhecimento técnico você é capaz de superar qualquer barreira de defesa, mesmo quando a missão parece impossivel.',
            'ab': [
              {
                'nex': 10,
                'n': 'Ataque Furtivo',
                't':
                  'Você sabe atingir os pontos vitais de um inimigo distraido. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +1d6 pontos de dano do mesmo tipo da arma. Em NEX 40% o dano adicional aumenta para +2d6, em NEX 65% aumenta para +3d6 e em NEX 99% aumenta para +4d6.'
              },
              {
                'nex': 40,
                'n': 'Gatuno',
                't':
                  'Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a perícia Furtividade).'
              },
              {
                'nex': 65,
                'n': 'Assassinar',
                't':
                  'Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Além disso, se sofrer dano de seu ataque, oalvo fica inconsciente ou morrendo, a sua escolha (Fortitude DT Agi evita).'
              },
              {
                'nex': 99,
                'n': 'Sombra Fugaz',
                't':
                  'Quando faz um teste de Furtividade apés atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de -15 no teste.'
              }
            ]
          },
          {
            'n': 'Médico de Campo',
            'prof':
              'Você ¢ treinado em técnicas de primeiros socorros e tratamento de emergéncia, o que torna você um membro valioso para qualquer grupo de agentes. Ao contrdrio dos profissionais de satide convencionais, você esta acostumado com o campo de batalha e sabe tomar decisoes répidas no meio do caos. Especiau: para escolher esta trilha, você precisa ser treinado em Medicina. Para usar as habilidades desta trilha, você precisa possuir um kit de medicina.',
            'ab': [
              {
                'nex': 10,
                'n': 'Paramédico',
                't':
                  'Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida de um aliado adjacente. Você pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura.'
              },
              {
                'nex': 40,
                'n': 'Equipe de Trauma',
                't':
                  'Você pode usar uma ação padrão e 2 PE para remover uma condicao negativa (exceto morrendo) de um aliado adjacente.'
              },
              {
                'nex': 65,
                'n': 'Resgate',
                't':
                  'Uma vez por rodada, se estiver emalcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre (desde que seja capaz de fazé-lo usando seu deslocamento normal). Além disso, sempre que curar PV ou remover condicées do aliado, você e 0 aliado recebem +5 na Defesa até o início de seu próximo turno. Por fim, para você, 0 total de espagos ocupados por carregar um personagem é reduzido pela metade.'
              },
              {
                'nex': 99,
                'n': 'Reanimação',
                't':
                  'Uma vez por cena, você pode gastar uma ação completa e 10 PE para trazer de volta a vida um personagem que tenha morrido ma mesma cena (exceto morte por dano massivo).'
              }
            ]
          },
          {
            'n': 'Negociador',
            'prof':
              'Você é um diplomata habilidoso e consegue influenciar outras pessoas, seja por labia ou intimidacao. Sua capacidade de avaliar situagdes com rapidez e eficiéncia pode tirar o grupo de apuros que nem a mais poderosa das armas poderia resolver.',
            'ab': [
              {
                'nex': 10,
                'n': 'Eloquência',
                't':
                  'Você pode usar uma ação completa e 1 PE por alvo em alcance curto para afetar outros personagens com sua fala. Faça um teste de Diplomacia, Enganacao ou Intimidagao contra a Vontade dos alvos. Se você vencer, os alvos ficam fascinados enquanto você se concentrar (uma ação padrão por rodada). Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resistência e tem. direito a um novo teste por rodada, sempre que você se concentrar Um personagem que passar no teste fica imune a este efeito por um dia.'
              },
              {
                'nex': 40,
                'n': 'Discurso Motivador',
                't':
                  'Você pode gastar uma ação padrão e 4 PE para inspirar seus aliados com suas palavras. Você e todos os seus aliados em alcance curto ganham +1d20 em testes de perícia até o fim da cena. A partir de NEX 65%, você pode gastar 8 PE para fornecer um bônus total de +2d20.'
              },
              {
                'nex': 65,
                'n': 'Eu Conheço um Cara',
                't':
                  'Uma vez por missão, você pode ativar sua rede de contatos para pedir um favor, como por exemplo trocar todo 0 equipamento do seu grupo (como se tivesse uma segunda fase de preparacao de misao), conseguir um local de descanso ou mesmo ser resgatado de uma cena. O mestre tem a palavra final de quando é possivel usar essa habilidade e quais favores podem ser obtidos.'
              },
              {
                'nex': 99,
                'n': 'Truque de Mestre',
                't':
                  'Acostumado a uma vida de fingimento e manipulacao, você pode gastar 5 PE para simular o efeito de qualquer habilidade que você tenha visto um de seus aliados usar durante a cena. Você ignora os pré-requisitos da habilidade, mas ainda precisa pagar todos os seus custos, incluindo ações, PE e materiais, e ela usa os seus parametros de jogo, como se você estivesse usando a habilidade em questo.'
              }
            ]
          },
          {
            'n': 'Técnico',
            'prof':
              'Sua principal habilidade é a manutengdo e reparo do valioso equipamento que seu time carrega em missio. Seu conhecimento técnico também permite que improvise ferramentas com o que tiver a disposicao e sabote os itens usados por seus inimigos.',
            'ab': [
              {
                'nex': 10,
                'n': 'Inventário Otimizado',
                't':
                  'Você soma seu Intelecto a sua Força para calcular sua capacidade de carga. Por exemplo, se você tem Força 1 e Intelecto 3, seu inventário tem 20 espaços.'
              },
              {
                'nex': 40,
                'n': 'Remendão',
                't':
                  'Você pode gastar uma ação completa e 1 PE para remover a condição quebrado de um equipamento adjacente até o final da cena. Além disso, qualquer equipamento geral tem sua categoria reduzida em I para você.'
              },
              {
                'nex': 65,
                'n': 'Improvisar',
                't':
                  'Você pode improvisar equipamentos com materiais ao seu redor. Escolha um equipamento geral e gaste uma ação completa e 2 PE, mais 2 PE por categoria do item escolhido. Você cria uma versio funcional do equipamento, que segue suas regras de espaco e categoria como normal. Ao final da cena, seu equipamento improvisado se torna inutil.'
              },
              {
                'nex': 99,
                'n': 'Preparado para Tudo',
                't':
                  'Você sempre tem o que precisa para qualquer situação. Sempre que precisar de um item qualquer (exceto armas), pode gastar uma ação de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa! Depois de encontrado, o item segue normalmente as regras de inventario.'
              }
            ]
          }
        ],
        'eng': 'Engenhosidade (expert),'
      },
      'Ocultista': {
        'pow': [
          {
            'n': 'Camuflar Ocultismo',
            't':
              'Você pode gastar uma ação livre para esconder simbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invisiveis para outras pessoas além de você mesmo. Além disso, quando langa um ritual, pode gastar +2 PE para langa-lo sem usar componentes ritualisticos e sem gesticular (o que permite conjurar um ritual com as mios presas), usando apenas concentraao. Outros seres sé perceberao que você lancou uma ritual se passarem num teste de Ocultismo (DT 25).',
            'p': ''
          },
          {
            'n': 'Criar Selo',
            't':
              'Você sabe fabricar selos paranormais de rituais que conheca (veja.a pagina 151). Fabricar um selo gasta uma ação de interhidio e um ntimero de PE iguais ao custo de conjurar o ritual. Você pode ter um mimero máximo de selos criados a qualquer momento igual & sua Presença.',
            'p': ''
          },
          {
            'n': 'Envolto em Mistério',
            't':
              'Sua aparéncia e postura assombrosas 0 permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente você pode fazer e quem se encaixa nessa descrigao. Como regra geral, você recebe +5 em Enganacao e Intimidagao contra pessoas no treinadas em Ocultismo.',
            'p': ''
          },
          {
            'n': 'Especialista em Elemento',
            't':
              'Escolha um elemento. ADT para resistir aos seus rituais desse elemento aumenta em +2. z Ferramentas Paranormais. Você reduza categoria de um item paranormal em Le pode ativar itens paranormais sem pagar seu custo em PE. g Fluxo de Poder. Você pode manter dois efeitos sustentados de rituais ativos simultaneamente com apenas uma acio livre, pagando o custo de cada efeito separadamente.',
            'p': 'NEX 60%'
          },
          {
            'n': 'Guiado pelo Paranormal',
            't': 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigagao adicional.',
            'p': ''
          },
          {
            'n': 'Identificação Paranormal',
            't': 'Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.',
            'p': ''
          },
          {
            'n': 'Improvisar Componentes',
            't':
              'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigacao (DT 15). Se passar, encontra objetos que podem servir como componentes ritualisticos de um elemento a sua escolha. O mestre define se é possivel usar esse poder na cena atual.',
            'p': ''
          },
          {
            'n': 'Intuição Paranormal',
            't':
              'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (a sua escolha).',
            'p': ''
          },
          {
            'n': 'Mestre em Elemento',
            't': 'Escolha um elemento. O custo para lancar rituais desse elemento diminui em —1 PE.',
            'p': 'Especialista em Elemento no elemento escolhido, NEX 45%'
          },
          {
            'n': 'Ritual Potente',
            't': 'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais.',
            'p': 'Int 2'
          },
          {
            'n': 'Ritual Predileto',
            't':
              'Escolha um ritual que você conhece. Você reduz em —1 PE o custo do ritual. Essa redugdo se acumula com reducées fornecidas por outras fontes. z Tatuagem Ritualistica. Simbolos marcados em sua pele reduzem em ~1 PE 0 custo de rituais de alcance pessoal que tém você como alvo.',
            'p': ''
          },
          {
            'n': 'Transcender',
            't':
              'Escolha um poder paranormal (veja a pagina 114). Você recebe 0 poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder varias vezes.',
            'p': ''
          },
          {
            'n': 'Treinamento em Perícia',
            't':
              'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais jd 6 treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais j4 é veterano para se tornar expert. Você pode escolher este poder varias vezes.',
            'p': ''
          }
        ],
        'tr': [
          {
            'n': 'Conduíte',
            'prof':
              'Você domina os aspectos fundamentais da conjuracao de rituais e é capaz de aumentar o alcance e velocidade de suas conjuragées. Conforme sua conexao com as entidades paranormais aumenta você se torna capaz de interferir com os rituais de outros ocultistas.',
            'ab': [
              {
                'nex': 10,
                'n': 'Ampliar Ritual',
                't':
                  'Quando langa um ritual, você pode gastar +2 PE para aumentar seu alcance em um passo (de curto para médio, de médio para longo ou de longo para extremo) ou dobrar sua 4rea de efeito.'
              },
              {
                'nex': 40,
                'n': 'Acelerar Ritual',
                't':
                  'Uma vez por rodada, você pode aumentar o custo de um ritual em 4 PE para conjura-lo como uma ação livre.'
              },
              {
                'nex': 65,
                'n': 'Anular Ritual',
                't':
                  'Quando for alvo de um ritual, você pode gastar uma quantidade de PE igual ao custo pago por esse ritual e fazer um teste oposto de Ocultismo contra o conjurador. Se vencer, você anula o ritual, cancelando todos os seus efeitos.'
              },
              {'nex': 99, 'n': 'Canalizar o Medo', 't': 'Você aprende o ritual Canalizar o Medo.'}
            ]
          },
          {
            'n': 'Flagelador',
            'prof':
              'Dor é um poderoso catalisador paranormal e você aprendeua transformé-la em poder para seus ritu: Quando se torna especialmente poderoso, consegue usar a dor e 0 sofrimento de seus inimigos como instrumento de seus rituais ocultistas.',
            'ab': [
              {
                'nex': 10,
                'n': 'Poder do Flagelo',
                't':
                  'Ao conjurar um ritual, você pode gastar seus proprios pontos de vida para pagar o custo em pontos de esforgo, a taxa de 2 PV por PE pago. Pontos de vida gastos dessa forma s6 podem ser recuperados com descanso.'
              },
              {
                'nex': 40,
                'n': 'Abraçar a Dor',
                't':
                  'Sempre que sofrer dano não paranormal, você pode gastar uma reacio e 2 PE para reduzir esse dano a metade.'
              },
              {
                'nex': 65,
                'n': 'Absorver Agonia',
                't':
                  'Sempre que reduz um ou mais inimigos a 0 PV com um ritual, você recebe uma quantidade de PE temporarios igual ao circulo do ritual utilizado. Por exemplo, se ativar esse poder com um ritual de 2° circulo, recebera 2 PE.'
              },
              {'nex': 99, 'n': 'Medo Tangível', 't': 'Você aprende o ritual Medo Tangivel.'}
            ]
          },
          {
            'n': 'Graduado',
            'prof':
              'Você foca seus estudos em se tornar um conjurador versatile poderoso, conhecendo mais rituais que os outros ocultistas e sendo capaz de torna-los mais dificeis de serem resisti- dos. Seu objetivo é desvendar e dominar os segredos do Outro Lado, custe o que custar.',
            'ab': [
              {
                'nex': 10,
                'n': 'Saber Ampliado',
                't':
                  'Você aprende um ritual de 1° circulo, Toda vez que ganha acesso a um novo circulo, aprende um ritual adicional daquele circulo. Esses rituais não contam no seu limite de rituais.'
              },
              {
                'nex': 40,
                'n': 'Grimório Ritualístico',
                't':
                  'Você cria um grimério especial, que armazena rituais que sua mente não seria capaz de guardar. Você aprende uma quantidade de rituais de 1° ou 2° circulos igual ao seu Intelecto. Quando ganha acesso a um novo circulo, pode incluir um novo ritual desse circulo em seu grimério. Esses rituais nado contam em seu limite de rituais conhecidos. Para conjurar um ritual armazenado em seu grimério, você precisa antes empunhar o grimério e gastar uma ação completa o folheando para relembrando o ritual. O grimério ocupa 1 espaco em seu inventirio. Se perdé-lo, você pode replicé-lo com duas agées de interlidio.'
              },
              {'nex': 65, 'n': 'Rituais Eficientes', 't': 'A DT para resistir a todos os seus rituais aumenta em +5.'},
              {'nex': 99, 'n': 'Conhecendo o Medo', 't': 'Você aprende o ritual Conhecendo o Medo.'}
            ]
          },
          {
            'n': 'Intuitivo',
            'prof':
              'Assim como combatentes treinam seus corpos para resistir a traumas fisicos, você preparou sua mente para resistir aos efeitos do Outro Lado. Seu foco e força de vontade fazem com que você expanda os limites de suas capacidades paranormais.',
            'ab': [
              {
                'nex': 10,
                'n': 'Mente Sã',
                't':
                  'Você compreende melhor as entidades do Outro Lado, e passa aser menos abalado por seus efeitos. Você recebe resistência paranormal +5 (+5 em testes de resistência contra efeitos paranormais).'
              },
              {
                'nex': 40,
                'n': 'Presença Poderosa',
                't':
                  'Sua resiliéncia mental faz com que você possa extrair mais do Outro Lado. Você adiciona sua Presença ao seu limite de PE por turno, mas apenas para conjurar rituais (não para DT).'
              },
              {
                'nex': 65,
                'n': 'Inabalável',
                't':
                  'Você recebe resistência a dano mentale paranormal 10. Além disso, quando é alvo de um efeito paranormal que permite um teste de Vontade para reduzir co dano a metade, você não sofre dano algum se passar.'
              },
              {'nex': 99, 'n': 'Presença do Medo', 't': 'Você aprende o ritual Presença do Medo.'}
            ]
          },
          {
            'n': 'Lâmina Paranormal',
            'prof':
              'Alguns ocultistas preferem ficar fechados em suas bibliotecas estudando livros e rituais. Outros preferem investigar fenémenos paranormais em sua fonte. Ja você, prefere usar o paranormal como uma arma. Você aprendeu e dominou técnicas de luta mesclando suas habilidades de conjuracao com suas capacidades de combate.',
            'ab': [
              {
                'nex': 10,
                'n': 'Lâmina Maldita',
                't':
                  'Você aprende o ritual Amaldigoar Arma. Se jé 0 conhece, seu custo é reduzido em —1 PE. Além disso, quando conjura esse ritual, você pode usar Ocultismo, em vez de Luta ou Pontaria, para testes de ataque com a arma amaldicoada.'
              },
              {
                'nex': 40,
                'n': 'Gladiador Paranormal',
                't':
                  'Sempre que acerta um ataque corpo a corpo em um inimigo, você recebe 2 PE temporarios. Você pode ganhar um máximo de PE temporérios por cena igual ao seu limite de PE. PE temporarios desaparecem no final da cena.'
              },
              {
                'nex': 65,
                'n': 'Conjuração Marcial',
                't':
                  'Uma vez por rodada, quando você lanca um ritual com execugao de uma ação padrão, pode gastar 2 PE para fazer um ataque corpo a corpo como uma acio livre.'
              },
              {'nex': 99, 'n': 'Lâmina do Medo', 't': 'Você aprende o ritual Lamina do Medo.'}
            ]
          }
        ]
      },
      'PP': {
        'Conhecimento': [
          {
            'n': 'Expansão de Conhecimento',
            't': 'Permite adquirir um poder de classe de uma classe diferente da sua.',
            's': 'Aprende 1 poder de outra classe.',
            'p': 'Conhecimento 1',
            'a': 'Pode adquirir um segundo poder de classe de outra classe.',
            'as': 'Pode adquirir um segundo poder de classe de outra classe.'
          },
          {
            'n': 'Percepção Paranormal',
            't':
              'Ao procurar pistas em investigação, pode rerrolar um dado cujo resultado seja inferior a 5, ficando com a nova rolagem.',
            's': 'Procurar pistas: rerrola dado <5; mantém novo resultado.',
            'p': '',
            'a': 'Pode rerrolar dado com resultado inferior a 10.',
            'as': 'Pode rerrolar dado com resultado inferior a 10.'
          },
          {
            'n': 'Precognição',
            't': 'Recebe +5 nos testes de Esquiva contra ataques de adversários em alcance curto ou menor.',
            's': 'Esquiva +5 contra inimigos em alcance curto ou menor.',
            'p': 'Conhecimento 1',
            'a': 'O bônus passa a valer em qualquer distância e você não pode ficar Desprevenido.',
            'as': 'O bônus passa a valer em qualquer distância e você não pode ficar Desprevenido.'
          },
          {
            'n': 'Sensitivo',
            't':
              'Recebe +1d em testes de Diplomacia, Intimidação e Intuição para interpretar e influenciar emoções e intenções.',
            's': 'Diplomacia, Intimidação e Intuição: +1d.',
            'p': '',
            'a': 'Em testes opostos com essas perícias, adversário sofre –1d.',
            'as': 'Em testes opostos com essas perícias, adversário sofre –1d.'
          },
          {
            'n': 'Visão do Oculto',
            't': 'Enxerga normalmente na escuridão e ganha +1d em testes de Percepção relacionados à visão.',
            's': 'Visão no escuro; Percepção visual +1d.',
            'p': 'Conhecimento 2',
            'a': 'Reduz em uma categoria a camuflagem do alvo.',
            'as': 'Reduz em uma categoria a camuflagem do alvo.'
          }
        ],
        'Energia': [
          {
            'n': 'Afortunado',
            't':
              'Pode rerrolar um dado que tenha mostrado 1, exceto d20; cada dado só recebe essa chance uma vez por rolagem.',
            's': 'Rerrola 1 em dados que não sejam d20; uma vez por rolagem.',
            'p': '',
            'a': 'Uma vez por cena, também pode rerrolar resultado 1 em d20.',
            'as': 'Uma vez por cena, também pode rerrolar resultado 1 em d20.'
          },
          {
            'n': 'Sortudo',
            't':
              'Em investigação, a dificuldade de procurar pistas diminui uma categoria para você até encontrar uma pista.',
            's': 'Procurar pistas: DT –1 categoria até encontrar pista.',
            'p': '',
            'a': 'A redução de categoria da DT torna-se permanente.',
            'as': 'A redução de categoria da DT torna-se permanente.'
          },
          {
            'n': 'Golpe de Sorte',
            't': 'Dobra a margem de ameaça base de seus ataques, antes de outros aumentos.',
            's': 'Margem de ameaça dos ataques ×2 antes de outros bônus.',
            'p': 'Energia 2',
            'a': 'Acertos críticos recebem +1 dado de dano.',
            'as': 'Acertos críticos recebem +1 dado de dano.'
          },
          {
            'n': 'Manipular Entropia',
            't':
              'Uma vez por cena, pode fazer alvo em alcance curto rerrolar um dado de teste de perícia; deve decidir antes do mestre anunciar o resultado.',
            's': '1/cena; alvo curto: rerrola 1 dado de teste, antes do resultado.',
            'p': 'Energia 1',
            'a': 'Pode exigir rerrolagem de todos os dados do teste.',
            'as': 'Pode exigir rerrolagem de todos os dados do teste.'
          },
          {
            'n': 'Passou Raspando',
            't': 'Recebe um dado adicional em testes de Reflexos.',
            's': 'Reflexos +1d.',
            'p': 'Energia 1',
            'a': 'Reflexos +2d; sucesso em Reflexos que reduziria dano à metade passa a evitar todo dano.',
            'as': 'Reflexos +2d; sucesso em Reflexos que reduziria dano à metade passa a evitar todo dano.'
          }
        ],
        'Morte': [
          {
            'n': 'Encarar a Morte',
            't': 'Durante cenas de ação, aumenta em um ponto seu limite de PE por rodada.',
            's': 'Cena de ação: limite PE/rodada +1.',
            'p': '',
            'a': 'Limite PE/rodada +2.',
            'as': 'Limite PE/rodada +2.'
          },
          {
            'n': 'Escapar da Morte',
            't':
              'Uma vez por cena, quando um dano deixaria você com 0 PV ou menos, permanece com 1 PV. Não funciona contra dano massivo.',
            's': '1/cena: dano fatal → fica com 1 PV; exceto dano massivo.',
            'p': 'Morte 1',
            'a': 'Em vez disso evita todo o dano; contra dano massivo, fica com 1 PV.',
            'as': 'Em vez disso evita todo o dano; contra dano massivo, fica com 1 PV.'
          },
          {
            'n': 'Potencial Aprimorado',
            't':
              'Ganha +1 PE por nível de NEX de 5% (por exemplo, NEX 30% concede 6 PE), aumentando o bônus em 1 a cada novo avanço.',
            's': 'PE máximos +1 por nível de 5% NEX (NEX30% = +6 PE).',
            'p': 'Morte 1',
            'a': 'Bônus passa a +2 PE por nível de NEX.',
            'as': 'Bônus passa a +2 PE por nível de NEX.'
          },
          {
            'n': 'Potencial Reaproveitado',
            't':
              'Uma vez por rodada, ao vencer um teste de resistência, recebe 1 PE temporário, que expira no fim da cena.',
            's': '1/rodada: sucesso em resistência → +1 PE temporário.',
            'p': '',
            'a': 'Recebe 2 PE temporários.',
            'as': 'Recebe 2 PE temporários.'
          },
          {
            'n': 'Surto Temporal',
            't': 'Uma vez por cena, durante seu turno, pode realizar uma ação padrão extra.',
            's': '1/cena: +1 ação padrão no turno.',
            'p': 'Morte 2',
            'a': 'Em vez de uma ação, realiza um turno inteiro adicional ao fim do turno atual.',
            'as': 'Em vez de uma ação, realiza um turno inteiro adicional ao fim do turno atual.'
          }
        ],
        'Sangue': [
          {
            'n': 'Anatomia Insana',
            't':
              'Ao sofrer dano adicional de crítico ou Ataque Furtivo, tem 50% de chance de ignorar apenas esse dano adicional, determinado por resultado par em 1d4.',
            's': '50% (1d4 par) de ignorar dano extra de crítico/ataque furtivo.',
            'p': 'Sangue 1',
            'a': 'Imune aos efeitos de crítico e ataque furtivo.',
            'as': 'Imune aos efeitos de crítico e ataque furtivo.'
          },
          {
            'n': 'Arma de Sangue',
            't':
              'Pode gastar 2 PV para criar arma corporal leve especial de sangue até o fim da cena. Ao atacar, pode gastar 1 PE para fazer um ataque corpo a corpo adicional com essa arma.',
            's': '2 PV: cria arma de Sangue até fim da cena; ao atacar, 1 PE → +1 ataque com ela.',
            'p': '',
            'a': 'Arma torna-se permanente e passa a causar dano de Sangue.',
            'as': 'Arma torna-se permanente e passa a causar dano de Sangue.'
          },
          {
            'n': 'Sangue de Ferro',
            't': 'Recebe +3 PV e +1 PV por nível de NEX de 5%; o bônus cresce com o avanço do personagem.',
            's': 'PV máximos +3 +1 por nível de 5% NEX.',
            'p': '',
            'a': 'Imunidade a venenos e doenças.',
            'as': 'Imunidade a venenos e doenças.'
          },
          {
            'n': 'Sangue Fervente',
            't':
              'Enquanto estiver Machucado, recebe +1 em um dos atributos físicos Agilidade, Força ou Vigor, escolhido quando obtém o poder.',
            's': 'Machucado: +1 em AGI, FOR ou VIG escolhido.',
            'p': 'Sangue 2',
            'a': 'Além do +1 inicial, recebe +1 em outros dois atributos físicos à escolha (AGI, FOR ou VIG).',
            'as': 'Além do +1 inicial, recebe +1 em outros dois atributos físicos à escolha (AGI, FOR ou VIG).'
          },
          {
            'n': 'Sangue Vivo',
            't':
              'Na primeira vez que fica Machucado em uma cena, recebe Cura Acelerada 2. A regeneração não pode ultrapassar metade de seus PV máximos e termina se deixar de estar Machucado.',
            's': '1ª vez Machucado/cena: Cura Acelerada 2; máximo metade dos PV; termina se deixar Machucado.',
            'p': 'Sangue 1',
            'a': 'Cura Acelerada 5 e imunidade a traumas físicos enquanto o efeito estiver ativo.',
            'as': 'Cura Acelerada 5 e imunidade a traumas físicos enquanto o efeito estiver ativo.'
          }
        ]
      }
    };
