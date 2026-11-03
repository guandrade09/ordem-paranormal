/**
 * Dados do livro: poderes paranormais por elemento.
 */

// Poderes paranormais por elemento
const CPW = {
  'Combatente': [
    {
      'n': 'Acuidade com Arma',
      't':
        'Permite substituir Força por Agilidade nos testes de ataque e nas rolagens de dano ao usar uma arma corpo a corpo leve ou arma de arremesso.',
      's': 'Arma leve ou arremesso: AGI no lugar de FOR para ataque e dano.',
      'p': 'Agi 2'
    },
    {
      'n': 'Armamento Pesado',
      't':
        'Concede proficiência com armas pesadas, permitindo utilizá-las sem a penalidade associada à falta de proficiência.',
      's': 'Proficiência com armas pesadas.',
      'p': 'For 2'
    },
    {
      'n': 'Ataque de Oportunidade',
      't':
        'Quando um inimigo sai voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para atacá-lo.',
      's': 'Inimigo sai voluntariamente de espaço adjacente → reação + 1 PE: 1 ataque.',
      'p': ''
    },
    {
      'n': 'Combater com Duas Armas',
      't':
        'Ao executar a ação Agredir portando duas armas, das quais ao menos uma seja leve, você pode atacar uma vez com cada arma. Em troca, sofre penalidade de –1 dado em todos os testes de ataque até o próximo turno.',
      's': 'Agredir com 2 armas (≥1 leve) → 2 ataques, –1d em ataques até próximo turno.',
      'p': 'Agi 3, treinado em Luta ou Pontaria'
    },
    {
      'n': 'Combate Defensivo',
      't':
        'Ao usar a ação Agredir, você pode escolher uma postura defensiva: sofre –1 dado em todos os testes de ataque até seu próximo turno, mas recebe +5 na Defesa nesse período.',
      's': 'Ao Agredir: –1d em ataques e Defesa +5 até próximo turno.',
      'p': 'Int 2'
    },
    {
      'n': 'Golpe Demolidor',
      't':
        'Ao executar a manobra Quebrar ou atacar um objeto, pode gastar 1 PE para acrescentar dois dados de dano do mesmo tipo dos dados de sua arma.',
      's': 'Contra objetos/manobra Quebrar: 1 PE → +2 dados de dano da arma.',
      'p': 'For 2, treinado em Luta'
    },
    {
      'n': 'Golpe Pesado',
      't': 'O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo.',
      's': 'Armas corpo a corpo: +1 dado de dano do mesmo tipo.',
      'p': ''
    },
    {
      'n': 'Incansável',
      't':
        'Uma vez por cena, pode gastar 2 PE para realizar uma ação de investigação adicional, desde que utilize Força ou Agilidade como atributo-base do teste dessa ação.',
      's': '1 vez/cena: 2 PE → +1 ação de investigação; teste baseado em FOR ou AGI.',
      'p': ''
    },
    {
      'n': 'Presteza Atlética',
      't':
        'Ao fazer um teste para Facilitar a Investigação, pode gastar 1 PE e utilizar Força ou Agilidade no lugar do atributo-base da perícia. Se obtiver sucesso, o próximo aliado que aproveitar o bônus também recebe +1 dado no teste.',
      's': 'Facilitar Investigação: 1 PE → usa FOR/AGI; sucesso concede +1d adicional ao próximo aliado beneficiado.',
      'p': ''
    },
    {
      'n': 'Proteção Pesada',
      't': 'Concede proficiência com proteções pesadas. Só pode ser selecionado a partir de NEX 30%.',
      's': 'Proficiência com proteções pesadas.',
      'p': 'NEX 30%'
    },
    {
      'n': 'Reflexos Defensivos',
      't': 'Você recebe +2 em Defesa e em testes de resistência.',
      's': 'Defesa e testes de resistência +2.',
      'p': 'Agi 2'
    },
    {
      'n': 'Saque Rápido',
      't':
        'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre.',
      's':
        'Sacar/guardar itens: ação livre. Regra opcional de munição: 1×/rodada recarrega arma de disparo como ação livre.',
      'p': 'treinado em Iniciativa'
    },
    {
      'n': 'Segurar o Gatilho',
      't':
        'Ao acertar um ataque com arma de fogo, pode realizar outro contra o mesmo alvo. O primeiro ataque extra custa 1 PE, o segundo custa 2 PE e assim sucessivamente, conforme o número de ataques já realizados no turno. A sequência termina quando não houver PE disponível dentro do limite por rodada ou quando a arma precisar ser recarregada.',
      's':
        'Após acerto com arma de fogo: ataque extra no mesmo alvo; custos sucessivos 1, 2, 3… PE. Limitado por PE/rodada e munição.',
      'p': 'NEX 60%'
    },
    {
      'n': 'Sentido Tático',
      't':
        'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena.',
      's': 'Movimento + 2 PE: Defesa e resistências +Intelecto até o fim da cena.',
      'p': 'Int 2, treinado em Percepção e Tática'
    },
    {
      'n': 'Tanque de Guerra',
      't': 'Quando usa uma proteção pesada, aumenta em +2 a Defesa e em +2 a resistência a dano concedidas por ela.',
      's': 'Com proteção pesada: Defesa fornecida +2 e RD fornecida +2.',
      'p': 'Proteção Pesada'
    },
    {
      'n': 'Tiro Certeiro',
      't':
        'Ao utilizar uma arma de disparo, acrescenta sua Agilidade ao dano e ignora a penalidade de disparar contra alvos envolvidos em combate corpo a corpo, mesmo sem utilizar Mirar.',
      's': 'Arma de disparo: dano +AGI; ignora penalidade de tiro em combate corpo a corpo.',
      'p': 'treinado em Pontaria'
    },
    {
      'n': 'Tiro de Cobertura',
      't':
        'Gasta uma ação padrão e 1 PE para disparar em direção a um alvo dentro do alcance da arma de fogo, visando suprimi-lo, não causar dano. Faz Pontaria contra Vontade. Se vencer, até o início do próximo turno o alvo não pode sair de sua posição e sofre –5 em ataques. O mestre pode conceder +5 à Vontade do alvo se permanecer no lugar for muito perigoso. É um efeito de medo.',
      's':
        'Padrão + 1 PE; Pontaria × Vontade. Vitória: alvo imóvel na posição e –5 em ataques até início do próximo turno. Medo; Vontade +5 em local extremamente perigoso, a critério do mestre.',
      'p': ''
    },
    {
      'n': 'Transcender',
      't':
        'Escolha um poder paranormal e receba seus benefícios, sofrendo a perda de Sanidade prevista pelas regras de Transcender. Pode escolher este poder mais de uma vez, adquirindo poderes paranormais adicionais conforme os requisitos aplicáveis.',
      's': 'Recebe 1 poder paranormal; aplica perda de SAN. Pode escolher várias vezes.',
      'p': ''
    },
    {
      'n': 'Treinamento em Perícia',
      't':
        'Escolha duas perícias e torne-se treinado nelas. A partir de NEX 35%, pode escolher perícias nas quais já seja treinado para elevá-las a veterano. A partir de NEX 70%, pode elevar perícias veteranas a expert. Pode escolher este poder várias vezes.',
      's': 'Escolhe 2 perícias: treinado; em NEX ≥35% pode elevar treinado→veterano; ≥70% veterano→expert. Repetível.',
      'p': ''
    },
    {
      'n': 'Artista Marcial',
      't':
        'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
      's': 'Ataques desarmados: 1d6 letal, ágeis; 1d8 em NEX 35%, 1d10 em NEX 70%.',
      'p': ''
    }
  ],
  'Especialista':
    [
      {
        'n': 'Acuidade com Arma',
        't':
          'Permite substituir Força por Agilidade nos testes de ataque e dano com armas corpo a corpo leves ou de arremesso.',
        's': 'AGI substitui FOR em ataque e dano com arma leve ou arremesso.',
        'p': 'Agi 2'
      },
      {
        'n': 'Balística Avançada',
        't':
          'Concede proficiência com armas táticas de fogo e acrescenta +2 às rolagens de dano feitas com essas armas.',
        's': 'Proficiência com armas táticas de fogo; dano +2 com elas.',
        'p': ''
      },
      {
        'n': 'Conhecimento Aplicado',
        't':
          'Quando realiza um teste de perícia que não seja Luta ou Pontaria, pode gastar 2 PE para utilizar Intelecto como atributo-base no lugar do atributo habitual.',
        's': '2 PE → usa INT no teste de perícia, exceto Luta/Pontaria.',
        'p': 'Int 2'
      },
      {
        'n': 'Hacker',
        't':
          'Recebe +5 em testes de Tecnologia para invadir sistemas. Também pode executar a invasão de qualquer sistema em uma ação completa, independentemente da DT.',
        's': 'Hackear: Tecnologia +5; tempo de invasão = ação completa.',
        'p': 'treinado em Tecnologia'
      },
      {
        'n': 'Mãos Rápidas',
        't': 'Ao realizar um teste de Crime, pode pagar 1 ponto de esforço para executar a atividade como ação livre.',
        's': 'Teste de Crime: 1 PE → ação livre.',
        'p': 'Agi 3, treinado em Crime'
      },
      {
        'n': 'Mochila de Utilidades',
        't': 'Um item à sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.',
        's': '1 item (exceto arma): categoria –1 e –1 espaço.',
        'p': ''
      },
      {
        'n': 'Movimento Tático',
        't':
          'Pode gastar 1 PE para ignorar a penalidade de deslocamento de terreno difícil e receber deslocamento de escalada igual ao seu deslocamento normal até o final do turno.',
        's': '1 PE → ignora terreno difícil e ganha escalada = deslocamento até fim do turno.',
        'p': 'treinado em Atletismo'
      },
      {
        'n': 'Na Trilha Certa',
        't':
          'Quando obtém sucesso em um teste para procurar pistas durante uma cena de interação, pode gastar 1 PE para receber +1 dado no próximo teste. O bônus e o custo são cumulativos: após um segundo sucesso, pode gastar 2 PE para acumular +2 dados no teste seguinte, e assim por diante.',
        's':
          'Sucesso ao procurar pistas em cena de interação: 1 PE → +1d no próximo teste; acúmulos posteriores custam 2 PE/+2d, 3 PE/+3d etc.',
        'p': ''
      },
      {
        'n': 'Nerd',
        't':
          'Uma vez por cena, pode gastar 2 PE e fazer Atualidades DT 20. Em caso de sucesso, obtém do mestre uma informação útil à cena, como uma pista investigativa ou uma vulnerabilidade de inimigo.',
        's': '1 vez/cena: 2 PE + Atualidades DT 20 → informação útil para a cena.',
        'p': ''
      },
      {
        'n': 'Ninja Urbano',
        't': 'Concede proficiência com armas táticas corpo a corpo e +2 nas rolagens de dano realizadas com elas.',
        's': 'Proficiência com armas táticas corpo a corpo; dano +2 com elas.',
        'p': ''
      },
      {
        'n': 'Pensamento Ágil',
        't':
          'Uma vez por rodada, durante uma cena de investigação, pode gastar 2 PE para realizar uma ação adicional de procurar pistas.',
        's': '1 vez/rodada em investigação: 2 PE → +1 ação de procurar pistas.',
        'p': ''
      },
      {
        'n': 'Perito em Explosivos',
        't':
          'Acrescenta seu Intelecto à DT dos testes de resistência contra explosivos que você utiliza. Além disso, pode excluir dos efeitos da explosão um número de alvos igual ao seu Intelecto.',
        's': 'Explosivos: DT de resistência +INT; exclui até INT alvos da explosão.',
        'p': ''
      },
      {
        'n': 'Primeira Impressão',
        't':
          'Recebe +2 dados no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em cada cena.',
        's': 'Primeiro teste social da cena (Diplomacia/Enganação/Intimidação/Intuição): +2d.',
        'p': ''
      },
      {
        'n': 'Transcender',
        't':
          'Escolha um poder paranormal e receba seus benefícios, sofrendo a perda de Sanidade prevista pelas regras de Transcender. Pode escolher este poder mais de uma vez, adquirindo poderes paranormais adicionais conforme os requisitos aplicáveis.',
        's': 'Recebe 1 poder paranormal; aplica perda de SAN. Pode escolher várias vezes.',
        'p': ''
      },
      {
        'n': 'Treinamento em Perícia',
        't':
          'Escolha duas perícias e torne-se treinado nelas. A partir de NEX 35%, pode escolher perícias nas quais já seja treinado para elevá-las a veterano. A partir de NEX 70%, pode elevar perícias veteranas a expert. Pode escolher este poder várias vezes.',
        's':
          'Escolhe 2 perícias: treinado; em NEX ≥35% pode elevar treinado→veterano; ≥70% veterano→expert. Repetível.',
        'p': ''
      }
    ],
  'Ocultista': [
    {
      'n': 'Camuflar Ocultismo',
      't':
        'Pode usar ação livre para ocultar símbolos e sigilos gravados na pele ou em objetos, tornando-os invisíveis a outras pessoas. Ao lançar um ritual, pode pagar 2 PE adicionais para dispensar gestos e fala, conjurando apenas com concentração, mesmo amarrado ou amordaçado. Observadores precisam passar em Ocultismo DT 20 para perceber a conjuração.',
      's':
        'Ação livre: oculta símbolos/sigilos. Ritual +2 PE: dispensa gestos/fala; perceber conjuração exige Ocultismo DT 20.',
      'p': ''
    },
    {
      'n': 'Envolto em Mistério',
      't':
        'Sua aparência e postura podem influenciar pessoas supersticiosas ou desconhecedoras do paranormal. Como orientação geral, recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo; o mestre decide a aplicação contextual.',
      's': 'Enganação +5 e Intimidação +5 contra pessoas sem treinamento em Ocultismo; aplicação depende do mestre.',
      'p': ''
    },
    {
      'n': 'Especialista em Elemento',
      't':
        'Escolha um elemento paranormal. A DT dos testes de resistência contra seus rituais desse elemento aumenta em 2 pontos.',
      's': 'Escolhe elemento: DT de resistência dos rituais desse elemento +2.',
      'p': ''
    },
    {
      'n': 'Ferramentas Paranormais',
      't':
        'Uma vez por cena, pode ativar um equipamento paranormal sem pagar o custo de ativação. Custos de manutenção cobrados por rodada ainda precisam ser pagos normalmente.',
      's': '1 vez/cena: ativação de equipamento paranormal sem custo inicial; custos por rodada permanecem.',
      'p': ''
    },
    {
      'n': 'Fluxo de Poder',
      't':
        'Pode sustentar simultaneamente dois efeitos de rituais com uma única ação livre, desde que pague separadamente o custo de manutenção de cada efeito.',
      's': '1 ação livre mantém 2 rituais sustentados; paga PE de ambos.',
      'p': 'NEX 60%'
    },
    {
      'n': 'Guiado pelo Paranormal',
      't': 'Uma vez por cena, pode gastar 2 PE para executar uma ação de investigação adicional.',
      's': '1 vez/cena: 2 PE → +1 ação de investigação.',
      'p': ''
    },
    {
      'n': 'Identificação Paranormal',
      't': 'Recebe +10 nos testes de Ocultismo feitos para identificar criaturas, objetos ou rituais.',
      's': 'Ocultismo +10 para identificar criatura, objeto ou ritual.',
      'p': ''
    },
    {
      'n': 'Intuição Paranormal',
      't':
        'Quando utiliza a ação Facilitar Investigação, acrescenta seu Intelecto ou sua Presença ao teste, escolhendo um dos dois atributos.',
      's': 'Facilitar Investigação: soma INT ou PRE ao teste.',
      'p': ''
    },
    {
      'n': 'Mestre em Elemento',
      't':
        'Escolha um elemento para o qual já possui Especialista em Elemento. O custo para conjurar rituais desse elemento é reduzido em 1 PE.',
      's': 'Rituais do elemento escolhido: custo –1 PE.',
      'p': 'Especialista em Elemento, NEX 45%'
    },
    {
      'n': 'Ritual Potente',
      't': 'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais.',
      's': 'Rituais: dano ou cura +Intelecto.',
      'p': 'Int 2'
    },
    {
      'n': 'Ritual Predileto',
      't':
        'Escolha um ritual que você conhece. O custo desse ritual é reduzido em 1 PE, e essa redução pode se acumular com outras reduções de custo aplicáveis.',
      's': '1 ritual conhecido: custo –1 PE; acumula com outras reduções.',
      'p': ''
    },
    {
      'n': 'Tatuagem Ritualística',
      't':
        'Símbolos inscritos em sua pele reduzem em 1 PE o custo de rituais de alcance pessoal que tenham você como alvo.',
      's': 'Rituais de alcance pessoal direcionados a si: custo –1 PE.',
      'p': ''
    },
    {
      'n': 'Transcender',
      't':
        'Escolha um poder paranormal e receba seus benefícios, sofrendo a perda de Sanidade prevista pelas regras de Transcender. Pode escolher este poder mais de uma vez, adquirindo poderes paranormais adicionais conforme os requisitos aplicáveis.',
      's': 'Recebe 1 poder paranormal; aplica perda de SAN. Pode escolher várias vezes.',
      'p': ''
    },
    {
      'n': 'Treinamento em Perícia',
      't':
        'Escolha duas perícias e torne-se treinado nelas. A partir de NEX 35%, pode escolher perícias nas quais já seja treinado para elevá-las a veterano. A partir de NEX 70%, pode elevar perícias veteranas a expert. Pode escolher este poder várias vezes.',
      's': 'Escolhe 2 perícias: treinado; em NEX ≥35% pode elevar treinado→veterano; ≥70% veterano→expert. Repetível.',
      'p': ''
    },
    {
      'n': 'Criar Selo',
      't':
        'Você sabe fabricar selos paranormais de rituais que conheça (veja a página 151). Fabricar um selo gasta uma ação de interlúdio e um número de PE igual ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados a qualquer momento igual à sua Presença.',
      's': 'Fabrica selos de rituais conhecidos (ação de interlúdio, PE = custo do ritual); máx. de selos = Presença.',
      'p': ''
    },
    {
      'n': 'Improvisar Componentes',
      't':
        'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.',
      's': '1×/cena: ação completa + Investigação DT 15 → acha componentes ritualísticos de um elemento.',
      'p': ''
    }
  ]
};
Object.keys(CPW).forEach(cl => {
  let L = D[cl].pow;
  CPW[cl].forEach(x => {
    let p = L.find(z => z.n == x.n);
    if (p) {
      p.t = x.t;
      p.s = x.s;
      p.p = x.p
    } else
      L.push({n: x.n, t: x.t, s: x.s, p: x.p})
  });
  L.sort((a, b) => a.n.localeCompare(b.n, 'pt'))
});
