import { ExpandedModule } from './protocolExpanded.types'

// ── MODULE 5 — Reconexão (Days 29–35) ──────────────────────────────────────

export const MODULE_5: ExpandedModule = {
  module: 5,
  title: 'Reconexão',
  goal: 'Consolidar a reconquista ou seguir em frente com clareza, construindo um futuro de alto valor.',
  duration: 'Dias 29–35',
  days: [

    // ══════════════════════════════════════════════════════════════════════
    // DAY 29 — O Momento da Verdade
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 29,
      module: 5,
      title: 'O Momento da Verdade',
      theme: 'Clareza sobre o que é real é mais valiosa que qualquer esperança.',
      subtopics: [
        {
          id: 'm5d1s1',
          type: 'self_analysis',
          title: 'Diagnóstico Honesto da Situação',
          objective: 'Fazer uma avaliação objetiva e honesta do status de reconexão.',
          exercises: [
            { id: 'm5d1s1e01', type: 'self_analysis', title: 'Avalie o status em escala de 1-10 com evidências', description: 'Não "sinto que ela quer voltar" — "ela entrou em contato X vezes com calor Y, houve encontro Z." Baseie a nota em fatos observáveis.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d1s1e02', type: 'reflection', title: 'Separe fatos de interpretações desejosas', description: 'Duas colunas: O que realmente aconteceu | O que eu interpretei ou espero que signifique. Seja brutalmente honesto na segunda coluna.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d1s1e03', type: 'self_analysis', title: 'Liste todos os sinais de abertura recebidos nas últimas 4 semanas', description: 'Mensagens, likes, perguntas por amigos em comum, encontros casuais. Só fatos. Sem amplificar pequenos sinais em grandes evidências.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d1s1e04', type: 'reflection', title: 'Qual seria a leitura de um amigo externo imparcial sobre esses sinais?', description: 'Se você contasse todos os sinais para um amigo que não te conhece, o que ele concluiria? Isso às vezes revela o que o desejo oculta.', durationMinutes: 10, difficulty: 3 },
            { id: 'm5d1s1e05', type: 'journaling', title: 'Escreva: qual é a decisão mais honesta que você pode tomar hoje', description: 'Baseado nos fatos, não nos desejos. Aprofundar reconexão? Aguardar mais? Seguir em frente? Escreva a decisão que você faria se fosse completamente racional.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d1s1e06', type: 'reflection', title: 'O que você perderia ao seguir em frente vs. ao continuar aguardando', description: 'Seguir em frente tem custo? Continuar aguardando tem custo? Compare os dois honestamente. Decisão informada é melhor que esperança indefinida.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d1s1e07', type: 'commitment', title: 'Tome a decisão e escreva-a claramente', description: 'Decisão com data: "Em [data], se não houver [sinal específico], vou [ação concreta]." Ambiguidade infinita é a forma mais cara de se manter preso.', durationMinutes: 10, difficulty: 2 },
          ],
        },
        {
          id: 'm5d1s2',
          type: 'reconquest_strategy',
          title: 'Ação Baseada no Status Real',
          objective: 'Definir o próximo passo estratégico baseado na avaliação honesta.',
          exercises: [
            { id: 'm5d1s2e01', type: 'reconquest_strategy', title: 'Cenário A: ela demonstrou abertura — como aprofundar', description: 'Plano para os próximos 7 dias: próxima interação, próximo encontro, como criar progressão natural sem pressão.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d1s2e02', type: 'reconquest_strategy', title: 'Cenário B: abertura mínima — proposta ou mais espaço?', description: 'Com abertura mínima: fazer a proposta direta ou dar mais 7 dias de espaço? Analise o que os sinais indicam sobre o timing.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d1s2e03', type: 'reconquest_strategy', title: 'Cenário C: ausência de sinais — proposta definitiva antes de fechar', description: 'Se não houve nenhum sinal em 28 dias, a proposta clara (pessoalmente ou por ligação) é melhor que o silêncio infinito. Planeje como fazer isso.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d1s2e04', type: 'reflection', title: 'O próximo passo específico que você vai tomar hoje', description: 'Uma ação concreta, não uma intenção vaga. "Vou X hoje." Não "Vou pensar em X esta semana." Ação define direção.', durationMinutes: 10, difficulty: 1 },
            { id: 'm5d1s2e05', type: 'commitment', title: 'Compromisso: agir com dignidade independente da resposta', description: 'Escreva: "Vou agir de forma que eu me orgulhe independente do resultado. Nada de súplica, nada de pressão, nada de drama."', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d1s3',
          type: 'mindset_reprogramming',
          title: 'A Reconquista Mais Importante',
          objective: 'Reconhecer e celebrar a reconquista de si mesmo como o resultado primário.',
          exercises: [
            { id: 'm5d1s3e01', type: 'reflection', title: 'Quem você era no Dia 1 vs. quem você é no Dia 29', description: 'Compare em detalhes: estado emocional, hábitos, autoestima, clareza de propósito, habilidades. O delta entre Dia 1 e Dia 29 é a verdadeira conquista.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d1s3e02', type: 'journaling', title: 'Liste o que você ganhou que não depende da resposta dela', description: 'Habilidades, hábitos, autoconhecimento, autoestima, vida mais rica. Tudo que é seu independente de qualquer resultado externo.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d1s3e03', type: 'reflection', title: 'Se ela nunca voltasse, sua jornada teria valido a pena?', description: 'Honestamente: baseado no que você ganhou, a resposta deve ser sim. Se a resposta for não, examine o que ainda precisa construir para que sua vida faça sentido independente dela.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d1s3e04', type: 'affirmation', title: 'Declaração de vitória independente do resultado externo', description: '"Conquistei a melhor versão de mim que já tive. Esse é o resultado mais importante. Tudo mais é bônus." Diga 5x em voz alta com convicção.', durationMinutes: 5, difficulty: 1 },
            { id: 'm5d1s3e05', type: 'meditation', title: 'Meditação de gratidão pela jornada — 15 minutos', description: 'Agradecimento pela dor que iniciou o processo, pela disciplina que te trouxe aqui, pelo homem que você está se tornando. 15 minutos em silêncio.', durationMinutes: 15, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 30 — Reconstruindo a Conexão
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 30,
      module: 5,
      title: 'Reconstruindo a Conexão',
      theme: 'Reconexão é construção, não recuperação.',
      subtopics: [
        {
          id: 'm5d2s1',
          type: 'reconquest_strategy',
          title: 'A Base do Novo Começo',
          objective: 'Estabelecer os pilares de um novo relacionamento saudável.',
          exercises: [
            { id: 'm5d2s1e01', type: 'reflection', title: 'Por que "voltar ao que era" é o erro mais comum', description: 'O que existia tinha os padrões que levaram ao fim. Recuperar o velho é reeditar o problema. Como você vai comunicar que o que está propondo é genuinamente novo?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s1e02', type: 'journaling', title: 'Escreva os 5 pilares do novo relacionamento que você quer', description: 'Comunicação honesta, independência individual, propósito compartilhado, respeito mútuo, crescimento conjunto. Adapte para a sua realidade específica.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d2s1e03', type: 'reflection', title: 'O que você vai fazer diferente desta vez — concretamente', description: 'Não "vou ser melhor." Comportamentos específicos: "Quando houver conflito, vou pausar 20 minutos antes de responder." Especificidade torna a mudança real.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s1e04', type: 'self_analysis', title: 'Que padrão do relacionamento anterior você tem mais risco de repetir?', description: 'Dependência excessiva? Abandono da própria missão? Ciúme? Comunicação passivo-agressiva? Identifique o padrão principal para vigilância ativa.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d2s1e05', type: 'journaling', title: 'Como incorporar o término em vez de tentar apagá-lo', description: 'O período de separação te transformou. Como você pode reconhecer isso honestamente em conversa com ela, de forma que fortaleça em vez de reavivar dor?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s1e06', type: 'commitment', title: 'Escreva o que você pode honestamente oferecer agora vs. antes', description: 'Comparação honesta: o que você tem agora que não tinha? Isso é a base real da proposta de novo começo.', durationMinutes: 15, difficulty: 2 },
          ],
        },
        {
          id: 'm5d2s2',
          type: 'social_behavior',
          title: 'A Conversa Honesta',
          objective: 'Desenvolver habilidade para ter a conversa de reconexão com autenticidade.',
          exercises: [
            { id: 'm5d2s2e01', type: 'reflection', title: 'O tom ideal da conversa de reconexão', description: 'Não sentimental demais (cria pressão). Não frio demais (não cria conexão). Onde está o equilíbrio? Descreva com exemplos de frases.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s2e02', type: 'journaling', title: 'Escreva o que você vai falar na conversa de reconexão', description: 'O que você aprendeu, o que entende que aconteceu, o que mudou em você, o que você está propondo. Máximo de 5 pontos. Claro, direto, sem drama.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d2s2e03', type: 'reflection', title: 'Como responder se ela trouxer mágoas do passado na conversa', description: 'Ela vai mencionar momentos que a machucaram. Como você responde validando sem se colapsar em culpa ou se defender automaticamente?', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d2s2e04', type: 'behavioral_action', title: 'Pratique ouvir sem interromper por 10 minutos com alguém hoje', description: 'A habilidade de ouvir completamente antes de responder é o que cria a segurança emocional que ela precisa sentir. Pratique agora.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s2e05', type: 'reconquest_strategy', title: 'Ambiente neutro e novo para o encontro de reconexão', description: 'Não o restaurante do primeiro encontro. Não a casa de um dos dois. Lugar novo = nova narrativa = possibilidade aberta. Defina onde seria ideal.', durationMinutes: 10, difficulty: 1 },
            { id: 'm5d2s2e06', type: 'commitment', title: 'Compromisso: ouvir mais que falar na primeira conversa real', description: 'Regra: 70% ouvir, 30% falar. Quem ouve mais, controla menos e conecta mais. Escreva esse compromisso.', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d2s3',
          type: 'emotional_regulation',
          title: 'Estado Emocional para o Reencontro',
          objective: 'Cultivar o estado interno correto antes do encontro ou conversa significativa.',
          exercises: [
            { id: 'm5d2s3e01', type: 'breathing', title: 'Protocolo de calibragem pré-encontro completo', description: 'Exercício leve (30min) + banho consciente + 5 respirações profundas + visualização de encontro fluido + afirmação "Estou presente, estou bem."', durationMinutes: 50, difficulty: 1 },
            { id: 'm5d2s3e02', type: 'visualization', title: 'Visualização do encontro ideal: 15 minutos', description: 'Você chega calmamente. Ela está lá. A conversa flui. Você ouve genuinamente. Você se expressa com clareza. O resultado, seja qual for, é aceito com dignidade.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d2s3e03', type: 'reflection', title: 'Qual é o objetivo do encontro — conexão, não convencimento', description: 'Se você vai para convencer, ela sente a pressão. Se você vai para genuína conexão, ela se abre. Escreva o objetivo correto e memorize.', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d2s3e04', type: 'affirmation', title: 'Afirmação de presença e abertura', description: '"Estou aqui completamente. Não preciso de nenhum resultado específico. Confio no processo." Diga 10x antes do encontro.', durationMinutes: 5, difficulty: 1 },
            { id: 'm5d2s3e05', type: 'behavioral_action', title: 'Postura de presença: 2 minutos de power pose antes de qualquer encontro', description: '2 minutos de postura de poder (Amy Cuddy) eleva testosterona 20%, reduz cortisol. Faça em local privado antes de qualquer encontro significativo.', durationMinutes: 5, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 31 — Nova Dinâmica de Relacionamento
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 31,
      module: 5,
      title: 'Nova Dinâmica de Relacionamento',
      theme: 'Dois completos que escolhem estar juntos — não dois incompletos que precisam um do outro.',
      subtopics: [
        {
          id: 'm5d3s1',
          type: 'mindset_reprogramming',
          title: 'Independência Interdependente',
          objective: 'Estabelecer a dinâmica correta de dois indivíduos completos em relacionamento.',
          exercises: [
            { id: 'm5d3s1e01', type: 'reflection', title: 'O modelo de relacionamento interdependente saudável', description: 'Pesquise sobre relacionamentos interdependentes vs. codependentes. Quais são as diferenças concretas em comportamento, comunicação e espaço?', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d3s1e02', type: 'self_analysis', title: 'Em que áreas você era codependente no relacionamento anterior?', description: 'Cancelava seus planos por ela? Abandonava hobbies? Deixava sua missão em segundo plano? Precisava da aprovação dela para se sentir bem? Lista honesta.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d3s1e03', type: 'journaling', title: 'Escreva como você vai manter sua identidade dentro do novo relacionamento', description: 'Específico: que hábitos mantém, que tempo preserva para si mesmo, que aspectos da sua missão não são negociáveis mesmo no contexto do relacionamento.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s1e04', type: 'reflection', title: 'Como independência mantida é mais atraente que fusão total', description: 'O parceiro que perde a identidade no relacionamento perde a atração do outro. A pessoa que mantém identidade, mistério e vida própria sustenta a atração. Elabore.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s1e05', type: 'behavioral_action', title: 'Continue sua rotina de treino e missão mesmo com reconexão acontecendo', description: 'Demonstração em tempo real: mesmo com ela de volta, você não abandona o que construiu. Isso é independência demonstrada — não declarada.', durationMinutes: 60, difficulty: 2 },
            { id: 'm5d3s1e06', type: 'commitment', title: 'Os 3 aspectos da sua vida que jamais sacrificará pelo relacionamento', description: 'Escreva os 3 não-negociáveis: sua missão, seus treinos, seus amigos/família. Esses são os limites que protegem tanto você quanto o relacionamento.', durationMinutes: 10, difficulty: 2 },
          ],
        },
        {
          id: 'm5d3s2',
          type: 'social_behavior',
          title: 'Limites como Ato de Amor',
          objective: 'Estabelecer limites claros com amor que protejam o relacionamento.',
          exercises: [
            { id: 'm5d3s2e01', type: 'reflection', title: 'Limites não são muros — são acordos que protegem o que é precioso', description: 'Qual é a diferença entre limites como punição e limites como proteção? Como você vai comunicar limites de forma amorosa mas clara?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s2e02', type: 'journaling', title: 'Escreva 5 limites que você vai estabelecer no novo relacionamento', description: 'Comportamentos que você não vai tolerar. Padrões que você não vai repetir. Escreva cada um com a razão — proteção, não punição.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s2e03', type: 'reflection', title: 'Como você vai comunicar um limite quando for necessário?', description: 'Script: "Quando X acontece, eu sinto Y. Preciso que Z." Sem acusação, sem dramaturgia, sem negociação de valor próprio. Escreva 2 exemplos.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s2e04', type: 'self_analysis', title: 'Que limites você NÃO estabeleceu no relacionamento anterior que precisava?', description: 'Esses são os limites mais urgentes agora. Identifique os 2 ou 3 que teriam mudado o relacionamento se existissem.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d3s2e05', type: 'behavioral_action', title: 'Pratique estabelecer um limite pequeno hoje com alguém', description: 'Em qualquer contexto, pratique dizer não ou estabelecer uma expectativa clara sem drama. Isso treina o músculo que você vai precisar no relacionamento.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d3s2e06', type: 'commitment', title: 'Compromisso: não negociarei meu bem-estar por medo de perder', description: 'Escreva: "Estabeleço limites porque me respeito e respeito o relacionamento. Não por medo — por amor."', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d3s3',
          type: 'emotional_regulation',
          title: 'Prevenindo Recaída de Padrões',
          objective: 'Identificar e interromper padrões antigos antes que se estabeleçam.',
          exercises: [
            { id: 'm5d3s3e01', type: 'self_analysis', title: 'Mapeie os padrões do relacionamento anterior que você tem risco de repetir', description: 'Dependência, abandono de si mesmo, ciúme, passividade, comunicação indireta. Quais são os seus padrões de risco específicos?', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d3s3e02', type: 'reflection', title: 'Quais situações vão ativar esses padrões?', description: 'Quando ela fica quieta. Quando parece distante. Quando menciona um amigo. Identifique os gatilhos específicos dos seus padrões.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d3s3e03', type: 'commitment', title: 'Plano de intervenção para cada padrão de risco', description: 'Para cada padrão identificado: "Quando sentir o impulso de [padrão antigo], vou [ação regulada específica]." Escreva o plano antes que o momento chegue.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d3s3e04', type: 'behavioral_action', title: 'Sistema de check-in semanal: avaliação dos padrões', description: 'Defina um horário semanal para perguntar: "Estou repetindo algum padrão antigo? O que preciso ajustar?" Agende isso agora.', durationMinutes: 10, difficulty: 1 },
            { id: 'm5d3s3e05', type: 'reflection', title: 'Como pedir ajuda a um amigo de confiança para accountability', description: 'Um amigo que pode te avisar quando você está recaindo em padrões antigos é um dos recursos mais valiosos. Quem seria essa pessoa para você?', durationMinutes: 10, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 32 — Consolidação da Mudança
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 32,
      module: 5,
      title: 'Consolidação da Mudança',
      theme: 'Mudança real é aquela que você faria mesmo que ela nunca voltasse.',
      subtopics: [
        {
          id: 'm5d4s1',
          type: 'mindset_reprogramming',
          title: 'Transformação Sustentável vs. Performance',
          objective: 'Distinguir e solidificar mudança real versus esforço temporário.',
          exercises: [
            { id: 'm5d4s1e01', type: 'self_analysis', title: 'Honestidade radical: o que você mudou genuinamente vs. o que ainda é esforço?', description: 'Mudança genuína: acontece automaticamente, não requer força de vontade constante. Esforço: você precisa se lembrar de fazer. Liste cada hábito em sua categoria.', durationMinutes: 20, difficulty: 3 },
            { id: 'm5d4s1e02', type: 'reflection', title: 'Pesquise a ciência da formação de hábitos (James Clear — Atomic Habits)', description: 'Um hábito se forma quando o comportamento se torna automático — não quando você decide fazê-lo. O que ainda está no estágio de decisão vs. automatismo?', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d4s1e03', type: 'journaling', title: 'Sistemas vs. força de vontade — crie sistemas para cada hábito', description: 'Para cada hábito que você quer manter: crie um sistema que o torna mais fácil de fazer do que de não fazer. Ambiente, horário, gatilho, recompensa.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d4s1e04', type: 'self_analysis', title: 'Se ela voltasse hoje e ficasse 3 meses: que padrão antigo voltaria?', description: 'Com o conforto do relacionamento restabelecido, os velhos padrões tentam ressurgir. Qual é o padrão com mais probabilidade de retornar? Prepare-se agora.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d4s1e05', type: 'reflection', title: 'O teste da verificação: você faria esses hábitos mesmo sem audiência?', description: 'Treinaria se ela não pudesse ver? Manteria sua missão se não houvesse resultado visível? Seria o mesmo homem sem plateia? Essa é a prova da autenticidade.', durationMinutes: 10, difficulty: 3 },
            { id: 'm5d4s1e06', type: 'commitment', title: 'Compromisso de 90 dias: os hábitos que você vai manter independente de tudo', description: 'Escreva: "Por 90 dias a partir de hoje, vou [lista de hábitos] independente do resultado com ela, da minha motivação e das circunstâncias." Assine e date.', durationMinutes: 15, difficulty: 1 },
          ],
        },
        {
          id: 'm5d4s2',
          type: 'behavioral_action',
          title: 'Criando Sistemas de Manutenção',
          objective: 'Construir a estrutura que manterá a transformação ao longo do tempo.',
          exercises: [
            { id: 'm5d4s2e01', type: 'behavioral_action', title: 'Crie sua rotina semanal de manutenção', description: 'Dias e horários de treino, tempo de missão, check-ins de saúde emocional, conexões sociais. Uma rotina escrita é uma rotina que acontece.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d4s2e02', type: 'reflection', title: 'Identifique sua comunidade de crescimento pós-protocolo', description: 'Quem vai continuar te desafiando a crescer? Amigos, mentores, grupos? O isolamento é o inimigo da transformação sustentável.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d4s2e03', type: 'behavioral_action', title: 'Configure lembretes semanais de verificação dos princípios', description: 'Um lembrete semanal com as 5 perguntas: "Mantive minha missão? Minha identidade? Meus limites? Minha disciplina? Minha presença?" Configure agora.', durationMinutes: 10, difficulty: 1 },
            { id: 'm5d4s2e04', type: 'journaling', title: 'O manifesto do homem transformado: quem você é agora', description: 'Escreva em primeira pessoa, presente: "Sou o homem que [lista de atributos]. Não porque estou tentando — porque é quem me tornei." Este é seu norte.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d4s2e05', type: 'commitment', title: 'Agenda a releitura deste manifesto mensalmente', description: 'O manifesto que você não relê se perde. Defina o primeiro dia de cada mês como dia de releitura. Configure o lembrete agora.', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d4s3',
          type: 'emotional_regulation',
          title: 'Regulação em Situações de Alta Pressão',
          objective: 'Desenvolver regulação emocional para os momentos mais desafiadores do recomeço.',
          exercises: [
            { id: 'm5d4s3e01', type: 'reflection', title: 'Os primeiros 3 meses de reconexão são os mais críticos — por quê?', description: 'Os velhos padrões são mais fortes quando há gatilhos relacionais. A novidade da reconexão cria oportunidade e vulnerabilidade ao mesmo tempo. Prepare-se conscientemente.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d4s3e02', type: 'behavioral_action', title: 'Protocolo para o primeiro conflito do recomeço', description: 'Quando (não se) surgir o primeiro conflito: pausa de 20 minutos. Regule. Retorne. Diga o que sente sem ataque. Ouça. Valide. Então expresse. Escreva o protocolo.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d4s3e03', type: 'self_analysis', title: 'Que situação específica pode me fazer regredir aos padrões antigos?', description: 'Seja específico: ciúme de X, silêncio por Y horas, mencionar Z pessoa. Conhecer o gatilho específico permite preparar resposta regulada antes do momento.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d4s3e04', type: 'visualization', title: 'Visualize navegando o primeiro conflito do recomeço de forma madura', description: 'Cena específica: ela diz algo que te acerta. Você respira. Você regula. Você responde de forma que você se orgulha. Visualize por 10 minutos.', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d4s3e05', type: 'commitment', title: 'Regra dos 20 minutos antes de qualquer resposta emocional forte', description: 'Escreva a regra: "Nunca responderei a situação emocional intensa sem primeiro 20 minutos de regulação. Sem exceção."', durationMinutes: 5, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 33 — Proteção do Recomeço
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 33,
      module: 5,
      title: 'Proteção do Recomeço',
      theme: 'O que não é cuidado, não cresce.',
      subtopics: [
        {
          id: 'm5d5s1',
          type: 'reconquest_strategy',
          title: 'Os Inimigos do Recomeço',
          objective: 'Identificar e neutralizar os fatores que podem destruir o recomeço antes de florescer.',
          exercises: [
            { id: 'm5d5s1e01', type: 'reflection', title: 'Os 4 inimigos: pressa, passado, padrões, pressão', description: 'Para cada inimigo, descreva como ele se manifestaria na sua situação específica e a estratégia de neutralização.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d5s1e02', type: 'self_analysis', title: 'Qual dos 4 inimigos é o seu maior risco?', description: 'Você tende a apressar compromisso? Trazer o passado? Repetir padrões? Pressionar por garantias? Identifique o seu inimigo principal.', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d5s1e03', type: 'journaling', title: 'Crie um "mapa de riscos" para o recomeço', description: 'Para cada risco identificado: a situação gatilho, o comportamento de risco, a alternativa saudável. Ter o mapa antes do momento é a melhor proteção.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d5s1e04', type: 'reflection', title: 'Como você vai notar quando está regredindo antes que seja tarde', description: 'Sinais de alerta precoce de regressão: comportamentos, pensamentos, sensações. Conhecer seus sinais permite intervenção antes da escalada.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d5s1e05', type: 'commitment', title: 'Plano de ação para quando perceber que está regredindo', description: 'Escreva o protocolo: percebo o sinal → paro e reconheço → aplico [estratégia específica] → retorno ao padrão saudável. Específico e memorável.', durationMinutes: 10, difficulty: 2 },
          ],
        },
        {
          id: 'm5d5s2',
          type: 'emotional_regulation',
          title: 'Construindo Confiança Gradualmente',
          objective: 'Entender como a confiança é reconstruída através de ações consistentes ao longo do tempo.',
          exercises: [
            { id: 'm5d5s2e01', type: 'reflection', title: 'Confiança é construída por ações, não por declarações', description: '"Confie em mim" não constrói confiança. Ações consistentes ao longo do tempo constroem. Quais são as ações específicas que vão reconstruir a confiança dela?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d5s2e02', type: 'journaling', title: 'Crie um "diário de consistência": o que você faz que constrói confiança', description: 'Ações concretas: você disse que ia fazer X e fez. Você estabeleceu um limite e manteve. Você respondeu de forma madura quando poderia ter explodido. Registre.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d5s2e03', type: 'reflection', title: 'Por que confiança reconstruída é mais sólida que a original', description: 'Confiança original é dada. Confiança reconstruída é conquistada — e por isso tem um valor diferente para ambos. Como isso muda a dinâmica do relacionamento?', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d5s2e04', type: 'self_analysis', title: 'Em que você ainda não merece total confiança dela?', description: 'Honestidade. Há áreas onde você ainda está em desenvolvimento? Reconhecer isso internamente te permite ser mais cuidadoso nessas áreas.', durationMinutes: 10, difficulty: 3 },
            { id: 'm5d5s2e05', type: 'commitment', title: 'Compromisso de consistência nos próximos 90 dias', description: 'Escreva: "Vou demonstrar através de ações consistentes, não de palavras, que sou confiável. Cada ação é um depósito na conta de confiança."', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d5s3',
          type: 'mindset_reprogramming',
          title: 'Liberando o Passado',
          objective: 'Soltar o peso do ressentimento para que o novo possa crescer.',
          exercises: [
            { id: 'm5d5s3e01', type: 'reflection', title: 'O que é perdão real vs. fingir que nada aconteceu', description: 'Perdão não é esquecer ou dizer que estava tudo OK. É soltar o peso do ressentimento enquanto mantém as lições. Como você define perdão genuíno?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d5s3e02', type: 'self_analysis', title: 'Que ressentimentos você ainda carrega do relacionamento?', description: 'Liste honestamente. Não para justificar — para reconhecer e então soltar conscientemente. Ressentimento guardado envenena o novo.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d5s3e03', type: 'journaling', title: 'Carta de liberação: escreva, então destrua', description: 'Escreva tudo que você ainda sente sobre o que aconteceu — mágoas, raivas, decepções. Sem enviar. Depois queime, rasgue ou delete. Ritual de liberação real.', durationMinutes: 20, difficulty: 3 },
            { id: 'm5d5s3e04', type: 'reflection', title: 'O que você precisa perdoar em si mesmo?', description: 'Os erros que você cometeu. As formas como você não estava no seu melhor. Você fez o que podia com o que tinha. Perdão próprio precede o perdão de outros.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d5s3e05', type: 'meditation', title: 'Meditação de ho\'oponopono: liberação com amor', description: '"Me desculpa. Perdoa-me. Obrigado. Te amo." Diga para o relacionamento passado, para ela, para você mesmo. 10 minutos em silêncio. Liberação com amor.', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d5s3e06', type: 'affirmation', title: 'Declaração de liberação', description: '"Libero o peso do passado. Carrego as lições, solto a dor. Escolho criar o novo livre das correntes do que foi." Diga 5x em voz alta.', durationMinutes: 5, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 34 — O Futuro do Relacionamento
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 34,
      module: 5,
      title: 'O Futuro do Relacionamento',
      theme: 'Amor sem direção compartilhada se perde. Visão compartilhada cria um relacionamento com propósito.',
      subtopics: [
        {
          id: 'm5d6s1',
          type: 'psychological_understanding',
          title: 'Visão Compartilhada',
          objective: 'Entender o papel da compatibilidade de valores na sustentabilidade do relacionamento.',
          exercises: [
            { id: 'm5d6s1e01', type: 'reflection', title: 'Por que relacionamentos sem visão compartilhada se dissolvem', description: 'A atração pode manter um relacionamento por 6-12 meses. Depois disso, valores e visão de futuro determinam se o relacionamento cresce ou murcha. Pesquise e registre.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d6s1e02', type: 'journaling', title: 'Escreva sua visão de vida para os próximos 5 anos — independente dela', description: 'Onde você quer estar? O que quer ter construído? Que tipo de relacionamento quer ter? Escreva sua visão como se ela não existisse — depois verifique a compatibilidade.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d6s1e03', type: 'self_analysis', title: 'Liste os valores fundamentais que não negociará num relacionamento', description: 'Integridade, crescimento, comunicação honesta, respeito? Identifique seus 5 valores fundamentais. São eles compatíveis com o que você vê nela?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d6s1e04', type: 'reflection', title: 'Baseado no que você conhece dela: os valores de vocês são compatíveis?', description: 'Não o que você espera que ela seja — o que você observou que ela é. Compatibilidade real, não a que você projeta sobre ela.', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d6s1e05', type: 'journaling', title: 'Escreva os 2 cenários de futuro com clareza', description: 'Cenário A: vocês reconstroem com base sólida. Que vida seria? Cenário B: caminhos separados. Que vida seria? Qual sente mais alinhado com sua visão?', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d6s1e06', type: 'reflection', title: 'Qual decisão você faria se não tivesse medo de nenhum dos resultados?', description: 'Medo distorce decisão. Se ambos os cenários fossem igualmente seguros, qual você escolheria? Essa resposta é mais próxima da verdade interna.', durationMinutes: 10, difficulty: 3 },
          ],
        },
        {
          id: 'm5d6s2',
          type: 'social_behavior',
          title: 'A Conversa sobre o Futuro',
          objective: 'Ter clareza sobre como iniciar a conversa sobre o que vocês querem.',
          exercises: [
            { id: 'm5d6s2e01', type: 'reflection', title: 'Quando é o momento certo para ter a conversa sobre futuro', description: 'Não na primeira conversa de reconexão. Não com pressão. Mas em algum momento após estabelecer a reconexão emocional. Como você vai reconhecer esse momento?', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d6s2e02', type: 'journaling', title: 'Escreva como você vai iniciar a conversa sobre o que vocês querem', description: 'Tom: curioso, sem pressão. "Tenho pensado sobre onde quero estar nos próximos anos. Qual é a sua visão?" Abertura genuína, não questionário.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d6s2e03', type: 'reflection', title: 'Como ouvir a resposta dela sem interpretá-la como garantia ou rejeição', description: 'Ela pode falar sobre o futuro sem se comprometer. Isso é saudável. Como você vai ouvir com curiosidade em vez de ansiedade?', durationMinutes: 10, difficulty: 2 },
            { id: 'm5d6s2e04', type: 'behavioral_action', title: 'Pratique a conversa de visão de futuro com um amigo hoje', description: 'Peça ao amigo para fazer o papel dela e responder sobre seus sonhos e valores. Pratique ouvir com presença e curiosidade, sem agenda.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d6s2e05', type: 'commitment', title: 'Decisão baseada em visão, não em medo', description: 'Escreva: "Vou escolher e agir baseado na minha visão de futuro e nos valores que tenho, não pelo medo de solidão ou de perder."', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d6s3',
          type: 'mindset_reprogramming',
          title: 'O Amor Que Você Merece',
          objective: 'Solidificar a crença de que você merece um amor que te eleva.',
          exercises: [
            { id: 'm5d6s3e01', type: 'reflection', title: 'Pesquise como autoestima determina o tipo de amor que você atrai', description: 'Você atrai quem você acredita merecer. Se você acredita que merece pouco, aceita pouco. Se sabe que merece muito, só aceita o que te eleva. Registre.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d6s3e02', type: 'self_analysis', title: 'Você está aceitando amor que te eleva ou amor que te diminui?', description: 'Honestidade sobre o que você tem tolerado vs. o que você merece. No relacionamento anterior, havia respeito genuíno ou você aceitava o que podia conseguir?', durationMinutes: 15, difficulty: 3 },
            { id: 'm5d6s3e03', type: 'journaling', title: 'Escreva como seria um amor que genuinamente te eleva', description: 'Específico: como ela te trataria, que conversas vocês teriam, como você se sentiria cotidianamente. Não fantasia — visão realista de um amor saudável.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d6s3e04', type: 'affirmation', title: 'Afirmação de merecimento de amor elevado', description: '"Mereço e atraio um amor que me respeita, me eleva e me celebra." "Não aceito migalhas — não por orgulho, mas porque sei o que tenho a oferecer." 10x cada.', durationMinutes: 5, difficulty: 1 },
            { id: 'm5d6s3e05', type: 'visualization', title: 'Visualização do relacionamento que você quer — 15 minutos', description: 'Com ela ou não — visualize como se sentiria em um relacionamento que genuinamente te eleva. Como você acorda? Como é a comunicação? Como você cresce junto?', durationMinutes: 15, difficulty: 1 },
          ],
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════
    // DAY 35 — Consolidação Final
    // ══════════════════════════════════════════════════════════════════════
    {
      day: 35,
      module: 5,
      title: 'Consolidação Final',
      theme: 'O protocolo termina. A jornada continua.',
      subtopics: [
        {
          id: 'm5d7s1',
          type: 'self_analysis',
          title: 'Auditoria Final dos 35 Dias',
          objective: 'Fazer uma avaliação completa e honesta da jornada de transformação.',
          exercises: [
            { id: 'm5d7s1e01', type: 'self_analysis', title: 'Compare Dia 1 com Dia 35 em cada área', description: 'Corpo, mente, propósito, relacionamentos, habilidades emocionais, autoestima, disciplina. Para cada área: nota no Dia 1 e nota no Dia 35. A diferença é a conquista.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d7s1e02', type: 'journaling', title: 'Lista de 20 conquistas dos últimos 35 dias', description: 'Não só as grandes — todas. Dias de silêncio mantidos, treinos completados, momentos de regulação, habilidades desenvolvidas, padrões quebrados. Cada item é evidência real.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d7s1e03', type: 'reflection', title: 'Releia a carta que você escreveu no Dia 7', description: 'Se você a escreveu: releia agora. Quanto do que prometeu ao seu eu futuro se cumpriu? O que o homem de hoje pensa sobre o homem que escreveu aquelas palavras?', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d7s1e04', type: 'journaling', title: 'O que o protocolo te ensinou que vai além da reconquista', description: 'Sobre você mesmo. Sobre como você funciona. Sobre o que realmente importa. Sobre quem você quer ser. Isso é o legado do protocolo.', durationMinutes: 20, difficulty: 2 },
            { id: 'm5d7s1e05', type: 'reflection', title: 'Avalie o status da reconexão com clareza final', description: 'Baseado nos 35 dias: onde está o relacionamento? Que decisão você toma? Honestidade total — sem distorção pelo desejo ou pelo medo.', durationMinutes: 15, difficulty: 2 },
          ],
        },
        {
          id: 'm5d7s2',
          type: 'commitment',
          title: 'Manifesto do Novo Homem',
          objective: 'Solidificar a identidade transformada através de declaração formal.',
          exercises: [
            { id: 'm5d7s2e01', type: 'journaling', title: 'Escreva o Manifesto do Novo Homem', description: 'Quem você é, o que acredita, como vai viver, o que não vai mais tolerar, o que oferece ao mundo. Mínimo de 1 página. Escreva como declaração definitiva de identidade.', durationMinutes: 30, difficulty: 1 },
            { id: 'm5d7s2e02', type: 'behavioral_action', title: 'Coloque o manifesto em lugar de destaque', description: 'Impresso e colado, digitalizado no celular, gravado em áudio. Ele precisa estar acessível para releitura mensal e para momentos de fraqueza.', durationMinutes: 15, difficulty: 1 },
            { id: 'm5d7s2e03', type: 'commitment', title: 'Defina os princípios que guiarão sua vida pós-protocolo', description: 'Cinco princípios curtos e memoráveis. Não regras — princípios. A diferença: regras são seguidas, princípios são incorporados.', durationMinutes: 15, difficulty: 2 },
            { id: 'm5d7s2e04', type: 'behavioral_action', title: 'Plano dos próximos 35 dias: o Dia 35 é o Dia 1 do que vem', description: 'Escreva 3 metas para os próximos 35 dias em áreas diferentes: corpo, missão, relacionamentos. O crescimento que você iniciou não para — continua.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d7s2e05', type: 'commitment', title: 'Comprometimento solene com quem você se tornou', description: 'Escreva em primeira pessoa, em voz alta: "Eu, [seu nome], me comprometo a honrar o homem que me tornei e a continuar crescendo a cada dia."', durationMinutes: 5, difficulty: 1 },
          ],
        },
        {
          id: 'm5d7s3',
          type: 'celebration',
          title: 'Celebração e Integração Final',
          objective: 'Celebrar a conclusão de 35 dias de transformação real.',
          exercises: [
            { id: 'm5d7s3e01', type: 'meditation', title: 'Meditação final de integração: 20 minutos', description: 'Percorra mentalmente cada fase dos 35 dias. Sinta a totalidade — a dor do início, a disciplina do processo, o crescimento acumulado. Encerre com gratidão profunda.', durationMinutes: 20, difficulty: 1 },
            { id: 'm5d7s3e02', type: 'physical_exercise', title: 'O treino mais especial: não o mais intenso, o mais significativo', description: 'Escolha o treino que mais representa quem você é agora. Enquanto você treina, celebre o corpo que te carregou por 35 dias de transformação.', durationMinutes: 60, difficulty: 2 },
            { id: 'm5d7s3e03', type: 'behavioral_action', title: 'Celebração real: experiência que marca o Dia 35', description: 'Uma experiência que simbolize quem você se tornou. Jantar especial, experiência nova, local significativo. Rituais de fechamento ancoram identidade.', durationMinutes: 120, difficulty: 1 },
            { id: 'm5d7s3e04', type: 'behavioral_action', title: 'Compartilhe algo verdadeiro da sua jornada com alguém de confiança', description: 'Não tudo — algo genuíno sobre o que você aprendeu. Vulnerabilidade calibrada com alguém seguro é o ato final de um homem integrado.', durationMinutes: 30, difficulty: 2 },
            { id: 'm5d7s3e05', type: 'reflection', title: 'Olhe no espelho por 3 minutos: veja o homem que você se tornou', description: 'Não o que falta — o que está lá. Um homem que enfrentou a maior dor e saiu mais forte. Veja-o. Reconheça-o. Honre-o.', durationMinutes: 3, difficulty: 1 },
            { id: 'm5d7s3e06', type: 'commitment', title: 'O protocolo termina. A jornada continua.', description: 'Escreva em letras grandes: "Dia 35 concluído. O protocolo terminou. O homem que me tornei continua." Foto, print, ou simplesmente saiba: você fez isso.', durationMinutes: 5, difficulty: 1 },
          ],
        },
      ],
    },

  ],
}
