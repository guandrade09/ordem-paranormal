/**
 * Dados do livro: elementos e lista de rituais (círculos 1 a 4).
 */

// Elementos (sigla -> nome)
const KE = {
  K: 'Conhecimento',
  E: 'Energia',
  M: 'Morte',
  S: 'Sangue',
  F: 'Medo',
  '*': '*'
},
      pz = z => z == '-' ? null : [+z.split('/')[0], parseInt(z.split('/')[1]), /a/.test(z)];

// Rituais: círculo|elemento|nome|descrição|execução/alcance
const RT = `1|*|Amaldiçoar Arma|Arma causa mais dano.|2/2|5/3a
1|K|Compreensão Paranormal|O ritual confere a você compreensão sobrenatural da linguagem. Você pode focar num texto ou gravação para entender as palavras mesmo que não conheça o idioma, contanto que se trate de um idioma humano mundano (não funciona com símbolos ou sigilos paranormais).|2/2|5/3
1|K|Enfeitiçar|Este ritual torna o alvo prestativo. Ele não fica sob seu controle, mas percebe suas palavras e ações da maneira mais favorável possível.|2/2|5/3
1|K|Perturbação|Você dá uma ordem irresistível, que o alvo deve ser capaz de ouvir (mas não precisa entender).|2/1|5/3a
1|K|Ouvir os Sussurros|O ritual conecta você com os sussurros: memórias ecoadas pelo Outro Lado, que poderá consultar para compartilharem seu conhecimento proibido em relação a uma ação que você tomará em breve.|2/2|5/3
1|K|Criar Ilusão|Este ritual cria uma ilusão visual (uma pessoa, uma parede...) ou sonora (um grito de socorro, um uivo assustador...).|2/2|5/3
1|K|Terceiro Olho|Você vê manifestações paranormais.|2/1|5/1
1|E|Amaldiçoar Tecnologia|Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade.|2/2|9/4a
1|E|Coincidência Forçada|Você força os caminhos do Caos para que o alvo tenha mais sorte em um aspecto de sua vida.|2/3|5/4a
1|E|Eletrocussão|Você manifesta e dispara uma corrente elétrica contra o alvo, que sofre 2d6 pontos de dano de eletricidade e fica vulnerável por uma rodada.|2/2|6/3
1|E|Embaralhar|Você cria três cópias ilusórias que se parecem com hologramas extremamente realistas.|2/2|5/3
1|E|Luz|O alvo emite uma luz de cores alternadas e brilhantes (mas não produz calor) em uma área com 9m de raio.|2/2|5/3
1|E|Polarização Caótica|Você gera uma aura magnética sobrenatural. Escolha um dos efeitos a seguir.|2/1|5/1
1|M|Cicatrização|Você acelera o tempo de maneira focada nas feridas do alvo, que cicatrizam com grande velocidade.|2/2|9/4a
1|M|Consumir Manancial|Você suga uma pequena porção do tempo de vida de plantas, insetos e até mesmo do solo ao redor, gerando Lodo e recebendo 3d6 pontos de vida temporários.|2/2|5/3a
1|M|Decadência|Espirais de trevas envolvem sua mão e definham o corpo do alvo ao toque, causando 2d8+2 pontos de dano de Morte.|2/1|5/3
1|M|Definhar|Você dispara uma lufada de cinzas que drenam as forças do alvo. Se falhar na resistência, o alvo fica fatigado.|2/2|5/3a
1|M|Espirais da Perdição|Você manifesta espirais negras nos corpos dos alvos, que têm dificuldade de coordenar seus movimentos e recebem –1 em testes de ataque e rolagens de dano.|2/2|8/3
1|M|Nuvem de Cinzas|Uma nuvem de fuligem espessa eleva-se de um ponto a sua escolha, obscurecendo toda a visão — criaturas a até 1,5m têm camuflagem e criaturas a partir de 3m têm camuflagem total.|2/2|5/3
1|S|Arma Atroz|A arma é recoberta de veias carmesim e exala uma aura de violência, passando a causar +1d6 pontos de dano de sangue.|2/2|5/4a
1|S|Armadura de Sangue|Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça protetora que fornece +5 na Defesa.|5/3|9/4a
1|S|Corpo Adaptado|Este ritual modifica a biologia do alvo para permitir a sobrevivência em ambientes hostis.|2/1|5/1
1|S|Distorcer Aparência|Você modifica sua aparência física para se transformar em outra pessoa.|2/1|5/3
1|S|Fortalecimento Sensorial|Você potencializa seus sentidos, recebendo +1d em Investigação, Luta, Percepção e Pontaria.|2/2|5/4a
1|S|Ódio Incontrolável|O alvo entra em um frenesi de combate, aumentando suas capacidades de luta e sua agressividade.|2/1|5/3a
1|F|Cinerária|Você manifesta uma névoa fina carregada de essência paranormal. Rituais conjurados dentro da névoa têm sua DT aumentada em +2.|2/1|5/1
2|K|Aprimoramento Mental|Você imbui a mente do alvo com fagulhas do Conhecimento. Escolha entre Intelecto e Presença.|3/3|7/4a
2|K|Detecção de Ameaças|O conjurador recebe uma percepção aguçada sobre perigos que podem estar à sua volta.|3/3|5/4
2|K|Esconder dos Olhos|O alvo fica invisível, incluindo seu equipamento, recebendo camuflagem total e +20 em testes de Furtividade.|3/3|7/4a
2|K|Invadir Mente|Gera uma rajada mental ou se conecta telepaticamente.|3/3|7/1
2|K|Localização|Este ritual pode encontrar uma pessoa ou objeto a sua escolha. Você pode pensar em termos gerais (“um policial”, “algo de metal”) ou específicos (“A delegada Joana”, “munição de pistola”).|3/1|7/4
2|E|Chamas do Caos|Você pede que as energias do caos manipulem chamas e emanações de calor.|3/1|7/3
2|E|Contenção Fantasmagórica|Três laços de Energia surgem do chão e se enroscam no alvo, deixando-o agarrado.|3/3|5/4a
2|E|Dissonância Acústica|O ritual desarranja a vibração do ar, criando uma área de dissonância sonora.|1/1|3/3
2|E|Sopro do Caos|Você pode alterar os movimentos e comportamentos de massas de ar de forma caótica.|3/1|9/1
2|E|Tela de Ruído|Este ritual cria uma película de energia que recobre seu corpo e repele contato cinético.|3/1|7/4
2|M|Desacelerar Impacto|O alvo cai lentamente. A velocidade da queda é reduzida para 18m por rodada — o suficiente para não causar dano.|3/1|-
2|M|Eco Espiral|Você manifesta entre suas mãos uma pequena cópia do alvo feita de cinzas.|3/1|7/4a
2|M|Miasma|A área é coberta por emanações tóxicas letais. Criaturas na área sofrem 5d6 pontos de dano de veneno e ficam enjoadas por 1 rodada.|3/1|7/4
2|M|Paradoxo|O ritual cria uma poderosa implosão de distorção temporal contraditória, causando 6d6 pontos de dano de Morte em todas as criaturas na área.|3/1|7/4
2|M|Velocidade Mortal|Você distorce a maneira como o alvo interage com a passagem do tempo, tornando-o impossivelmente veloz.|3/1|7/4a
2|S|Físico Aprimorado|O alvo tem seus músculos tonificados e ligamentos reforçados, recebendo +1 em Agilidade ou Força, à sua escolha.|3/3|7/4a
2|S|Descarnar|Este ritual cruel faz com que lacerações horríveis se manifestem pela pele e órgãos do alvo, que sofre 6d8 pontos de dano (metade corte, metade sangue) e fica com uma hemorragia severa.|3/3|7/3a
2|S|Flagelo de Sangue|Alvo precisa obedecer uma ordem.|3/3|7/4a
2|S|Hemofagia|Você faz com que o sangue do alvo seja arrancado de seu corpo através de sua pele, causando 6d6 pontos de dano de Sangue.|3/1|7/4
2|S|Transfusão Vital|Você toca no alvo e transfere sua própria energia vital para ele, podendo sofrer até 30 pontos de dano de Sangue para que o alvo recupere a mesma quantidade em PV.|3/3|7/4
2|F|Proteção contra Rituais|Você canaliza uma aura de Medo em sua forma pura, que protege o alvo contra efeitos paranormais.|3/3|6/4
2|F|Rejeitar Névoa|Você manifesta um leve redemoinho de névoa que se movimenta suavemente ao redor da área afetada.|2/1|5/1
3|K|Alterar Memória|Você invade a mente do alvo e altera ou apaga suas memórias recentes (da última hora).|-|4/4
3|K|Contato Paranormal|Você entra em um breve transe e sua mente se conecta com o Outro Lado.|4/4|9/4a
3|K|Mergulho Mental|Você tenta descobrir informações sobre uma pessoa que esteja tocando, mergulhando em seus pensamentos.|-|4/4
3|K|Vidência|Através de uma superfície reflexiva, como um espelho ou mesmo uma TV desligada, você pode ver e ouvir uma criatura escolhida e seus arredores (cerca de 6m em qualquer direção), mesmo que ela se mova.|-|-
3|E|Convocação Instantânea|Você invoca um objeto de qualquer lugar para sua mão. O item deve ter sido previamente preparado com o símbolo do ritual.|4/1|9/1
3|E|Salto Fantasma|Seu corpo se transforma momentaneamente em Energia pura e viaja até outro ponto.|2/1|4/1
3|E|Transfigurar Água|Você pode canalizar a Energia para que a água tenha movimentos e comportamentos sobrenaturais de forma caótica.|-|5/1
3|E|Transfigurar Terra|Você imbui terra, pedra, lama, argila ou areia na área com Energia, gerando efeitos sobrenaturais e caóticos.|3/1|7/4
3|M|Âncora Temporal|O alvo é envolvido por uma aura espiralada que distorce o tempo ao seu redor.|-|4/4
3|M|Poeira da Podridão|Você manifesta uma nuvem de poeira que apodrece lentamente as criaturas na área.|-|4/1
3|M|Tentáculos de Lodo|Uma fenda sombria se abre no chão, de onde surgem tentáculos feitos de lodo da Morte.|-|5/1
3|M|Zerar Entropia|Você zera completamente a entropia do alvo em relação ao ambiente, deixando-o paralisado.|4/4|11/4a
3|S|Ferver Sangue|O sangue do alvo aquece rapidamente até entrar em ebulição. Quando o ritual é conjurado, e no início de cada um de seus turnos, o alvo deve fazer um teste de Fortitude.|-|4/4a
3|S|Forma Monstruosa|Seu corpo e sua mente se transformam, assumindo uma forma monstruosa que combina suas características com as de uma criatura de Sangue; suas roupas e proteção se mesclam à sua carne, transformando-se em uma couraça, e quaisquer objetos em suas mãos se fundem aos seus braços, transformando-se em garras afiadas e pontiagudas.|3/3|9/4a
3|S|Purgatório|Você faz brotar uma poça de sangue pegajoso do chão na área afetada. Inimigos na área se tornam vulneráveis aos tipos de dano balístico, corte, impacto e perfuração.|-|-
3|S|Vomitar Pestes|Você vomita um enxame de pequenas criaturas de Sangue, que surge em um ponto adjacente a sua escolha.|2/1|5/1
3|F|Neutralizar Ritual|Você dissipa os efeitos de rituais que estejam ativos, como se sua duração tivesse acabado.|-|-
4|K|Controle Mental|Você domina a mente do alvo, que obedece cegamente a seus comandos, exceto ordens claramente suicidas.|5/1|10/1a
4|K|Inexistir|Você toca um alvo e o apaga completamente da existência.|5/1|10/1a
4|K|Possessão|Você projeta sua consciência no corpo de um alvo vivo ou morto. Enquanto possuir o alvo, você assume o controle total do corpo dele, e se o alvo estiver vivo, a consciência do alvo troca de lugar com a sua, ficando inerte dentro do seu corpo desacordado.|-|-
4|E|Alterar Destino|Você vislumbra o caos do destino e visualiza milhões de possibilidades de um evento próximo, permitindo escolher o melhor curso de ação.|-|5/1
4|E|Deflagração de Energia|Após concentrar uma quantidade imensa de Energia, você emana uma explosão de radiação elétrica, como uma estrela em plena terra.|-|5/1
4|E|Teletransporte|O ritual transforma o corpo e equipamento dos alvos em energia pura e os faz reaparecer num lugar a sua escolha a até 1.000km.|-|5/1
4|M|Convocar o Algoz|Usando os medos subconscientes do alvo, você manipula a espiral da morte para criar uma imagem daquilo que ele mais teme.|-|-
4|M|Distorção Temporal|A influência da Morte distorce o fluxo de tempo em relação a você. Você cria um pequeno bolsão temporal que dura 3 rodadas.|-|-
4|M|Fim Inevitável|Este ritual cria um vácuo temporal, em um espaço desocupado a sua escolha, capaz de sugar tudo nas proximidades.|5/1a|10/1a
4|S|Capturar o Coração|Você desperta no alvo uma paixão doentia e obcecada por você, fazendo com que ele queira te agradar, proteger e estar ao seu lado a qualquer custo, mesmo que seja ficando contra seus companheiros.|-|-
4|S|Invólucro de Carne|Você manifesta uma poça de sangue grotesca no chão, de onde emerge uma cópia perfeita sua: ela é idêntica em aparência e capacidades (em termos de jogo, tem as mesmas estatísticas de personagem) e surge com uma cópia perfeita de todo equipamento mundano que você está carregando no momento.|-|5/1
4|S|Vínculo de Sangue|Você manifesta um símbolo de sangue no corpo do alvo e no seu próprio.|-|-
4|F|Canalizar o Medo|Você transfere um pouco de seu poder paranormal a outra pessoa. Escolha um ritual de até 3º círculo que você conheça; o alvo pode conjurar este ritual uma vez, sem pagar seu custo base em PE (mas pode aplicar aprimoramentos usando seus próprios PE para isso).|-|-
4|F|Conhecendo o Medo|O ritual manifesta um estado de medo absoluto na mente do alvo, fazendo-o entrar em choque.|-|-
4|F|Lâmina do Medo|Você manifesta uma lâmina impossível que pode apenas ser descrita como uma “fenda na Realidade” e ataca um alvo adjacente.|-|-
4|F|Medo Tangível|O ritual transforma seu corpo em uma manifestação do Medo, tornando-o imune aos efeitos mundanos que podem atingi-lo.|-|-
4|F|Presença do Medo|Você se torna um receptáculo para o Medo puro, emanando ondas de pavor e ruína.|-|-
2|K|Ligação Telepática|Você cria um elo mental entre duas pessoas (você pode ser uma delas), que podem se comunicar independente da distância.|3/3|7/1
4|K|Visão da Verdade|Você enxerga a forma real das coisas. Você pode ver através de camuflagem (normal e total), escuridão (normal e paranormal) e efeitos de ilusão e transformação (como Forma Monstruosa), enxergando a verdade como sigilos do Outro Lado formando silhuetas translúcidas e sobrepostas.|3/1|5/1`
             .split('\n')
             .map(l => {
               let [ci, e, n, s, d, v] = l.split('|');
               return {
                 ci: +ci, el: KE[e], n, s, d: pz(d), v: pz(v)
               }
             });
