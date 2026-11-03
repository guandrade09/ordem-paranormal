/**
 * Dados do livro: trilhas (habilidades por NEX).
 */

// Trilhas
const TRN =
  {
    'Aniquilador': {
      'esp': 'arma favorita, acertos críticos e dano.',
      'pre': '',
      'ab': {
        'A Favorita': {
          'nex': 10,
          't':
            'Escolha uma arma como sua favorita, como uma katana ou um fuzil de assalto. A categoria da arma escolhida é reduzida em I. A redução aumenta para II em NEX 40% (Técnica Secreta) e para III em NEX 99% (Máquina de Matar). A categoria não pode ficar abaixo de zero.',
          's': 'Arma favorita: categoria −I (10%), −II (40%), −III (99%); mínimo 0.'
        },
        'Técnica Secreta': {
          'nex': 40,
          't':
            'A categoria da arma favorita passa a ser reduzida em II. Quando ataca com ela, pode gastar 2 PE para aplicar um efeito especial ao ataque. **Amplo:** o ataque também pode atingir um alvo adicional ao alcance da arma e adjacente ao alvo original, usando o mesmo teste de ataque. **Destruidor:** aumenta o multiplicador de crítico da arma em +1. É possível adicionar mais efeitos pagando +2 PE por efeito.',
          's':
            'Ataque com arma favorita: 2 PE por efeito. **Amplo:** +1 alvo adjacente ao original (mesmo teste); **Destruidor:** multiplicador crítico +1.'
        },
        'Técnica Sublime': {
          'nex': 65,
          't':
            'Acrescenta duas opções à Técnica Secreta. **Letal:** aumenta a margem de ameaça em +2; pode ser escolhido duas vezes, passando a conceder +5 no total. **Perfurante:** ignora até 5 pontos de RD de qualquer tipo do alvo. Aplicam-se os custos da Técnica Secreta.',
          's':
            'Novos efeitos (2 PE por efeito): **Letal:** margem +2, ou +5 se escolhido duas vezes; **Perfurante:** ignora 5 RD.'
        },
        'Máquina de Matar': {
          'nex': 99,
          't':
            'A categoria da arma favorita passa a ser reduzida em III. Além disso, ela recebe permanentemente +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo, sem custo adicional de PE.',
          's': 'Arma favorita: categoria −III; margem de ameaça +2; dano +1 dado do mesmo tipo. Passivo.'
        }
      }
    },
    'Comandante de Campo': {
      'esp': 'liderança, ações adicionais e coordenação tática.',
      'pre': '',
      'ab': {
        'Inspirar Confiança': {
          'nex': 10,
          't':
            'Pode gastar uma reação e 2 PE para permitir que um aliado em alcance curto role novamente um teste que acabou de realizar.',
          's': 'Reação + 2 PE: aliado em alcance curto repete teste recém-realizado.'
        },
        'Estrategista': {
          'nex': 40,
          't':
            'Gaste uma ação padrão e 1 PE por aliado escolhido em alcance curto, até o máximo de aliados igual ao seu INT. No próximo turno de cada aliado afetado, ele recebe uma ação de movimento adicional.',
          's': 'Ação padrão + 1 PE/aliado; alcance curto; até INT aliados; +1 ação de movimento no próximo turno deles.'
        },
        'Brecha na Guarda': {
          'nex': 65,
          't':
            'Uma vez por rodada, quando um aliado causa dano a um inimigo em seu alcance curto, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance curto realize um ataque adicional contra esse mesmo inimigo. Além disso, o alcance de Inspirar Confiança e Estrategista aumenta para médio.',
          's':
            '1 vez/rodada; aliado causa dano → reação + 2 PE → você ou outro aliado em alcance curto faz +1 ataque contra o mesmo alvo. Alcance de Inspirar Confiança e Estrategista passa a médio.'
        },
        'Oficial Comandante': {
          'nex': 99,
          't':
            'Gaste uma ação completa e 5 PE para conceder uma ação padrão adicional, no próximo turno, a cada aliado que você possa ver em alcance médio.',
          's': 'Ação completa + 5 PE: aliados visíveis em alcance médio recebem +1 ação padrão no próximo turno.'
        }
      }
    },
    'Guerreiro': {
      'esp': 'combate corpo a corpo, manobras e contra-ataques.',
      'pre': '',
      'ab': {
        'Técnica Letal': {
          'nex': 10,
          't': 'Todos os seus ataques corpo a corpo recebem +2 na margem de ameaça, sem custo de PE.',
          's': 'Ataques corpo a corpo: margem de ameaça +2. Passivo.'
        },
        'Revidar': {
          'nex': 40,
          't':
            'Quando utiliza a defesa especial Bloquear, pode gastar uma reação e 2 PE para realizar um ataque corpo a corpo contra o inimigo que realizou o ataque, desde que esteja ao alcance.',
          's': 'Após Bloquear: reação + 2 PE → ataque corpo a corpo contra agressor ao alcance.'
        },
        'Força Opressora': {
          'nex': 65,
          't':
            'Quando acerta um ataque corpo a corpo, pode gastar 1 PE para tentar uma manobra Derrubar ou Empurrar como ação livre. Ao **Empurrar**, recebe +5 no teste da manobra para cada 10 pontos de dano causados pelo ataque. Ao **Derrubar**, se vencer a manobra, pode gastar mais 1 PE para realizar imediatamente um ataque adicional contra o alvo derrubado.',
          's':
            'Acerto corpo a corpo + 1 PE → manobra livre. **Empurrar:** +5 no teste a cada 10 de dano; **Derrubar:** se vencer, +1 PE → ataque adicional.'
        },
        'Potência Máxima': {
          'nex': 99,
          't':
            'Ao usar Ataque Especial com armas corpo a corpo, dobra os bônus numéricos obtidos com essa habilidade após distribuí-los. Por exemplo, bônus de +10 no ataque e +5 no dano passam a +20 e +10, respectivamente.',
          's': 'Ataque Especial corpo a corpo: bônus numéricos ×2 após distribuição.'
        }
      }
    },
    'Operações Especiais': {
      'esp': 'iniciativa, ataques adicionais e economia de ações.',
      'pre': '',
      'ab': {
        'Iniciativa Aprimorada': {
          'nex': 10,
          't':
            'Recebe bônus permanente de +5 em testes de Iniciativa e uma ação de movimento adicional na primeira rodada, sem gastar PE.',
          's': 'Iniciativa +5; +1 ação de movimento na primeira rodada. Passivo.'
        },
        'Ataque Extra': {
          'nex': 40,
          't':
            'Uma vez por rodada, quando realiza um ataque, pode gastar 2 PE para realizar um ataque adicional sem precisar gastar outra ação padrão.',
          's': '1 vez/rodada; ao atacar, 2 PE → +1 ataque.'
        },
        'Surto de Adrenalina': {
          'nex': 65,
          't':
            'Uma vez por rodada, pode gastar 5 PE para realizar uma ação adicional, escolhendo entre uma ação padrão ou uma ação de movimento.',
          's': '1 vez/rodada; 5 PE → +1 ação padrão **ou** de movimento.'
        },
        'Sempre Alerta': {
          'nex': 99,
          't':
            'No início de uma cena de combate, recebe uma ação padrão adicional. O benefício ocorre no início da cena, não em todas as rodadas.',
          's': '+1 ação padrão no início de cada cena de combate. Passivo.'
        }
      }
    },
    'Tropa de Choque': {
      'esp': 'PV, bloqueio, proteção de aliados e sobrevivência.',
      'pre': '',
      'ab': {
        'Casca Grossa': {
          'nex': 10,
          't':
            'Recebe 1 PV adicional para cada 5% de NEX. Além disso, ao usar Bloquear, soma seu valor de VIG à RD normalmente concedida pelo bloqueio.',
          's': '+1 PV por 5% NEX; ao Bloquear, RD adicional = VIG.'
        },
        'Cai Dentro': {
          'nex': 40,
          't':
            'Quando um inimigo em alcance curto ataca um aliado, pode gastar uma reação e 1 PE para tentar redirecionar o ataque a você. O inimigo realiza Vontade contra sua DT baseada em VIG; se falhar, deve atacar você. Você precisa estar em posição e alcance válidos para ser atacado. Se o inimigo passar no teste, fica imune a seu Cai Dentro até o fim da cena.',
          's':
            'Reação + 1 PE; inimigo em alcance curto ataca aliado → Vontade vs. DT VIG; falha: redireciona para você. Exige alcance válido; sucesso: imunidade até fim da cena.'
        },
        'Duro de Matar': {
          'nex': 65,
          't':
            'Quando sofre dano não paranormal, pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, também pode usar a habilidade para reduzir dano paranormal.',
          's': 'Reação + 2 PE → dano não paranormal ÷2; a partir de NEX 85%, também dano paranormal.'
        },
        'Inquebrável': {
          'nex': 99,
          't':
            'Enquanto estiver Machucado, recebe +5 na Defesa e RD 5. Enquanto estiver Morrendo, não fica Indefeso e ainda pode realizar ações, mas continua sujeito às regras normais de morte.',
          's': 'Machucado: Defesa +5 e RD 5. Morrendo: pode agir e não fica Indefeso; ainda pode morrer.'
        }
      }
    },
    'Atirador de Elite':
      {
        'esp': 'armas de fogo, críticos e manobras à distância.',
        'pre': '',
        'ab': {
          'Mira de Elite': {
            'nex': 10,
            't':
              'Recebe proficiência com armas de fogo longas e soma seu INT às rolagens de dano realizadas com essas armas. O bônus fixo não é multiplicado por acertos críticos.',
            's': 'Proficiência com armas de fogo longas; dano com elas +INT. Passivo.'
          },
          'Disparo Letal': {
            'nex': 40,
            't':
              'Quando realiza a ação Mirar, pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque realizado até o fim de seu próximo turno. Não altera o multiplicador de crítico.',
            's': 'Ao Mirar, 1 PE → margem de ameaça +2 no próximo ataque até fim do próximo turno (20 → 18–20).'
          },
          'Disparo Impactante': {
            'nex': 65,
            't':
              'Usando arma de fogo de calibre grosso, pode gastar 2 PE para realizar as manobras Derrubar, Desarmar, Empurrar ou Quebrar por meio de ataque à distância, respeitando as regras da manobra.',
            's': 'Arma de fogo calibre grosso + 2 PE → Derrubar, Desarmar, Empurrar ou Quebrar à distância.'
          },
          'Atirar para Matar': {
            'nex': 99,
            't':
              'Quando consegue um acerto crítico com arma de fogo, considera máximo o resultado dos dados de dano aplicáveis, sem rolá-los; bônus fixos são somados normalmente.',
            's': 'Crítico com arma de fogo → dano máximo dos dados.'
          }
        }
      },
    'Infiltrador': {
      'esp': 'furtividade, dano furtivo e eliminação de alvos.',
      'pre': '',
      'ab': {
        'Ataque Furtivo': {
          'nex': 10,
          't':
            'Uma vez por rodada, ao acertar um alvo Desprevenido com ataque corpo a corpo ou em alcance curto, ou um alvo que esteja flanqueando, pode gastar 1 PE para causar dano extra do mesmo tipo da arma. O bônus é +1d6 em NEX 10%, +2d6 em 40%, +3d6 em 65% e +4d6 em 99%. Os dados extras não são multiplicados pelo crítico da arma.',
          's':
            '1 vez/rodada; acerto contra Desprevenido ou flanqueado + 1 PE → +1d6 (10%), +2d6 (40%), +3d6 (65%), +4d6 (99%) do tipo da arma.'
        },
        'Gatuno': {
          'nex': 40,
          't':
            'Recebe +5 em Atletismo e Crime. Pode percorrer seu deslocamento normal ao se movimentar furtivamente e se esconder sem sofrer a penalidade de movimento aplicável, mas outras penalidades de Furtividade ainda podem existir.',
          's': 'Atletismo +5; Crime +5; esconder-se percorrendo deslocamento normal sem penalidade de movimento.'
        },
        'Assassinar': {
          'nex': 65,
          't':
            'Gaste uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, o primeiro Ataque Furtivo que causar dano a ele tem seus dados extras dobrados. Se o alvo sofrer dano desse ataque, deve passar em Fortitude contra sua DT baseada em AGI ou ficará Inconsciente ou Morrendo, à sua escolha.',
          's':
            'Movimento + 3 PE; alvo em alcance curto. Primeiro Ataque Furtivo com dano até fim do próximo turno: dados extras ×2. Fortitude vs. DT AGI; falha → Inconsciente ou Morrendo.'
        },
        'Sombra Fugaz': {
          'nex': 99,
          't':
            'Quando faz teste de Furtividade após atacar ou realizar outra ação chamativa, pode gastar 3 PE para ignorar a penalidade de −15 normalmente aplicada. Ainda precisa realizar o teste e cumprir as condições para se esconder.',
          's': '3 PE → ignora −15 em Furtividade após ataque ou ação chamativa.'
        }
      }
    },
    'Médico de Campo': {
      'esp': 'cura, condições, resgate e reanimação.',
      'pre': 'treinado em Medicina.',
      'ab': {
        'Paramédico': {
          'nex': 10,
          't':
            'Com ação padrão e 2 PE, cura 2d10 PV de aliado adjacente. Em NEX 40%, 65% e 99%, pode acrescentar 1d10 por patamar, pagando +1 PE por dado extra. Assim, pode chegar a 3d10 por 3 PE, 4d10 por 4 PE ou 5d10 por 5 PE, respectivamente.',
          's': 'Ação padrão; aliado adjacente: 2 PE/2d10 (10%); 3 PE/3d10 (40%); 4 PE/4d10 (65%); 5 PE/5d10 (99%).'
        },
        'Equipe de Trauma': {
          'nex': 40,
          't': 'Gaste uma ação padrão e 2 PE para remover uma condição negativa de aliado adjacente, exceto Morrendo.',
          's': 'Ação padrão + 2 PE → remove 1 condição negativa de aliado adjacente, exceto Morrendo.'
        },
        'Resgate': {
          'nex': 65,
          't':
            'Uma vez por rodada, se um aliado Machucado ou Morrendo estiver em alcance curto, pode aproximar-se dele como ação livre, percorrendo até seu deslocamento normal. Sempre que curar PV ou remover condição de um aliado, você e esse aliado recebem +5 na Defesa até o início do seu próximo turno. Além disso, o espaço ocupado por carregar outro personagem é reduzido pela metade para você.',
          's':
            '1 vez/rodada: aproximação livre de aliado Machucado/Morrendo em alcance curto (até deslocamento normal). Cura/remoção de condição → Defesa +5 para ambos. Carregar personagem: espaços ÷2.'
        },
        'Reanimação': {
          'nex': 99,
          't':
            'Uma vez por cena, gaste uma ação completa e 10 PE para trazer de volta à vida um personagem que morreu durante a mesma cena, exceto se a morte ocorreu por dano massivo.',
          's': '1 vez/cena; ação completa + 10 PE → revive morto da mesma cena, exceto morte por dano massivo.'
        }
      }
    },
    'Negociador': {
      'esp': 'influência social, apoio e contatos.',
      'pre': '',
      'ab': {
        'Eloquência': {
          'nex': 10,
          't':
            'Gaste uma ação completa e 1 PE por alvo em alcance curto. Faça Diplomacia, Enganação ou Intimidação contra a Vontade dos alvos. Quem perder fica Fascinado enquanto você mantiver concentração (ação padrão por rodada). Alvos hostis ou em combate recebem +5 na resistência e novo teste a cada rodada de concentração. Quem passar fica imune ao efeito por um dia.',
          's':
            'Ação completa + 1 PE/alvo; alcance curto; Diplomacia/Enganação/Intimidação vs. Vontade → Fascinado. Concentração: padrão/rodada. Hostis: Vontade +5 e reteste/rodada. Sucesso: imune 1 dia.'
        },
        'Discurso Motivador': {
          'nex': 40,
          't':
            'Gaste uma ação padrão e 4 PE para dar a você e aliados em alcance curto +1d20 em testes de perícia até o fim da cena. A partir de NEX 65%, pode gastar 8 PE para aumentar o benefício total a +2d20.',
          's': 'Ação padrão; alcance curto; duração cena. 4 PE → +1d20 nos testes de perícia; NEX 65%: 8 PE → +2d20.'
        },
        'Eu Conheço um Cara': {
          'nex': 65,
          't':
            'Uma vez por missão, pode acionar sua rede de contatos para pedir um favor relevante, como equipamento adicional, um local de descanso ou resgate. O mestre decide se e como o favor pode ser concedido.',
          's': '1 vez/missão → favor da rede de contatos; disponibilidade e limites definidos pelo mestre.'
        },
        'Truque de Mestre': {
          'nex': 99,
          't':
            'Gaste 5 PE para simular uma habilidade que viu um aliado utilizar durante a cena. Ignora pré-requisitos, mas deve pagar todos os custos da habilidade copiada, inclusive ações, PE e materiais. Use os parâmetros do seu próprio personagem.',
          's':
            '5 PE + custos originais → copia habilidade vista de aliado na cena; ignora pré-requisitos; usa seus parâmetros.'
        }
      }
    },
    'Técnico':
      {
        'esp': 'inventário, conserto e improvisação de equipamentos.',
        'pre': '',
        'ab': {
          'Inventário Otimizado': {
            'nex': 10,
            't':
              'Soma INT à FOR para determinar a capacidade de carga. Por exemplo, FOR 1 e INT 3 equivalem a 20 espaços de inventário sem sobrecarga, seguindo a regra geral de 5 espaços por ponto de atributo.',
            's': 'Capacidade de carga = 5 × (FOR + INT), respeitando regras de capacidade mínima e sobrecarga.'
          },
          'Remendão': {
            'nex': 40,
            't': 'Com uma ação completa e 1 PE, remove a condição Quebrado de um equipamento adjacente até o fim da cena. Além disso, qualquer equipamento geral tem a categoria reduzida em I para você, até o mínimo de zero.',
            's':
              'Ação completa + 1 PE → remove Quebrado de equipamento adjacente até fim da cena. Equipamento geral: categoria −I (mín. 0).'
          },
          'Improvisar': {
            'nex': 65,
            't':
              'Escolha um equipamento geral e gaste uma ação completa, 2 PE básicos e +2 PE por categoria do item. Você cria uma versão funcional do equipamento, que segue as regras normais de espaço e categoria. Ao final da cena, o equipamento improvisado se torna inútil.',
            's':
              'Ação completa + (2 PE + 2 PE × categoria) → equipamento geral improvisado até fim da cena; ocupa espaços normalmente.'
          },
          'Preparado para Tudo': {
            'nex': 99,
            't':
              'Sempre que precisar de um item qualquer, exceto armas, pode gastar uma ação de movimento e 3 PE por categoria do item para declarar que o havia guardado no fundo da bolsa. Depois de encontrado, o item segue normalmente as regras de inventário e capacidade de carga.',
            's':
              'Ação de movimento + 3 PE × categoria → encontra qualquer item (exceto armas) na bolsa; respeita espaços.'
          }
        }
      },
    'Conduíte': {
      'esp': 'alcance, velocidade e anulação de rituais.',
      'pre': '',
      'ab': {
        'Ampliar Ritual': {
          'nex': 10,
          't':
            'Ao conjurar ritual, pode gastar +2 PE para aumentar seu alcance em um passo (curto → médio → longo → extremo) ou dobrar sua área de efeito. Não aumenta dano, DT ou duração por si só.',
          's': '+2 PE ao conjurar → alcance +1 passo **ou** área ×2.'
        },
        'Acelerar Ritual': {
          'nex': 40,
          't':
            'Uma vez por rodada, pode gastar +4 PE ao conjurar um ritual para realizá-lo como ação livre, respeitando os demais custos e requisitos da conjuração.',
          's': '1 vez/rodada; +4 PE → ritual como ação livre.'
        },
        'Anular Ritual': {
          'nex': 65,
          't':
            'Quando for alvo de ritual, pode pagar PE igual ao custo efetivamente gasto pelo conjurador e realizar teste oposto de Ocultismo. Se vencer, anula o ritual e todos os seus efeitos.',
          's': 'Alvo de ritual → paga PE igual ao custo pago pelo conjurador; Ocultismo oposto; vitória → anula ritual.'
        },
        'Canalizar o Medo': {
          'nex': 99,
          't':
            'Aprende o ritual Canalizar o Medo. A execução, o custo, o alcance e os efeitos seguem a descrição do próprio ritual.',
          's': 'Aprende **Canalizar o Medo**; consultar ficha do ritual.'
        }
      }
    },
    'Flagelador': {
      'esp': 'sacrifício de PV e obtenção de PE temporários.',
      'pre': '',
      'ab': {
        'Poder do Flagelo': {
          'nex': 10,
          't':
            'Ao conjurar ritual, pode pagar parte ou todo o custo em PE gastando seus próprios PV na proporção de 2 PV por 1 PE substituído. Os PV gastos dessa forma só podem ser recuperados com descanso.',
          's': 'Ao conjurar: 2 PV = 1 PE substituído. PV gastos só recuperam com descanso.'
        },
        'Abraçar a Dor': {
          'nex': 40,
          't': 'Quando sofre dano não paranormal, pode gastar uma reação e 2 PE para reduzir esse dano à metade.',
          's': 'Reação + 2 PE → dano não paranormal ÷2.'
        },
        'Absorver Agonia': {
          'nex': 65,
          't':
            'Sempre que um ritual seu reduzir um ou mais inimigos a 0 PV, você recebe PE temporários em quantidade igual ao círculo do ritual. A quantidade não é multiplicada pelo número de inimigos atingidos pelo mesmo ritual.',
          's': 'Ritual reduz ≥1 inimigo a 0 PV → PE temporários = círculo do ritual.'
        },
        'Medo Tangível': {
          'nex': 99,
          't': 'Aprende o ritual Medo Tangível. Seus custos, requisitos e efeitos são os descritos na ficha do ritual.',
          's': 'Aprende **Medo Tangível**; consultar ficha do ritual.'
        }
      }
    },
    'Graduado': {
      'esp': 'mais rituais conhecidos, grimório e aumento de DT.',
      'pre': '',
      'ab': {
        'Saber Ampliado': {
          'nex': 10,
          't':
            'Aprende um ritual adicional de 1º círculo. Sempre que obtiver acesso a um círculo novo, aprende mais um ritual daquele círculo. Esses rituais não contam no limite de rituais conhecidos.',
          's': '+1 ritual de 1º círculo; +1 ritual ao desbloquear cada círculo novo (2º, 3º, 4º). Não contam no limite.'
        },
        'Grimório Ritualístico': {
          'nex': 40,
          't':
            'Cria um grimório especial que armazena rituais que sua mente não seria capaz de guardar: aprende rituais de 1º ou 2º círculo em quantidade igual ao seu INT. Quando ganha acesso a um novo círculo, pode incluir um novo ritual desse círculo no grimório. Esses rituais não contam no limite de rituais conhecidos. Para conjurar um ritual armazenado, precisa empunhar o grimório e gastar uma ação completa folheando-o para relembrar o ritual. O grimório ocupa 1 espaço no inventário; se for perdido, pode ser replicado com duas ações de interlúdio.',
          's':
            'Grimório: rituais de 1º/2º círculo = INT; +1 ritual ao ganhar novo círculo. Não contam no limite. Conjurar: empunhar + ação completa. Ocupa 1 espaço; replicável com 2 ações de interlúdio.'
        },
        'Rituais Eficientes': {
          'nex': 65,
          't': 'A DT dos testes de resistência contra todos os seus rituais aumenta em +5, sem custo de PE.',
          's': 'DT dos rituais +5. Passivo.'
        },
        'Conhecendo o Medo': {
          'nex': 99,
          't': 'Aprende o ritual Conhecendo o Medo, que segue suas próprias regras de conjuração e efeito.',
          's': 'Aprende **Conhecendo o Medo**; consultar ficha do ritual.'
        }
      }
    },
    'Intuitivo': {
      'esp': 'resistência paranormal, limite de PE e mitigação de dano mental.',
      'pre': '',
      'ab': {
        'Mente Sã': {
          'nex': 10,
          't':
            'Recebe +5 nos testes de resistência contra efeitos paranormais, sejam de Fortitude, Reflexos ou Vontade, quando aplicáveis. Não concede Defesa ou RD diretamente.',
          's': 'Resistência contra efeitos paranormais: +5 nos testes. Passivo.'
        },
        'Presença Poderosa': {
          'nex': 40,
          't':
            'Soma Presença ao limite de PE que pode gastar por rodada, exclusivamente para conjurar rituais. O aumento não se aplica a habilidades que não sejam rituais.',
          's': 'Limite de PE/rodada para rituais: +Presença.'
        },
        'Inabalável': {
          'nex': 65,
          't':
            'Recebe resistência a dano mental e paranormal 10. Quando um efeito paranormal permite teste de Vontade para reduzir dano à metade, um sucesso faz você não sofrer dano algum.',
          's':
            'RD mental/paranormal 10. Vontade bem-sucedida em efeito paranormal que reduziria dano à metade → 0 dano.'
        },
        'Presença do Medo': {
          'nex': 99,
          't': 'Aprende o ritual Presença do Medo, utilizando os custos e efeitos descritos na ficha do ritual.',
          's': 'Aprende Presença do Medo; consultar ficha do ritual.'
        }
      }
    },
    'Lâmina Paranormal': {
      'esp': 'armas amaldiçoadas, ataques com Ocultismo e combate corpo a corpo.',
      'pre': '',
      'ab': {
        'Lâmina Maldita': {
          'nex': 10,
          't':
            'Aprende o ritual Amaldiçoar Arma. Se já o conhece, seu custo é reduzido em 1 PE. Além disso, quando conjura esse ritual, pode usar Ocultismo, em vez de Luta ou Pontaria, nos testes de ataque com a arma amaldiçoada.',
          's':
            'Aprende **Amaldiçoar Arma**; se já conhece, custo −1 PE. Arma amaldiçoada: ataque com Ocultismo em vez de Luta/Pontaria.'
        },
        'Gladiador Paranormal': {
          'nex': 40,
          't':
            'Sempre que acerta ataque corpo a corpo contra inimigo, recebe 2 PE temporários. A quantidade total de PE temporários obtidos por essa habilidade em uma cena não pode superar seu limite de PE por rodada. Os pontos desaparecem ao fim da cena.',
          's':
            'Acerto corpo a corpo → +2 PE temporários. Total recebido na cena limitado ao limite de PE/rodada. Expiram no fim da cena.'
        },
        'Conjuração Marcial': {
          'nex': 65,
          't':
            'Uma vez por rodada, quando lança um ritual com execução de ação padrão, pode gastar 2 PE para realizar um ataque corpo a corpo como ação livre, além da conjuração.',
          's': '1 vez/rodada; conjura ritual de ação padrão + 2 PE → +1 ataque corpo a corpo como ação livre.'
        },
        'Lâmina do Medo': {
          'nex': 99,
          't':
            'Aprende o ritual Lâmina do Medo. Os custos, alcance, execução e efeitos seguem a ficha específica do ritual.',
          's': 'Aprende **Lâmina do Medo**; consultar ficha do ritual.'
        }
      }
    }
  };
Object.values(D).forEach(cl => (cl.tr || []).forEach(t => {
  let x = TRN[t.n];
  if (!x) return;
  t.esp = x.esp;
  if (x.pre) t.pre = x.pre;
  t.ab.forEach(a => {
    let y = x.ab[a.n];
    if (y) {
      a.t = y.t;
      a.s = y.s
    }
  })
}));
