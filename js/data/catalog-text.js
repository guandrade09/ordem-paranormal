/**
 * Textos e tabelas do catálogo: proficiências, descrições de itens, maldições e paranormais.
 */

const bul =
        (am, on) => {
          let [c, w, h] = AMC[am] || ['#aaa', 5, 12];
          return `<svg width=${w + 2} height=${h + 4} viewBox="0 0 ${w + 2} ${h + 4}" style="opacity:${
            on ? 1 : .3};filter:${on ? 'none' : 'grayscale(1)'}"><rect x=1 y=4 width=${w} height=${h} rx=1 fill="${
            c}" /><ellipse cx=${1 + w / 2} cy=4 rx=${w / 2} ry=3 fill="#b87333" /></svg>`
        },
      bulRow = (am, n, t) => `<span style="display:inline-flex;gap:1px;flex-wrap:wrap;align-items:flex-end">${
        Array.from({length: t}, (_, i) => bul(am, i < n)).join('')}</span>`;
const PRF = {
  Combatente: ['s', 't', 'l'],
  Especialista: ['s', 'l'],
  Ocultista: ['s']
},
      wg = n => SIM.includes(n) ? 's' :
  PES.includes(n)               ? 'h' :
                                  't',
      lack = (c, it) => {
        let p = PRF[c.classe] || [];
        if (it.w) {
          if (it.w.am == 'Balas longas' && hasAb(c, 'Mira de Elite')) return false;
          let g = wg(it.n);
          if (g == 't' && hasAb(c, 'Balística Avançada') && isFire(it.w)) return false;
          if (g == 't' && it.w.m && hasAb(c, 'Ninja Urbano')) return false;
          return g == 'h' ? !hasAb(c, 'Armamento Pesado') : !p.includes(g)
        }
        if (it.n == 'Proteção leve') return !p.includes('l');
        if (it.n == 'Proteção pesada') return !hasAb(c, 'Proteção Pesada');
        return false
      }, lackList = c => {
        let l = c.inv.filter(x => lack(c, x)).map(x => x.n);
        return l.length ? `<div class="card req">⚠️ Sem proficiência: <b>${l.join(', ')}</b></div>` : ''
      };
const
  IDESC = {
    'Proteção leve': 'Fornece **+5 em Defesa**.',
    'Escudo': 'Fornece **+2 em Defesa**.',
    'Mina antipessoal':
      'Esta mina é ativada por controle remoto. Se você estiver a até alcance longo dela, pode gastar uma ação padrao para detoné-la. Ao explodir, a mina dispara centenas de bolas de ação em um cone de 6m, causando 12d6 pontos de dano de perfuracao em todos os seres na rea (Reflexos DT Int reduz & metade). Você define a dire¢ao do cone quando posiciona a mina no chao. Instalar a mina exige uma agdo completa e um teste de Titica contra DT 15. Caso falhe, você gasta a mina, mas não ela não funciona. Encontrar uma mina instalada exige um teste de Percep¢ao (DT igual ao resultado do seu teste para instalé-la).',
    'Algemas':
      'Um par de algemas de ação, Para prender uma pessoa que não esteja indefesa você precisa empunharaalgema, agarrar a pessoa (veja “Manobras de Combate’, no CapiTULO 4) e entao vencer um novo teste de agarrar contra ela. Você pode prender os dois pulsos da pessoa (-5 em testes que exijam o uso das maos, impede conjuragao) ou um dos pulsos dela em um objeto imével adjacente, caso haja, para impedir que ela se mova. Escapar das algemas exige um teste de Acrobacia contra DT 30 (ou ter as chaves...).',
    'Arpéu':
      'Um gancho de ação amarrado na ponta de uma corda para se fixar em muros, janelas, parapeitos de prédios... Prender um arpéu exige um teste de Pontaria (DT 15). Subir um muro com a ajuda de uma corda fornece +5 no teste de Atletismo.',
    'Binóculos':
      'Estes binéculos militares fornecem +5 em testes de Percepcao para observar coisas distantes. BLoQuEADOr DE SiNAL. Este dispositive compacto emite ondas que “poluem’ a frequéncia de radio usada por celulares, impedindo que qualquer aparelho dese tipo em alcance médio se conecte.',
    'Cicatrizante': 'Um spray contendo um',
    'Máscara de gás':
      'Uma máscara com filtro que cobre 0 rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respiracao.',
    'Óculos de visão térmica': 'Estes éculos eliminam a penalidade em testes por camuflagem.',
    'Pé de Cabra':
      'Esta barra de ferro fornece +5 em testes de Forca para arrombar portas. Pode ser usada em combate como um bastao.',
    'Pistola de dardos':
      'Esta arma dispara dardos com um poderoso sonifero. Para disparar em um ser, faa um ataque a distância contra ele. Se acerté-lo, ele fica inconsciente até o fim da cena (Fortitude DT Agi reduz para desprevenida e lenta por uma rodada). A pistola vem com 2 dardos. Uma caixa adicional com 2 dardos é um item de categoria 0 que ocupa 1 espaco.',
    'Pistola sinalizadora':
      'Esta pistola dispara um sinalizador luminoso, itil para chamar outras pessoas para sua localizacao. Pode ser usada como uma arma de disparo leve com alcance curto que causa 2d6 pontos de dano de fogo. A pistola vem com 2 cargas. Uma caixa adicional com 2 cargas é um item de categoria 0 que ocupa 1 espaco.',
    'Soqueira':
      'Esta pega de metal e usada entre os dedos e permite socos mais perigosos — fornece +1 em rolagens de dano desarmado. Uma soqueira pode receber modificades e maldigées de armas corpo a corpo e aplica os efeitos delas em seus ataques desarmados.',
    'Spray de pimenta':
      'Este spray dispara um composto quimico que causa dor ¢ lacrimejo. Você pode gastar uma ação padrao para atingir um ser adjacente. O ser fica cego por 1d4 rodadas (Fortitude DT Agi evita). A carga do spray dura dois uso’.',
    'Taser':
      'Um dispositivo de eletrochoque capaz de atordoar ou até incapacitar um alvo. Você pode gastar uma ação padrao para atingir um ser adjacente. O alvo sofre 1d6 pontos de dano de eletricidade e fica atordoado por uma rodada (Fortitude DT Agi evita). A bateria do taser dura dois usos.',
    'Traje hazmat':
      'Uma roupa impermeavel e que cobre 0 corpo inteiro, usada para impedir 0 contato do usudrio com materiais téxicos. Fornece +5 em testes de resistência contra efeitos ambientais e resistência a quimico 10.',
    'Amarras de (Elemento)':
      'Cordas ou correntes feitas de um elemento paranormal especifico. As amarras sio preparadas para imobilizar criaturas do Outro Lado que sejam vulnerdveis ao elemento que as compéem e podem ser usadas de duas formas.',
    'Câmera de Aura Paranormal':
      'Esta cdmera amaldigoada com Energia possui sigilos de Conhecimento para capturar auras paranormais. Tirar uma foto gasta uma ação padrdo e 1 PE. As fotos sao instantaneas e revelam a presenga de auras paranormais em pessoas e objetos. As auras sao da cor associada ao elemento.',
    'Componentes Ritualísticos de (Elemento)':
      'Um conjunto de objetos utilizados em rituais de um elemento entre Sangue, Morte, Conhecimento ou Energia (não existem componentes ritualisticos de Medo). Componentes ritualisticos sao necessarios para conjuracio de rituais do elemento em questo.',
    'Emissor de Pulsos Paranormais':
      'Esta pequena caixa coberta de sigilos foi desenvolvida para servir como uma “isca” de criaturas paranormais. Ativar a caixa gasta uma ado completa e 1 PE. A caixa emite um pulso de um elemento definido pelo ativador, que atrai criaturas do mesmo elemento e afasta criaturas do elemento oposto, As criaturas afetadas tém direito a um teste de Vontade (DT Pre) para evitar o efeito.',
    'Escuta de Ruídos Paranormais':
      'Este microfone funciona como um aparato espido, com a diferenca que consegue captar ruidos paranormais. Ativar a escuta gasta uma ação completa e 2 PE e faz. com que ela grave ruidos por até 24 horas. Ouvir a escuta fornece +5 em testes de Ocultismo para identificar criatura.',
    'Medidor de Estabilidade da Membrana':
      'Um dispositivo complexo, composto por diversos medidores — de temperatura, campo magnético, dilatagao temporal... Um agente treinado em Ocultismo pode usar o medidor para avaliar 0 estado da Membrana em uma drea (veja a pagina 97), 0 que indica a chance de uma entidade se manifestar nela. Um ambiente com valores racionais e constantes a0 longo de algumas horas dificilmente originara uma criatura ou manifestacao perigosa. Porém, se as leituras apresentarem dados inexplicaveis ou com grandes variagGes, o lugar poder conter uma entidade. Apesar de ser um bom indicativo, o medidor no fornece respostas definitivas, j4 que um ambiente com a Membrana danificada ainda pode não ter sido',
    'Scanner de Manifestação Paranormal de (Elemento)':
      'Este item é composto por um dispoitivo conectado a pequenos objetos amaldicoados de uma entidade especifica e adornado com uma série de sigilos. Ativar o scanner é uma ação padrao. Quando ativado, o scanner consome 1 PE por rodada do usudrio, que sempre sabe a direcao de todas as. manifestacdes paranormais ativas (rituais, criaturas, itens amaldigoados etc.) do elemento escolhido em alcance longo. Se o elemento principal de uma criatura for outro, mas ela tiver como complemento o elemento escolhido do scanner, também sera detectada.',
    'Proteção pesada': 'Fornece **+10 em Defesa** e **resistência 2** a balístico, corte, impacto e perfuração.'
  },
  CURS =
    [
      [
        'Coração Pulsante', 2, 1,
        '**Sangue.** Um coragao humano banhado em sangue, pulsando como se ainda estivesse dentro de um corpo. Se estiver empunhando o coragdo pulsante e sofrer dano, você pode gastar uma reagio para espremer © item e reduzir esse dano pela metade. Sempre que usa 0 coragao, você deve fazer um teste de Fortitude (DT 15 + 5 por uso adicional no mesmo dia), Se falhar, o item é destruido, Como 0 coragao continua pulsando incessantemente com Sangue, qualquer compartimento em que estiver deve ser drenado uma vez por dia, caso contrério 0 Sangue poderd escorrer e danificar outros objetos com os quais entrar em contato. Coroa de. Espinhos Uma coroa, colar ou pulseira feita de um material que lembra os espinhos de uma roseira banhados em sangue. Uma vez por rodada, você pode usar uma reação para transformar qualquer dano mental que fosse sofrer em dano de Sangue, mas não consegue mais recuperar sanidade por descanso enquanto estiver vestindo o item. £ preciso vestir o item por uma semana para ativar seus efeitos.'
      ],
      [
        'Frasco de Vitalidade', 2, 1,
        '**Sangue.** Este pequeno recipiente de vidro possui uma tampa de metal gravada com um selo de Sangue. Você pode gastar 1 minuto e sofrer até 20 pontos de dano para encher o frasco com seu prdprio sangue. Enquanto estiver no recipiente, seu sangue se mantém fresco. Você pode gastar uma ação padrao para beber o contetido do frasco e recuperar a mesma quantidade de PV que armazenou nele, mas deve passar em um teste de Fortitude (DT 20) para não ficar enjoado por uma rodada.'
      ],
      [
        'Pérola de Sangue', 2, 1,
        '**Sangue.** Uma esfera de aproximadamente 2cm de didmetro, lisa e reluzente como uma pérola, mas de cor vermetho-vivo. Você pode gastar uma ação de movimento para forgar a pérola de sangue contra a sua pele € absorvé-la, recebendo uma injegao de adrenalina que fornece +5 em testes de Agilidade, Forca e Vi gor e testes baseados nesses atributos até o final da cena. Ao final da cena, você precisa fazer um teste de Fortitude (DT 20). Se falhar, fica fatigado até o final do dia. Se falhar por 5 ou mais, sofre uma parada cardiaca e fica morrendo. Se morrer dessa forma, você se torna uma criatura de sangue de VD similar ao seu NEX, a escolha do mestre.'
      ],
      [
        'Punhos Enraivecidos', 2, 1,
        '**Sangue.** Um par de soqueiras feitas de um metal vermetho vivo e gravado com varios simbolos de Sangue. Seus ataques desarmados passam a causar 1d8 pontos de dano de Sangue. Sempre que acerta um ataque desarmado, pode fazer outro ataque desarmado contra o mesmo alvo, pagando 2 PE por cada ataque jé realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE, um segundo ataque extra gastando mais 4 PE e assim por ataque ou não ter mais pontos de esforco. iante, até errar um,'
      ],
      [
        'Seringa de Transfiguração', 2, 1,
        '**Sangue.** Esta seringa é feita de um material estranho e de aparéncia orgdnica, cheio de veias pulsantes. Você pode gastar uma ação padrao para sugar o sangue de um alvo adjacente e encher a seringa (se 0 alvo não for voluntério, você precisa acerté-lo com um ataque corpo a corpo). Se houver sangue na seringa, você pode gastar uma ação padrio para injeté-loem qualquer outra pessoa adjacente, que ter sua aparér cia transfigurada para a do dono do sangue, como se estivesse sob efeito do ritual Distorcer Aparéncia, com duração aumentada para um dia. Quando o efeito acabar, o alvo deve rolar 1d6. Em um resultado 1, 0 processo de voltar & sua aparéncia é especialmente traumitico, danificando seus musculos e érgios € fazendo com que ele perca 1 PV permanentemente.'
      ],
      [
        'Casaco de Lodo', 2, 1,
        '**Morte.** Um sobretudo preto fosco que tem uma cor inexplicavelmente opaca, como se absorvesse a luz completamente. Essa vestimenta é na verdade feita de Lodo ativo, protegendo o usuario contra ataques ao amortecer o impacto deles. O usuario recebe resistência a corte, impacto, Morte e perfuracio 5, mas se torna vulnerdvel a dano balistico e de Energia.'
      ],
      [
        'Coletora', 2, 1,
        '**Morte.** Este punhal possui a lamina completamente negra e a empunhadura em espiral. Você pode gastar uma ação completa para apunhalar uma pessoa que esteja morrendo. Ao fazer isso, você mata o alvo morre e a Coletora absorve os resquicios do tempo de vida dela, armazenando 1d8 PE. O punhal pode armazenar um total de 20 PE, que você pode usar como se fossem seus desde que esteja portando a adaga a pelo menos uma semana. Enquanto portar a adaga, você ¢ acometido por pesadelos sobre o sofrimento final de suas vitimas e sempre tem condigdes de descanso ruins, independentemente de onde ou como descansar.'
      ],
      [
        'Crânio Espiral', 2, 1,
        '**Morte.** Um crinio envelhecido, apodrecido e distorcido em um formato espiral. Lodo escorre de seus olhos vazios, como lagrimas negras. Uma ver por rodada, se estiver empunhando 0 crénio, você pode gastar uma ação livre para ativa-lo. Quando faz isso, você recebe uma ação padrao adicional na rodada. Sempre que usa © erdinio, você deve fazer um teste de Vontade (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, você recebe os beneficios do item, mas envelhece 1d4 anos e não pode mais usi-lo nesse dia.'
      ],
      [
        'Frasco de Lodo', 2, 1,
        '**Morte.** Um pequeno frasco contendo lodo de Morte. Apli car o contetdo do frasco em um ferimento é uma ação padrio. Se aplicado em um ferimento recente (sofrido até uma rodada atrés) 0 lodo recupera 6d8+20 pontos de vida. Caso a ferida seja anterior 4 rodada passada, role um dado: em um resultado par, 0 lodo recupera 3d8+10 PV; em um resultado impar, a ferida infecciona, causando 3d8+10 pontos de dano de Morte. O frasco possui lodo para uma unica ativacao.'
      ],
      [
        'Vislumbre do Fim', 2, 1,
        '**Morte.** Um par de éculos escuros repleto de simbolos eespirais ent sua armacao metélica. Você pode gastar uma ação de movimento para se concentrar em um ser que esteja vendo e obter informagdes sobre a morte dele. Em pessoas comuns, essa informagao se traduz em um contador de tempo, que pode se alterar conforme as ages de um marcado Modificam seu futuro, Em Marcados ou criaturas, essas informagdes se traduzem na informacao de qual é 0 pior valor de resistência do alvo (entre Fortitude, Reflexos ou Vontade) e de quaisquer vulnerabilidades que o alvo possua.'
      ],
      [
        'Anéis do Elo Mental', 2, 1,
        '**Conhecimento.** Um par de anéis dourados, cada um contendo um dos simbolos do ritual Ligacdo Telepdtica. Os anéis devem ser usados por duas pessoas por 24h para serem ativados. Apds esse periodo, os dois sio conectados por um ritual de Invadir Mente (ligagao telepatica) que dura enquanto estiverem usando os anéis. Enquanto a ligacdo estiver ativa, as duas pessoas fazem testes de Vontade usando a melhor quantidade de dados ¢ bônus entre as duas. Porém, qualquer dano mental softido por uma delas sera sofrido pela outra (ou seja, se numa rodada ambas sofrerem 10 pontos de dano mental, cada uma ird perder 20 pontos de sanidade) € qualquer condicao mental ou de medo que afetar uma delas automaticamente afetara a outra.'
      ],
      [
        'Lanterna Reveladora', 2, 1,
        '**Conhecimento.** Uma lanterna dourada decorada com sigilos do Outro Lado. Ativar a lanterna gasta uma ação padrao e 1 PE. Ela fica ligada por uma cena e emite luz. com as propriedades do ritual Terceiro Otho. A luz da lanterna incomoda criaturas de Sangue. Se elas foram iluminadas pela luz dela, irdo atacé-lo em detrimento de quaisquer outros alvos na mesma categoria de aleance.'
      ],
      [
        'Máscara das Pessoas nas Sombras', 2, 1,
        '**Conhecimento.** Principal ferramenta e marca registrada da Seita das Miscaras, esse item quando usado poralguém que não pertence Seita ainda carrega grande poder: O usuério recebe resistência a Conhecimento 10 e pode gastar uma ação de movimento e 2 PE para “entrar” em uma sombra adjacente e se transportar instantaneamente para outra sombra que possa ver em alcance médio. Vestir a Mascara é como assinar um acordo e pode ter consequéncias severas se seu portador despertar c interesse da mente unica das Mascaras. Municao Jurada Uma bata de arma de fogo com um sigilo gravado. © usuério pode fazer um ritual de uma hora para vincular essa municao a um ser que conheca. Se tusada contra esse ser, a bala fornece +10 no teste de ataque, dobra a margem de ameaga da arma e causa +6d12 pontos de dano de Conhecimento. Possuir uma ‘municao juramentada deixa 0 usuario obcecado em abater seu alvo, impondo ~2 em Defesa e em testes de ataque contra quaisquer outros alvos.'
      ],
      [
        'Pergaminho da Pertinácia', 2, 1,
        '**Conhecimento.** Um pergaminho amarelado e antigo. Mesmo enrolado, é possivel vislumbrar sigilos dourados brilhando na parte interior. Você pode gastar uma ação padrao para encarar os sigilos do Outro Lado inscritos no pergaminho, recebendo 5 PE temporarios até o fim da cena. Sempre que usa este item, você deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesino dia). Se falhar, 0 pergaiinho se desfaz.'
      ],
      [
        'Arcabuz dos Moretti', 2, 1,
        '**Energia.** Uma arma muito antiga, reminiscente do século XV, mas que de alguma forma ainda se mantém funcionando perfeitamente, apesar das rachaduras que cercam toda a superficie do objeto ¢ emitem uma suave luz rosada do interior de suas fissuras. Ent seu cabo de madeira esta gravado um selo contendo a letra M. O arcabuz é uma arma simples, de fogo ¢ de uma mao que fornece +2 em testes de ataque. Sempre que dispara esta arma, 0 usuério deve rolar 1d6 junto com 0 teste de ataque. O resultado do d6 define qual o dano da arma nesse disparo: 1) 244, 2) 2d6, 3) 248, 4) 2410, 5) 2412, 6) 2420. A arma tem alcance curto, crítico x3 e não precisa de municao. Bateria Reversa Uma pequena bateria elétrica repleta de sigilos paranormais. Voceé pode gastar uma ação padrao e 2 PE para fazer a bateria absorver a carga de qualquer dispositivo eletrénico em alcance curto — celular, notebook ou mesmo um automével —, fazendo-o ficar automaticamente descarregado. Se a bateria estiver cheia, voté pode gastar uma ação padrao para transferir a carga dela para um dispositivo eletrénico descarregado em alcance curto, que é instantaneamente reenergizado. Sempre que usa a bateria, você deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). falhar, ela explode, causando 12d6 pontos de dano de Energia em todos os seres a até 3 metros.'
      ],
      [
        'Peitoral da Segunda Chance', 2, 1,
        '**Energia.** Um dispositive que pode ser vestido como um pequeno colete que pode ser prendido aovredor do peito, contendo uma pega central em cima do coragdo formada por wm amontoado de partes eletrénicas seguradas por fios metdlicos entrelagados, passando por baixo dos bragos ¢ levando até um fecho na parte das costas. Se você for reduzido a 0 pontos de vida, © colete automaticamente gastar 5 PE seus para reanimé-lo com 4d10 PV através de um surto de Energia por todo 0 seu corpo. A reanimacao falha se você não tiver PE suficiente. Cada vez que o item é ativado, existe uma chance (1 em 110) da descarga energética ser forte demais e maté-lo instantanea mente, transformando seu corpo e equipamento em plasma de Energia pura (exceto pelo colete)'
      ],
      [
        'Relógio de Arnaldo', 2, 1,
        '**Energia.** Um relégio de ouro, meio manchado e com wm aspecto levemente queimado no exterior. Ao abrir, é posstvel enxergar a foto de um homem de barba e éculos ao lado de uma crianga simpatica, também segurando um relégio de ouro, Uma vez por rodada, você pode gastar 1 PE para rolar novamente qualquer dado com 0 resultado 1. O custo para usar o reldgio aumenta em +1 para cada vez que for ativado no mesmo dia.'
      ],
      [
        'Talismã da Sorte', 2, 1,
        '**Energia.** Uma figa, moeda, pé de coelho ou qualquer outro badulaque modificado por um ritual. Sempre que você estiver vestindo 0 talisma e sofrer dano, pode gastar uma reacdo e 3 PE para rolar 1d4. Em um resultado 2 ou 3, você evita completamente o dano. Em um resultado 4, você evita o dano, mas o talisma queima e via cinzas. Por fim, em um resultado 1, sorte se reverte em azar: em vez de evitar 0 dano, você sofre 0 dobro do dano que sofreria e o talisma queima e vira cinzas.'
      ],
      [
        'Teclado de Conexão Neural', 2, 1,
        '**Energia.** Um teclado USB coberto de glifos de Energia. Sempre que você plugar o teclado a um computador (uma ação de movimento), o item iré gerar ondas eletromagnéticas que enviam os sinais do sistema diretamente para as sinapses de seu cérebro, efetivamente conectando a sua mente com a maquina Você pode usar 0 computador sem nenhum impedimento tecnolégico ou de idioma, recebe +10 em testes para hackear e gasta metade do tempo normal para localizar arquivos. Porém, devido ao estresse que seu cérebro sofre por se conectar diretamente a.um sistema digital, você sofre 146 pontos de dano mental por rodada que usar o teclado.'
      ],
      [
        'Tela do Pesadelo', 2, 1,
        '**Energia.** Este dispositive com tela (celular, tablet, TV...) contém diversos sigilos mintisculos em suas bordas. Você pode gastar uma ação padrao e 2 PE para ativar a tela. A préxima pessoa que tocé-la veré uma imagem horrivel saindo da tela e avancando contra ela. A imagem é apenas uma ilusdo, mas os traumas que ela causa sio reais! A pessoa deve fazer um teste de Vontade (DT determinada pelo usuario da tela +5). Se falhar, fica atordoada, sofre 4d6 pontos de dano mental e precisa repetir o teste na préxima rodada. O efeito continua até a pessoa passar no teste ou enlouquecer (ou outra pessoa destruir a tela). Uma vez que gere esse efeito, a tela fica inerte até você ativé-la novamente.'
      ],
      [
        'Veículo Energizado', 2, 1,
        '**Energia.** O motor deste vefculo foi modificado paranormalmente para no precisar de combustivel. Além disso, um motorista pode gastar uma reação e fazer um teste de Pilotagem (DT 25) para fazer o carro e seus ocupantes assumirem uma forma de energia pura por um instante, suficiente para evitar colidir com um objeto, atravessando-o como se fossem incorpéreos'
      ]
    ],
  PARN = [
    ['Amarras de (Elemento)', 2, 1], ['Câmera de Aura Paranormal', 2, 1],
    ['Componentes Ritualísticos de (Elemento)', 0, 1], ['Emissor de Pulsos Paranormais', 2, 1],
    ['Escuta de Ruídos Paranormais', 2, 1], ['Medidor de Estabilidade da Membrana', 2, 1],
    ['Scanner de Manifestação Paranormal de (Elemento)', 2, 1]
  ];
CAT.par = PARN.map(x => [x[0], x[1], x[2], {}]);
CAT.par.push(['Selo Paranormal', 0, 1, {}]);
CAT.amd = CURS.map(x => [x[0], x[1], x[2], {}, x[3]]);
