export interface Lesson {
  id: string
  title: string
  titleMale?: string
  concept: string
  realExample: string
  exercisePrompt: string
  mission: string
  duration: number
}

export interface Module {
  id: string
  icon: string
  titleFemaleTarget: string
  titleMaleTarget: string
  subtitleFemaleTarget: string
  subtitleMaleTarget: string
  persuasiveSubtitleFemale: string
  persuasiveSubtitleMale: string
  futurePacingFemale: string
  futurePacingMale: string
  bulletsFemale: string[]
  bulletsMale: string[]
  lessons: Lesson[]
  imageQueryFemale: string
  imageQueryMale: string
  layer: 1 | 2
}

export const MODULES: Module[] = [
  {
    id: 'attraction',
    icon: '🔥',
    titleFemaleTarget: 'Como Atrair Qualquer Mulher em Qualquer Lugar',
    titleMaleTarget: 'Como Atrair Qualquer Homem em Qualquer Lugar',
    subtitleFemaleTarget: 'Abordagem, conversa, atração, sinais e liderança',
    subtitleMaleTarget: 'Instinto de caça, escassez, iniciativa feminina',
    imageQueryFemale: 'attractive confident man social dark',
    imageQueryMale: 'attractive confident woman social elegant',
    persuasiveSubtitleFemale: 'O método científico para criar atração irresistível — sem ser agressivo, sem ser falso, sem depender de sorte.',
    persuasiveSubtitleMale: 'Como ativar o instinto de conquista dele sem parecer desesperada — usando a biologia a seu favor.',
    futurePacingFemale: 'Imagina entrar em qualquer ambiente com a certeza de saber exatamente como criar conexão. Chegar perto dela de forma natural, fazer ela querer continuar a conversa — e ir embora curiosa sobre você.',
    futurePacingMale: 'Imagina o momento em que ele percebe que está pensando em você sem que você tenha dito uma palavra. Que é ele quem inicia. Que você virou a pessoa que ele quer conquistar.',
    bulletsFemale: [
      'Como abordar qualquer mulher em qualquer contexto sem parecer invasivo',
      'Os 3 pilares da atração que 99% dos homens nunca ativam',
      'Como ler sinais de interesse com precisão — sem suposições',
      'Liderança natural: tomar iniciativa sem pedir permissão',
      'Status social e como cultivá-lo ativamente',
    ],
    bulletsMale: [
      'Como ativar o instinto de caça sem jogar jogos',
      'A diferença entre escassez real e artificial — e por que uma atrai, a outra repele',
      'Como criar tensão emocional que faz ele pensar em você o dia todo',
      'Os sinais de que ele está reativando interesse — e como não sabotar esse momento',
      'Como se tornar a mulher que ele sente que vai perder',
    ],
    layer: 2,
    lessons: [
      {
        id: 'approach-anxiety',
        title: 'Superando a Ansiedade de Abordagem',
        concept: `O medo de se aproximar não é covardia — é biologia. Quando o cérebro interpreta uma potencial rejeição social como ameaça, o sistema de luta-ou-fuga se ativa. Cortisol sobe. Coração acelera. Mente trava.

Mas aqui está o que a neurociência descobriu: esse medo não desaparece com preparação mental. Ele desaparece com exposição gradual e repetida. Cada abordagem que você faz — independentemente do resultado — recalibra seu sistema nervoso.

João, 28 anos, engenheiro introvertido, desafiou a si mesmo a iniciar uma conversa genuína com uma pessoa desconhecida por dia durante 21 dias. No décimo quinto dia, ele conversou com a mulher que se tornou sua namorada por dois anos. Mas o que mudou não foi a sorte — foi o nível de ansiedade no momento da abordagem: próximo de zero.

A fórmula de uma abordagem natural: [observação específica do contexto] + [comentário genuíno] + [pergunta aberta]. Simples. Contextual. Sem agenda evidente.`,
        realExample: 'Em um café, após 10 minutos de fila, um homem vira para a mulher atrás dele: "Acho que esse cardápio foi desenhado para confundir." Ela riu. Eles conversaram por 30 minutos.',
        exercisePrompt: 'Escreva 3 aberturas baseadas em ambientes que você frequenta regularmente. Sejam específicas ao contexto, genuínas e terminadas em pergunta aberta.',
        mission: 'Nos próximos 7 dias, inicie 7 conversas com desconhecidos. Sem objetivo de conquista — apenas contato humano genuíno.',
        duration: 15,
      },
      {
        id: 'building-attraction',
        title: 'Os 3 Pilares da Atração',
        concept: `A atração não é aleatória. Ela segue padrões neurológicos consistentes que pesquisadores mapearam ao longo de décadas de estudo.

Os 3 pilares que constroem atração genuína:

1. VALOR: a percepção de que você tem algo que a outra pessoa quer — seja ambição, humor, inteligência, criatividade, estabilidade emocional. Valor não é exibicionismo — é substância que vazam naturalmente.

2. ESCASSEZ: o que é abundante não tem valor. Pessoas que estão sempre disponíveis, que respondem imediatamente a tudo, que nunca têm agenda própria comunicam que são fáceis de obter — e o que é fácil de obter perde valor rapidamente.

3. TENSÃO: o ingrediente esquecido. A atração precisa de uma pequena dose de incerteza — não saber completamente o que o outro está sentindo, não ter certeza se vai ser correspondido(a). Quando tudo é absolutamente certeiro, a tensão desaparece.

O paradoxo: quanto mais você precisa da atração de uma pessoa específica, menos consegue criá-la. A atração flui naturalmente para quem genuinamente tem uma vida que não depende dela.`,
        realExample: 'Ana passa um mês desenvolvendo projetos pessoais e expandindo sua vida social. Quando reencontra seu ex, ele percebe uma mulher que claramente está bem sem ele — e imediatamente sente que "perdeu algo".',
        exercisePrompt: 'Para cada pilar, avalie de 1 a 10 e escreva ações específicas para fortalecer os mais fracos nas próximas 2 semanas.',
        mission: 'Identifique uma situação social esta semana onde você vai praticar os 3 pilares simultaneamente.',
        duration: 20,
      },
      {
        id: 'reading-signals',
        title: 'Lendo os Sinais de Interesse',
        concept: `O interesse romântico raro é declarado verbalmente de início. Ele vaza — em micro-comportamentos, em linguagem corporal, em padrões de resposta que precisam ser aprendidos a ler.

Sinais de interesse feminino: contato visual sustentado (mais de 3 segundos), toque casual que ela inicia, postura orientada para você (pés apontados na sua direção), espelhar seus movimentos, fazer perguntas pessoais, rir de coisas que não são tão engraçadas assim, checar o celular menos quando está com você.

Sinais de interesse masculino: criação de contexto para futuras interações ("você deveria ver..."), textos enviados sem motivo prático, lembrar de detalhes que você mencionou casualmente, esforço para estar no mesmo espaço que você, postura expansiva na sua presença.

A regra de ouro: um sinal é coincidência, dois são padrão, três são certeza. Nunca aja com base em um único sinal isolado.`,
        realExample: 'Pedro nota que Laura sempre encontra uma razão para tocar levemente no braço dele durante conversas, mantém contato visual prolongado e ri das coisas que ele diz mesmo quando não são brilhantes. Três sinais — padrão confirmado.',
        exercisePrompt: 'Na próxima situação social, pratique observar sinais de interesse (ou ausência deles) sem tentar analisá-los em tempo real. Depois, registre o que observou.',
        mission: 'Esta semana, converse com 3 pessoas novas e pratique leitura de sinais sem interpretação imediata.',
        duration: 18,
      },
      {
        id: 'leading',
        title: 'Liderança Natural — O que Significa Liderar',
        concept: `Liderança em atração não é domínio. É iniciativa com presença — tomar decisões com confiança e criar a experiência para ambos, sem pedir permissão para cada micro-decisão.

"Onde você quer ir?" parece respeitoso mas é um ato de transferência de responsabilidade que comunica insegurança. "Conheço um lugar interessante — te levo lá" é liderança. A outra pessoa pode recusar — mas recusará com atração, não com indiferença.

Elementos da liderança natural:
- Iniciar planos com confiança
- Fazer escolhas no restaurante sem deliberar por 15 minutos
- Conduzir conversas para profundidade
- Criar transições ("agora vamos..." em vez de "o que você quer fazer?")
- Manter calma em situações de tensão ou imprevistos

Importante: liderança é calibrada. Líderes de alto valor sabem quando ouvir, quando ceder, quando colaborar. Não é ditadura — é presença segura.`,
        realExample: 'No segundo encontro, em vez de perguntar o que ela quer fazer, Marcos diz: "Vou te buscar às 19h — tenho um lugar em mente, você vai gostar." Ela chega curiosa e animada.',
        exercisePrompt: 'Esta semana, em 3 situações diferentes (trabalho, amigos, encontro), tome iniciativa de liderança que normalmente você não tomaria. Observe as reações.',
        mission: 'Planeje e execute um evento ou saída onde você faz todas as escolhas — local, horário, atividade. Observe como a outra pessoa responde.',
        duration: 22,
      },
      {
        id: 'status',
        title: 'Status Social e Como Cultivá-lo',
        concept: `Status não é riqueza nem fama. É o nível de respeito e consideração que as pessoas ao seu redor demonstram por você — e que você demonstra por si mesmo(a).

Pesquisas antropológicas mostram que o status social é um dos fatores mais consistentes de atratividade em todas as culturas estudadas. Mas ele não é fixo — é uma construção ativa.

Como se cultiva status:
- Ser bom(a) no que faz e ser reconhecido(a) por isso
- Ter uma missão ou projeto que outras pessoas admiram
- Tratar todos com a mesma consideração — do garçom ao CEO
- Não precisar de aprovação imediata para se sentir seguro(a)
- Falar pouco, mas fazer o que diz
- Ter pessoas ao seu redor que se beneficiam de estar com você

O sinal mais claro de alto status: a forma como você reage quando alguém tenta te desafiar ou diminuir. Status alto reage com calma, humor ou desinteresse — nunca com defensividade ou agressão.`,
        realExample: 'Sofia é professora de ioga com uma pequena clientela, mas cada cliente é transformado pela experiência. Ela chega a qualquer ambiente e as pessoas gravitam em sua direção — não por riqueza, mas pela sensação de que ela tem algo valioso.',
        exercisePrompt: 'Avalie seu status atual nas 3 esferas: profissional, social e pessoal. Para cada uma, identifique 1 ação concreta que elevaria seu status nos próximos 30 dias.',
        mission: 'Esta semana, execute 5 atos de alto status: cumpra o que prometeu, recuse algo que não quer fazer sem se justificar excessivamente, faça um elogio genuíno sem querer algo em troca.',
        duration: 25,
      },
    ],
  },
  {
    id: 'psychology',
    icon: '🧠',
    titleFemaleTarget: 'Psicologia Feminina',
    titleMaleTarget: 'Psicologia Masculina',
    subtitleFemaleTarget: 'Os 3 pilares, apego, ciclo atração-afastamento',
    subtitleMaleTarget: 'Como homens processam emoções e tomam decisões',
    imageQueryFemale: 'brain neural psychology dark blue',
    imageQueryMale: 'man thinking psychology contemplative dark',
    persuasiveSubtitleFemale: 'Entenda como o cérebro feminino processa emoções e decisões — e use esse conhecimento para criar conexão profunda e genuína.',
    persuasiveSubtitleMale: 'Decodifique o que ele realmente sente, por que se afasta, e o que precisa ver para querer voltar.',
    futurePacingFemale: 'Imagina finalmente entender por que ela age de certas formas — e saber exatamente o que dizer e fazer para criar segurança emocional que a faz querer estar perto de você.',
    futurePacingMale: 'Imagina entender que o silêncio dele não é indiferença — e saber exatamente quando agir, quando recuar, e o que ele precisa perceber para tomar a iniciativa.',
    bulletsFemale: [
      'Os 3 pilares do que mulheres buscam em relacionamentos (e raramente dizem)',
      'O ciclo atração-afastamento — como usá-lo estrategicamente',
      'Teoria do apego: seu estilo e o dela — e como mudar o padrão',
      'Como criar segurança emocional sem parecer ansioso',
      'O erro que afasta mulheres emocionalmente — e como evitar',
    ],
    bulletsMale: [
      'Como homens processam emoções — por que o silêncio não significa desinteresse',
      'O que ele realmente busca e raramente articula',
      'Por que pressionar afasta e distância estratégica aproxima',
      'Como despertar admiração genuína — o combustível do interesse masculino',
      'O momento exato em que ele decide se quer reconquistar',
    ],
    layer: 2,
    lessons: [
      {
        id: 'female-psychology-basics',
        title: 'Os Fundamentos da Psicologia Feminina',
        concept: `A psicologia feminina foi historicamente mal compreendida — ora romantizada, ora patologizada. O que a neurociência moderna revela é fascinante e prático.

As mulheres, em média, processam emoções de forma mais integrada — com maior conexão entre o sistema límbico (emocional) e o córtex pré-frontal (racional). Isso significa que emoções e pensamentos são mais interconectados.

Os 3 pilares do que mulheres buscam em relacionamentos (pesquisa Perel, Fisher, Gottman):
1. SEGURANÇA EMOCIONAL: sentir que podem ser vulneráveis sem serem julgadas
2. SENTIR-SE ESCOLHIDA: perceber que o parceiro a prioriza de forma ativa
3. PARCEIRO DE CRESCIMENTO: alguém que as inspire a se tornarem melhores

O ciclo de atração-afastamento: quando um homem pressiona muito, a mulher recua. Quando ele se afasta com segurança (não em punição), ela se reaproxima. Entender esse ciclo transforma comportamentos contraproducentes em estratégias conscientes.`,
        realExample: 'Depois de 3 semanas de pressão e mensagens diárias, Lucas decide parar. Em 10 dias, Isabela entra em contato por conta própria — "estava pensando em você".',
        exercisePrompt: 'Reflita: em que momentos você pressionou demais? O que aconteceu? Como você pode criar espaço estratégico sem parecer indiferente?',
        mission: 'Esta semana, pratica espaço estratégico em pelo menos uma interação importante.',
        duration: 20,
      },
      {
        id: 'male-psychology-basics',
        title: 'Os Fundamentos da Psicologia Masculina',
        titleMale: 'Como Homens Realmente Funcionam',
        concept: `Homens, em média, tendem a processar emoções de forma mais compartimentalizada — ativando o córtex pré-frontal separadamente do sistema límbico. Isso gera comportamentos que frequentemente confundem mulheres: aparente frieza, necessidade de "resolver" problemas antes de expressá-los, uso do silêncio como processamento.

O que homens buscam que raramente articulam:
1. RESPEITO: ser percebido como capaz e competente
2. AUTONOMIA: espaço para ser ele mesmo sem perder o relacionamento
3. ADMIRAÇÃO: sentir que é visto como alguém especial, não intercambiável

O instinto de caça: homens evolutivamente foram programados para valorizar mais o que precisaram conquistar. Quando algo é dado sem esforço, o valor percebido reduz. Isso não é manipulação — é neurobiologia.

A pressão afasta: quando uma mulher pressiona um homem emocionalmente antes que ele esteja pronto, ele recua. O paradoxo: quanto menos ela parece precisar, mais ele sente que precisa dela.`,
        realExample: 'Carolina passou 2 semanas sendo excelente para si mesma — sem contato com o ex. Quando ele a viu em um evento, percebeu que havia "perdido" algo valioso. O primeiro contato foi dele.',
        exercisePrompt: 'Como você pode demonstrar respeito e admiração genuínos de forma que não seja performática? Escreva 5 formas específicas.',
        mission: 'Nos próximos 7 dias, pratique 3 formas de criar escassez natural (não artificial) na sua interação com ele.',
        duration: 20,
      },
      {
        id: 'attachment-theory',
        title: 'Teoria do Apego — Seu Estilo e o Dele(a)',
        concept: `John Bowlby descobriu que os padrões de apego formados na infância se repetem nos relacionamentos adultos. Existem 4 estilos:

SEGURO (55% das pessoas): confortável com proximidade e independência. Comunicação direta. Base sólida para relacionamentos.

ANSIOSO (20%): medo de abandono, hipersensível a sinais de distanciamento, tende a "sugar" o parceiro. Muitas vezes percebido como "carente".

EVITANTE (23%): desconforto com intimidade emocional, tende a se fechar quando pressionado, valoriza independência acima de tudo.

DESORGANIZADO (2%): mistura de ansioso e evitante, frequentemente resultado de trauma.

Por que importa: você e sua ex/seu ex têm estilos de apego. Esses estilos criam padrões previsíveis. O estilo ansioso + evitante é a combinação mais comum em relacionamentos que terminam e tentam reatar — e também a que mais precisa de trabalho consciente.`,
        realExample: 'Rafael (ansioso) e Juliana (evitante): quanto mais ele perseguia, mais ela recuava. Quando ele aprendeu a criar espaço — com segurança, não como punição — o ciclo se inverteu.',
        exercisePrompt: 'Identifique seu estilo de apego e o estilo que acredita que a outra pessoa tem. Como esses estilos interagiram no relacionamento? Como podem interagir diferente?',
        mission: 'Leia sobre seu estilo de apego e identifique 3 comportamentos específicos que ele gerou no relacionamento anterior.',
        duration: 25,
      },
    ],
  },
  {
    id: 'communication',
    icon: '💬',
    titleFemaleTarget: 'Comunicação & Confiança Masculina',
    titleMaleTarget: 'Comunicação & Autoconfiança Feminina',
    subtitleFemaleTarget: 'Voz, linguagem corporal, conversas memoráveis',
    subtitleMaleTarget: 'Comunicar sem parecer carente, silêncio estratégico',
    imageQueryFemale: 'confident man speaking leadership dark',
    imageQueryMale: 'confident woman speaking assertive elegant',
    persuasiveSubtitleFemale: 'Voz, linguagem corporal, conversas que ficam na memória — comunicação que cria atração mesmo sem dizer nada romântico.',
    persuasiveSubtitleMale: 'Como se comunicar com ele sem parecer carente, ansiosa ou dependente — e criar curiosidade sem palavras.',
    futurePacingFemale: 'Imagina ter uma conversa com ela onde cada coisa que você diz aumenta o interesse — e ao final ela quer saber mais sobre você, não menos.',
    futurePacingMale: 'Imagina a sensação de enviar uma mensagem e ele responder imediatamente, animado — porque o que você disse criou curiosidade irresistível.',
    bulletsFemale: [
      'O poder da voz: como velocidade e tom impactam a percepção de atratividade',
      'Assertividade — comunicar o que quer sem agressão nem submissão',
      'Conversas memoráveis: como criar conexão profunda em minutos',
      'Silêncio estratégico — quando NÃO falar é mais poderoso',
      'Linguagem corporal que comunica confiança antes de dizer uma palavra',
    ],
    bulletsMale: [
      'Como escrever mensagens que criam expectativa — não ansiedade',
      'O silêncio estratégico e quando usá-lo com ele',
      'Como se posicionar sem parecer carente ou disponível demais',
      'Conversas que criam conexão emocional genuína',
      'O que dizer quando ele finalmente entrar em contato',
    ],
    layer: 2,
    lessons: [
      {
        id: 'voice-power',
        title: 'O Poder da Voz — O Instrumento Mais Subestimado',
        concept: `Pesquisas mostram que o tom de voz impacta mais a percepção de atratividade do que o conteúdo do que é dito. Uma voz mais grave, mais lenta e com variação de tom é consistentemente percebida como mais atraente e confiável.

Elementos da voz poderosa:
- VELOCIDADE: falar mais devagar comunica segurança. Quem não tem medo de ocupar tempo e atenção.
- VOLUME: projetado, não alto. A diferença entre autoridade e agressão.
- PAUSAS: os melhores comunicadores usam silêncio estratégico. A pausa antes de um ponto importante cria antecipação.
- TOM: variar entre grave e médio. Monotomia é invisível.
- PRONÚNCIA: palavras claras, sem engolir sílabas por ansiedade.

A voz é treinável. Melhora com prática diária de leitura em voz alta, canto, e atenção consciente durante conversas.`,
        realExample: 'Dois candidatos idênticos em qualificação fazem entrevistas. O que fala mais devagar, com pausas e projeção, é contratado. O entrevistador não consegue articular por quê — "pareceu mais confiante".',
        exercisePrompt: 'Grave 2 minutos de você falando sobre algo que conhece bem. Ouça. Avalie: velocidade, pausas, variação de tom. Refaça incorporando 1 melhoria.',
        mission: 'Por 7 dias, leia em voz alta por 5 minutos todas as manhãs. Foque em velocidade e projeção.',
        duration: 15,
      },
      {
        id: 'assertiveness',
        title: 'Assertividade — Comunicar sem Agressão nem Submissão',
        concept: `A comunicação humana opera em três modos: passivo (evita conflito, suprime necessidades), agressivo (impõe necessidades sem considerar o outro), assertivo (expressa necessidades com respeito por ambos).

O modo assertivo é o mais atraente — e o mais raro. A maioria das pessoas oscila entre passividade e agressão, dependendo do contexto.

Fórmula da comunicação assertiva:
"Quando [comportamento específico], eu sinto [emoção] porque [impacto]. Eu preferiria [pedido claro]."

Sem julgamento, sem generalização, sem punição emocional. Apenas honestidade direta e respeitosa.

Por que assertividade atrai: comunicar o que você quer e o que não quer — sem desculpas, sem pressão — demonstra que você tem limites internos sólidos. E pessoas com limites sólidos são percebidas como mais valiosas.`,
        realExample: '"Você sempre chega atrasado(a)" (agressivo) vs. "Quando você chega depois do combinado, eu me sinto desrespeitado(a). Posso contar com você às 8 da próxima vez?" (assertivo). Mesma situação, resultado completamente diferente.',
        exercisePrompt: 'Identifique 3 situações recentes onde você foi passivo(a) ou agressivo(a) quando poderia ter sido assertivo(a). Reescreva a comunicação no formato assertivo.',
        mission: 'Esta semana, em 2 situações, use a fórmula assertiva explicitamente. Observe as reações.',
        duration: 20,
      },
    ],
  },
  {
    id: 'style',
    icon: '👔',
    titleFemaleTarget: 'Estilo & Aparência Masculina',
    titleMaleTarget: 'Estilo & Presença Feminina',
    subtitleFemaleTarget: 'Guia por tipo de corpo, skincare, cabelo, perfume',
    subtitleMaleTarget: 'Aparência que transmite autoestima, perfume e memória',
    imageQueryFemale: 'stylish man fashion dark minimal elegant',
    imageQueryMale: 'elegant woman fashion confident dark',
    persuasiveSubtitleFemale: 'Transforme sua aparência em um ativo de atração — guia completo por tipo de corpo, skincare, cabelo e a estratégia do perfume.',
    persuasiveSubtitleMale: 'Aparência que transmite autoestima genuína — não vaidade. O guia que faz ele notar que você mudou.',
    futurePacingFemale: 'Imagina o momento em que ela te vê depois das mudanças e percebe que há algo diferente — mais atraente, mais seguro. Ela não consegue identificar o que é, mas não consegue parar de olhar.',
    futurePacingMale: 'Imagina ele te ver depois de 3 semanas e ter aquela expressão de "algo mudou nela" — sem conseguir parar de pensar no que foi.',
    bulletsFemale: [
      'Estilo como identidade: como suas roupas afetam como você pensa e age',
      'Guia completo de fit por tipo de corpo masculino',
      'Skincare masculino: rotina de 5 minutos com resultado visível em 30 dias',
      'Cabelo: cortes que funcionam para reconquista',
      'Perfume como memória emocional — estratégia olfativa para reconquista',
    ],
    bulletsMale: [
      'Como criar uma aparência que transmite autoestima sem parecer superficial',
      'As 5 peças que transformam qualquer guarda-roupa feminino',
      'Skincare e beleza: o que realmente faz diferença',
      'Perfume: como criar uma assinatura olfativa nova — diferente dos tempos com ele',
      'A psicologia da mudança visual e como ela afeta a percepção dele',
    ],
    layer: 2,
    lessons: [
      {
        id: 'style-identity',
        title: 'Estilo como Identidade — Muito Além da Moda',
        concept: `Pesquisadores de "enclothed cognition" (cognição vestida) demonstraram que as roupas não apenas afetam como os outros nos percebem — afetam como nós mesmos pensamos e agimos.

Quando você veste roupas que associa a competência, você age com mais competência. Quando veste algo que te faz sentir atraente, você age com mais confiança. A roupa não é superficial — é parte do sistema de identidade.

Princípios universais de estilo de impacto:
1. FIT é 80% do impacto — uma peça simples bem ajustada supera algo caro mal servido
2. COERÊNCIA — ter um estilo reconhecível é mais poderoso que variedade aleatória
3. INTENÇÃO — cada peça deveria ser uma escolha, não um acaso
4. QUALIDADE sobre quantidade — 5 peças excelentes > 20 mediocres
5. GROOMING — roupa perfeita com cabelo descuidado cancela o efeito`,
        realExample: 'Dois homens idênticos, mesmo nível econômico. Um usa calça chino bem cortada, camisa branca que serve, tênis limpo. O outro usa calça larga, camiseta amassada, tênis sujo. A diferença de percepção é de 40 pontos de atratividade percebida em estudos cegos.',
        exercisePrompt: 'Avalie seu guarda-roupa atual: quais peças servem bem e representam quem você quer ser? Quais precisam ir embora? Qual é a próxima compra que fará mais diferença?',
        mission: 'Esta semana, use um conjunto completo que represente seu eu futuro — mesmo sem ocasião especial.',
        duration: 18,
      },
      {
        id: 'fragrance',
        title: 'Perfume — A Memória Emocional Mais Poderosa',
        concept: `O olfato é o único sentido que projeta diretamente para o sistema límbico — o centro das emoções — sem passar pelo tálamo. Isso explica por que um cheiro pode ativar memórias emocionais décadas depois com intensidade quase idêntica ao momento original.

Para a reconquista, isso é profundamente estratégico: se você usa o mesmo perfume que usava nos melhores momentos do relacionamento, ele pode reativar memórias emocionais positivas instintivamente.

Mas há mais: estudos de pheromônios e MHC (complexo de histocompatibilidade principal) mostram que somos atraídos por pessoas cujo sistema imunológico é diferente do nosso — e detectamos isso através do olfato.

Como usar perfume estrategicamente:
- Encontre um perfume que se torne SUA assinatura — que as pessoas associem a você
- Aplique nos pulsos, pescoço, detrás das orelhas e atrás dos joelhos
- Menos é mais — o perfume deve ser descoberto, não anunciado
- Mude de perfume quando quiser criar nova impressão`,
        realExample: 'Mariana muda de perfume após o término. Quando o ex a encontra 3 semanas depois, o cheiro novo cria uma associação diferente — não com os conflitos, mas com uma mulher nova.',
        exercisePrompt: 'Que perfume você usa atualmente? Que memória ele pode ativar na outra pessoa? Considere: é estratégico usar o mesmo ou criar uma nova assinatura olfativa?',
        mission: 'Visite uma perfumaria esta semana. Teste 5 perfumes. Escolha 1 que vai usar exclusivamente por 30 dias — que se tornará sua assinatura.',
        duration: 12,
      },
    ],
  },
  {
    id: 'social',
    icon: '🌐',
    titleFemaleTarget: 'Vida Social de Alto Valor',
    titleMaleTarget: 'Vida Social Magnética',
    subtitleFemaleTarget: 'Círculo magnético, networking, redes estratégicas',
    subtitleMaleTarget: 'Vida que ele inveja estar de fora, ciúme saudável',
    imageQueryFemale: 'social group friends luxury lifestyle dark',
    imageQueryMale: 'woman social events lifestyle elegant friends',
    persuasiveSubtitleFemale: 'Como construir um círculo magnético que gera prova social poderosa — sem precisar de contato direto com ela.',
    persuasiveSubtitleMale: 'Construa a vida que faz ele querer estar dentro — e sentir que está perdendo algo por estar fora.',
    futurePacingFemale: 'Imagina ela ouvir de amigos em comum que você está indo muito bem, que está em eventos interessantes, que está rodeado de pessoas de valor. Tudo isso sem você ter dito uma palavra a ela.',
    futurePacingMale: 'Imagina ele ver suas stories de um evento incrível e perceber que você tem uma vida plena e feliz sem ele. Esse é o momento em que o instinto de conquista se ativa.',
    bulletsFemale: [
      'Capital social: como construir a teia de conexões que aumenta seu valor percebido',
      'Prova social estratégica: como ser visto(a) de formas que chegam até ela',
      'Como se tornar o conector do seu grupo — o papel de maior status social',
      'Networking de alto valor: círculos que elevam seu nível e sua percepção',
      'Como aparecer nos contextos certos sem parecer calculista',
    ],
    bulletsMale: [
      'Como construir uma vida social que faz ele querer estar presente',
      'Prova social feminina: como ela chega até ele sem contato direto',
      'O ciúme saudável — como criá-lo de forma ética e eficaz',
      'Eventos, grupos e comunidades que elevam seu perfil',
      'Como suas redes sociais podem trabalhar pela reconquista enquanto você dorme',
    ],
    layer: 2,
    lessons: [
      {
        id: 'social-capital',
        title: 'Capital Social — A Moeda Mais Valiosa',
        concept: `Robert Putnam, sociólogo de Harvard, define capital social como as conexões entre pessoas — a teia de confiança e reciprocidade que nos permite realizar coisas que não conseguiríamos sozinhos.

Em termos de atração, capital social se manifesta como: ser bem-relacionado(a), ser apresentado(a) positivamente por outros, ser o tipo de pessoa que conecta pessoas, ser visto(a) em contextos de prestígio social.

A prova social (Cialdini) amplifica isso: quando outros demonstram que você é valoroso(a), a atração da pessoa que nos interessa aumenta automaticamente. Ver que você é desejado(a) socialmente ativa o mecanismo evolutivo de "se outros querem, deve valer a pena."

Como construir capital social:
- Seja o conector — apresente pessoas que poderiam se beneficiar mutuamente
- Seja anfitrião(ã) — crie os eventos que os outros comparecem
- Mantenha relacionamentos sem agenda — não só quando precisa de algo
- Apareça em contextos de alto valor — eventos, grupos, comunidades`,
        realExample: 'Depois do término, Felipe decide se tornar o "conector" do seu grupo. Em 3 semanas, é mencionado positivamente em conversas que chegam indiretamente até sua ex. A imagem que ela tem dele muda sem nenhum contato direto.',
        exercisePrompt: 'Mapeie sua rede social atual: quem são as 10 pessoas mais próximas? Há diversidade de círculos? Quem você poderia conectar com quem? Crie 2 apresentações essa semana.',
        mission: 'Esta semana, faça 3 conexões genuínas: apresente duas pessoas que deveriam se conhecer, compareça a um evento novo, reative uma amizade de valor.',
        duration: 22,
      },
    ],
  },
  {
    id: 'mindset',
    icon: '⚡',
    titleFemaleTarget: 'Mentalidade Estoica',
    titleMaleTarget: 'Mentalidade de Mulher de Alto Valor',
    subtitleFemaleTarget: 'Marcus Aurelius, Ryan Holiday, controle emocional',
    subtitleMaleTarget: 'Autossuficiência, sem depender de validação masculina',
    imageQueryFemale: 'stoic warrior dark contemplative strength',
    imageQueryMale: 'powerful woman independent confident dark',
    persuasiveSubtitleFemale: 'Marcus Aurelius, Ryan Holiday e a neurociência da resiliência — controle emocional que transforma dor em poder.',
    persuasiveSubtitleMale: 'Autossuficiência emocional genuína — a qualidade que mais atrai homens e que nenhum jogo ou técnica pode substituir.',
    futurePacingFemale: 'Imagina chegar ao ponto onde o resultado da reconquista não determina mais seu humor. Onde você é tão sólido que a possibilidade de ela não voltar não te destrói — e paradoxalmente, é exatamente isso que aumenta as chances dela voltar.',
    futurePacingMale: 'Imagina acordar um dia e perceber que está genuinamente bem — não fingindo, não performando. E que esse estado de completude é o que faz ele pensar: "não consigo parar de pensar nela."',
    bulletsFemale: [
      'Estoicismo aplicado: como separar o que está sob seu controle do que não está',
      'Memento mori e amor fati — perspectiva que transforma o sofrimento',
      'Ryan Holiday: o obstáculo é o caminho — como o término vira combustível',
      'Regulação emocional: técnicas práticas para momentos de crise',
      'Como construir identidade sólida que não depende do resultado da reconquista',
    ],
    bulletsMale: [
      'Autossuficiência emocional genuína — não performance, não frieza',
      'Como parar de buscar validação masculina sem se tornar distante',
      'A mulher de alto valor: construindo de dentro para fora',
      'Limites que criam respeito — não estratégia, mas autoconhecimento',
      'Por que completude atrai e necessidade repele — a física da reconquista',
    ],
    layer: 2,
    lessons: [
      {
        id: 'stoicism-basics',
        title: 'Estoicismo Aplicado — A Filosofia da Força Interior',
        concept: `O Estoicismo foi fundado por Zenão de Cítio por volta de 300 a.C., mas sua relevância para a vida moderna é surpreendente. Marcus Aurelius, imperador romano e general, praticava Estoicismo para manter clareza em meio ao caos.

O princípio central: distinguir o que está sob nosso controle do que não está. Nossos pensamentos, escolhas, respostas — sob nosso controle. Os pensamentos dos outros, os acontecimentos externos, o passado — fora do nosso controle.

Aplicado à reconquista: você não pode controlar se ela(e) vai querer voltar. Você pode controlar quem você se torna enquanto espera. E quem você se torna é exatamente o que vai determinar o resultado.

Ryan Holiday, em The Obstacle is the Way, moderniza o Estoicismo: o obstáculo não está no caminho — é o caminho. A dor do término não é um desvio da sua jornada de crescimento. É a jornada.

Prática estoica diária: memento mori (lembrar da mortalidade para dar perspectiva), amor fati (amar o que aconteceu, sem negação), premeditatio malorum (antecipar dificuldades para não ser pego de surpresa).`,
        realExample: '"A qualidade de sua vida é determinada pelo foco de sua atenção" — Epicteto. Quando você foca no que pode controlar (seu crescimento), deixa de desperdiçar energia no que não pode (a decisão dela/dele).',
        exercisePrompt: 'Faça duas listas: (1) O que está fora do meu controle nessa situação. (2) O que está completamente sob meu controle. Risca a lista 1. Concentre toda sua energia na lista 2.',
        mission: 'Por 7 dias, quando sentir angústia, pergunte: "Isso está sob meu controle?" Se não, redirecione a energia para o que está.',
        duration: 25,
      },
      {
        id: 'high-value-woman',
        title: 'A Mulher de Alto Valor — Construindo de Dentro para Fora',
        titleMale: 'A Mentalidade de Quem Não Precisa Perseguir',
        concept: `O conceito de "mulher de alto valor" foi distorcido pela internet em algo que parece arrogância ou frieza calculada. Mas a origem genuína do conceito é poderosa e saudável.

Uma mulher de alto valor genuína se caracteriza por:
1. Autossuficiência emocional — não precisa de validação masculina para se sentir completa
2. Seletividade natural — não aceita menos do que merece, não por estratégia, mas por autoconhecimento
3. Vida plena — projetos, amizades, paixões que existem independentemente de qualquer relacionamento
4. Presença — quando está com alguém, está totalmente presente; quando está consigo mesma, também
5. Respeito por si mesma — limites claros que não exigem explicação

O paradoxo: quanto menos você precisa de um homem específico para ser feliz, mais ele sente que precisa ser o homem que ficará com você. A necessidade repele. A completude atrai.

Isso não é jogo. É resultado natural de investir seriamente em si mesma.`,
        realExample: 'Carla passa 3 semanas se dedicando ao trabalho, amigos e um projeto criativo que sempre adiou. Quando seu ex sugere um café, ela confirma com entusiasmo genuíno — mas do lugar de quem tem uma vida, não de quem estava esperando essa ligação.',
        exercisePrompt: 'Em quais áreas da vida você ainda busca validação externa para se sentir bem? Para cada uma, identifique como construir validação interna genuína.',
        mission: 'Esta semana, tome 3 decisões importantes com base no que você quer — sem verificar o que ele pensaria.',
        duration: 20,
      },
    ],
  },
]

export const getModuleById = (id: string): Module | undefined =>
  MODULES.find(m => m.id === id)

export const getLessonById = (moduleId: string, lessonId: string): Lesson | undefined =>
  MODULES.find(m => m.id === moduleId)?.lessons.find(l => l.id === lessonId)
