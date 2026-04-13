-- ================================================================
-- PNRM Seed v2 — 5 Phases × 7 Tasks
-- Run after migration 003
-- ================================================================

-- ── PHASES ────────────────────────────────────────────────────────

TRUNCATE TABLE tasks, phases RESTART IDENTITY CASCADE;

INSERT INTO phases (number, slug, title, description, duration_days, psychological_goal) VALUES

(1, 'emotional_stabilization',
 'Fase 1 – Estabilização Emocional',
 'Reestabelecer equilíbrio interno, interromper comportamentos destrutivos pós-término e criar a base psicológica necessária para qualquer avanço estratégico.',
 7,
 'Regulação do sistema nervoso autônomo. Interrupção do ciclo de ansiedade de apego. Reconstrução do senso de identidade independente.'),

(2, 'psychological_reset',
 'Fase 2 – Reset Psicológico',
 'Reprogramar padrões de pensamento limitantes, estabelecer o No Contact disciplinado e reconstruir a rotina com base em propósito e não em dor.',
 7,
 'Reestruturação cognitiva. Desativação do vínculo de trauma. Ativação do sistema de identidade masculina autônoma.'),

(3, 'attraction_rebuild',
 'Fase 3 – Reconstrução da Atração',
 'Transformar-se no homem que ela não reconheceria. Construir valor percebido real — corpo, presença, missão e abundância — que gerem atração sem esforço.',
 7,
 'Ativação do sistema de alta percepção de valor. Construção de prova social genuína. Desenvolvimento de linguagem corporal e presença de alto status.'),

(4, 'strategic_re_approach',
 'Fase 4 – Reaproximação Estratégica',
 'Planejar e executar o primeiro contato de reengajamento com postura, timing e intenção corretos. Criar o contexto que faça a reaproximação parecer natural.',
 7,
 'Calibração do timing de reengajamento. Construção de contexto de reconexão. Desenvolvimento de comunicação de alto valor sem demonstrar necessidade.'),

(5, 'reconnection',
 'Fase 5 – Reconexão',
 'Navegar a reconexão real com maturidade emocional, criar experiências memoráveis e consolidar o novo nível de relacionamento com base em atração genuína.',
 7,
 'Consolidação da reconexão emocional. Criação de novos padrões de interação. Manutenção da atração a longo prazo.');

-- ================================================================
-- TASKS — Phase 1: Estabilização Emocional
-- Category: emotional_control
-- ================================================================

INSERT INTO tasks (phase_id, title, description, psychological_purpose, category, day_number, is_required)
SELECT p.id, t.title, t.description, t.purpose, t.category, t.day_number, TRUE
FROM phases p, (VALUES

  (1, 'Mapeamento da Dor',
   'Escreva por 15 minutos ininterruptos sobre o que está sentindo. Sem filtro, sem julgamento. Pode ser raiva, saudade, confusão ou alívio. Escreva tudo. Ao final, leia uma vez e guarde.',
   'Externalizar a dor emocional reduz a ativação da amígdala e transfere o processamento do sistema límbico para o córtex pré-frontal, diminuindo a intensidade do sofrimento.',
   'emotional_control', 1),

  (1, 'Inventário de Gatilhos',
   'Liste os 7 gatilhos que mais ativam o impulso de entrar em contato com ela (músicas, lugares, horários, objetos, cheiros, fotos, situações). Para cada um, defina uma ação substituta imediata e específica.',
   'A substituição de estímulo-resposta é a técnica central da TCC para interromper ciclos compulsivos antes que se instalem neurologicamente.',
   'emotional_control', 2),

  (1, 'Protocolo de Emergência Emocional',
   'Crie seu protocolo pessoal de 3 passos para usar no momento que o impulso de contato for mais forte. Exemplo: (1) Respiração 4-7-8 por 4 ciclos. (2) Ligar para um amigo específico. (3) Treinar por 20 minutos. Escreva seus 3 passos e coloque como nota fixada no celular.',
   'Decisões pré-comprometidas eliminam a necessidade de escolha em momentos de alta ativação emocional, prevenindo comportamentos de arrependimento irreversíveis.',
   'emotional_control', 3),

  (1, 'Inventário de Identidade',
   'Responda por escrito: Quem você era antes dela? Liste 10 características, interesses, habilidades e valores que definem você independente de qualquer relacionamento. Depois responda: quais desses você abandonou durante o relacionamento?',
   'Recuperar o senso de identidade autônomo é o prerequisito de toda autoestima real. Identidade ancorada em relação é identidade frágil.',
   'self_reconstruction', 4),

  (1, 'Higiene Digital',
   'Execute: (1) Remova a foto dela como plano de fundo. (2) Arquive as conversas (não delete — apenas remova do visível). (3) Coloque o perfil dela em mute (não bloquear). (4) Desative notificações de "última vez online" e "confirmação de leitura". (5) Desinstale apps que te levam a monitorá-la obsessivamente.',
   'Reduzir a exposição a estímulos que ativam o sistema dopaminérgico de recompensa é essencial para quebrar o ciclo de verificação compulsiva e reduzir a ansiedade de apego.',
   'silence_discipline', 5),

  (1, 'Regulação Neural — Respiração 4-7-8',
   'Pratique a respiração 4-7-8 por 10 minutos: inspire pelo nariz por 4 segundos, segure por 7 segundos, expire pela boca por 8 segundos. Faça ao acordar e antes de dormir. Registre como se sentiu antes e depois.',
   'A técnica 4-7-8 ativa o nervo vago e o sistema nervoso parassimpático, reduzindo cortisol e adrenalina — os hormônios que amplificam dor emocional e impulsividade.',
   'emotional_control', 6),

  (1, 'Carta de Fechamento',
   'Escreva uma carta completa para ela — diga tudo que você quer dizer, sem filtro. Depois guarde em um lugar privado ou destrua. NÃO envie. O objetivo é o fechamento interno, não a comunicação.',
   'O processamento narrativo completo de uma experiência emocional cria fechamento interno sem depender da resposta da outra pessoa. Técnica validada em psicoterapia de luto.',
   'emotional_control', 7)

) AS t(phase_num, title, description, purpose, category, day_number)
WHERE p.number = 1;

-- ================================================================
-- TASKS — Phase 2: Reset Psicológico
-- ================================================================

INSERT INTO tasks (phase_id, title, description, psychological_purpose, category, day_number, is_required)
SELECT p.id, t.title, t.description, t.purpose, t.category, t.day_number, TRUE
FROM phases p, (VALUES

  (2, 'Auditoria de Crenças Limitantes',
   'Liste as 5 crenças que você notou se repetindo desde o término. Exemplo: "Não sou suficiente", "Ela é a única", "Nunca vou encontrar alguém assim". Para cada crença, escreva: (1) De onde veio? (2) É baseada em fato ou interpretação? (3) Qual seria a crença alternativa mais precisa?',
   'Crenças limitantes são interpretações automáticas tratadas como fatos. Reestruturação cognitiva cria distância entre o evento e sua interpretação, reduzindo a reatividade emocional.',
   'self_reconstruction', 1),

  (2, 'Compromisso de No Contact',
   'Defina e escreva: (1) Quantos dias de No Contact você vai cumprir (mínimo 21 dias, ideal 30-45). (2) A data de término. (3) As únicas exceções permitidas (filhos, trabalho urgente). Coloque no calendário com notificação. Assine como compromisso formal consigo mesmo.',
   'Metas com data específica e regras claras têm 42% mais taxa de cumprimento. O No Contact protege tanto o processo emocional quanto a percepção de valor dela.',
   'silence_discipline', 2),

  (2, 'Reconstrução de Rotina',
   'Crie uma rotina semanal com horários fixos para: (1) Treino ou exercício físico. (2) Desenvolvimento de habilidade ou estudo. (3) Conexão social real. (4) Trabalho ou projeto pessoal. Não é sobre ser produtivo — é sobre criar estrutura que substitui o vazio deixado pelo relacionamento.',
   'Rotina estruturada reduz a ruminação por preencher o espaço cognitivo com atividades que ativam o sistema de recompensa de forma saudável.',
   'self_reconstruction', 3),

  (2, 'Realinhamento de Identidade Masculina',
   'Responda: Qual homem você quer ser nos próximos 90 dias? Não em relação a ela — em relação a você mesmo. Descreva em termos concretos: corpo, mentalidade, habilidades, postura, missão. Guarde essa descrição.',
   'Identidade projetada para o futuro cria motivação intrínseca mais poderosa que qualquer objetivo externo. É o fundamento da transformação real.',
   'self_reconstruction', 4),

  (2, 'Processamento do Trauma de Vínculo',
   'Escreva uma análise honesta do relacionamento: O que você ganhou? O que você perdeu de si mesmo? Quais foram os momentos que sinalizaram problemas que você ignorou? O que você faria diferente? Seja brutalmente honesto.',
   'Processar o vínculo com clareza, ao invés de idealizá-lo, cria resistência cognitiva que previne a recaída em comportamentos de apego disfuncional.',
   'emotional_control', 5),

  (2, 'Clarificação de Valores',
   'Liste seus 5 valores mais fundamentais (honestidade, liberdade, lealdade, crescimento, família, etc.). Para cada um: (1) Como você viveu esse valor durante o relacionamento? (2) Como você quer vivê-lo nos próximos meses? Valores claros criam tomada de decisão automática.',
   'Valores explícitos funcionam como filtros de decisão que operam antes da emoção, criando escolhas consistentes mesmo em situações de alta pressão emocional.',
   'self_reconstruction', 6),

  (2, 'Síntese da Fase 2',
   'Reflita e escreva: (1) O que você aprendeu sobre si mesmo nessa semana? (2) Qual comportamento você conseguiu interromper? (3) O que ainda precisa trabalhar? (4) Como está sua clareza mental comparada com o início da fase 1?',
   'Metacognição — pensar sobre o próprio processo de mudança — consolida aprendizados, aumenta autoeficácia e prepara o sistema cognitivo para os desafios da próxima fase.',
   'emotional_control', 7)

) AS t(phase_num, title, description, purpose, category, day_number)
WHERE p.number = 2;

-- ================================================================
-- TASKS — Phase 3: Reconstrução da Atração
-- ================================================================

INSERT INTO tasks (phase_id, title, description, psychological_purpose, category, day_number, is_required)
SELECT p.id, t.title, t.description, t.purpose, t.category, t.day_number, TRUE
FROM phases p, (VALUES

  (3, 'Auditoria de Valor Real',
   'Liste honestamente o que você tem a oferecer como homem: físico, carreira, inteligência, caráter, habilidades, humor, presença, missão. Depois liste: o que você quer adicionar nos próximos 30 dias? Foque em 1-2 mudanças concretas.',
   'Valor percebido começa pelo valor que o próprio homem atribui a si mesmo. Autoconhecimento preciso previne tanto a subestimação quanto a arrogância.',
   'attraction_rebuilding', 1),

  (3, 'Missão de 90 Dias',
   'Defina uma meta de transformação concreta para os próximos 90 dias em UMA das áreas: corpo, carreira ou habilidade. Escreva: (1) O resultado específico. (2) As ações semanais. (3) Como você vai medir o progresso. Uma missão clara é mais atrativa que qualquer técnica de sedução.',
   'Homens com propósito ativo são percebidos como de maior valor por padrão biológico. A missão cria magnetismo natural sem necessidade de estratégia consciente.',
   'self_reconstruction', 2),

  (3, 'Transformação Física Visível',
   'Execute hoje uma das seguintes ações: (1) Corte de cabelo novo ou ajuste de barba. (2) Compre uma peça de roupa que projete quem você está se tornando. (3) Inicie uma rotina de treino com frequência mínima de 3x/semana. Mudança física é o sinal mais visível de transformação.',
   'Mudanças físicas perceptíveis funcionam como sinalizadores sociais de transformação. O impacto é duplo: interno (autoestima) e externo (percepção social).',
   'attraction_rebuilding', 3),

  (3, 'Expansão Social Estratégica',
   'Esta semana: entre em contato com 3 pessoas que você perdeu contato durante o relacionamento. Marque ao menos um encontro real. Participe de um ambiente novo (evento, grupo, aula). O objetivo não é impressionar — é existir plenamente em novos contextos.',
   'Expansão de rede social cria prova social indireta e reduz a dependência emocional centrada nela. Novos ambientes também criam oportunidades orgânicas de reencontro.',
   'attraction_rebuilding', 4),

  (3, 'Arquitetura de Presença Digital',
   'Revise seu perfil principal nas redes sociais. Ele reflete quem você está se tornando? Atualize: (1) Foto de perfil (presença, não pose). (2) Bio (missão, não estado civil). (3) Última postagem (conquista, evento real, não vazio). Ela vai pesquisar. Todos pesquisam.',
   'Presença digital de qualidade serve como prova social passiva. Funciona 24h por dia sem que você precise fazer nada.',
   'attraction_rebuilding', 5),

  (3, 'Cultivo de Abundância',
   'Interaja de forma genuína com ao menos duas mulheres hoje — amiga, colega, desconhecida. Sem agenda de reconquista. Apenas pratique ser alguém interessante, presente e não necessitado. Registre como se sentiu.',
   'Abundância afetiva real elimina a postura de escassez que é o maior inibidor de atração. Não é infidelidade — é recalibragem emocional.',
   'attraction_rebuilding', 6),

  (3, 'Revisão de Sinais',
   'Você notou algum sinal de que ela está prestando atenção em você? (Viu sua história, curtiu algo antigo, perguntou sobre você para alguém, apareceu em lugares onde você estava). Documente sem interpretar excessivamente. Sinais são dados — não conclusões.',
   'Reconhecer indicadores de interesse sem amplificação ansiosa é uma habilidade de regulação emocional que previne tanto ações prematuras quanto oportunidades perdidas.',
   'attraction_rebuilding', 7)

) AS t(phase_num, title, description, purpose, category, day_number)
WHERE p.number = 3;

-- ================================================================
-- TASKS — Phase 4: Reaproximação Estratégica
-- ================================================================

INSERT INTO tasks (phase_id, title, description, psychological_purpose, category, day_number, is_required)
SELECT p.id, t.title, t.description, t.purpose, t.category, t.day_number, TRUE
FROM phases p, (VALUES

  (4, 'Avaliação de Prontidão',
   'Responda honestamente: (1) Você está bem emocionalmente se ela disser não? (2) Você está buscando reconexão genuína ou apenas validação? (3) Você tem algo real e interessante a oferecer agora que não tinha antes? Se a resposta a qualquer uma for não — não avance ainda. Prontidão emocional é o único critério válido.',
   'Avanço prematuro reinicia o ciclo negativo e confirma o padrão que gerou o término. A prontidão real é detectada por ela instantaneamente.',
   're_approach_strategy', 1),

  (4, 'Seleção do Canal de Contato',
   'Analise: (1) Qual canal de comunicação teve mais história positiva entre vocês? (2) Ela está em qual canal mais ativa atualmente? (3) Mensagem de texto, DM ou encontro casual — qual parece mais natural dado o contexto? Documente sua escolha e o raciocínio.',
   'O canal de comunicação determina o tom e o frame da mensagem. A escolha errada do canal prejudica a mensagem antes que ela seja lida.',
   're_approach_strategy', 2),

  (4, 'Criação da Primeira Mensagem',
   'Escreva 3 versões da sua primeira mensagem. Regras: (1) Sem referência ao passado ou ao término. (2) Sem declarações de sentimento. (3) Algo genuíno, leve, com um gancho natural de resposta. (4) Máximo 2 linhas. Mostre para alguém de confiança antes de enviar.',
   'A primeira mensagem define o frame de toda a interação futura. Precisa parecer espontânea — mesmo sendo planejada. Espontaneidade ensaiada é uma habilidade.',
   're_approach_strategy', 3),

  (4, 'Simulação de Conversa',
   'Prepare-se para os 5 cenários de resposta mais prováveis: (1) Resposta positiva. (2) Resposta neutra. (3) Resposta fria. (4) Sem resposta. (5) Resposta defensiva. Para cada um, escreva sua reação ideal — o que você diria e, mais importante, o que você NÃO diria.',
   'Preparação para variáveis emocionais reduz a reatividade ansiosa durante a conversa real e previne respostas impulsivas que destroem o que foi construído.',
   're_approach_strategy', 4),

  (4, 'Posicionamento Social Visível',
   'Apareça hoje em um ambiente onde há chance de ela ouvir falar de você através de terceiros. Não para ser visto por ela diretamente — para existir plenamente em novos contextos que ela eventualmente vai conhecer. Fotos, histórias, eventos.',
   'Informação social que chega por vias indiretas tem 3x mais impacto que informação direta. O que os outros dizem sobre você vale mais que o que você diz sobre si mesmo.',
   're_approach_strategy', 5),

  (4, 'Leitura de Sinais Indiretos',
   'Nos últimos 7 dias: ela viu suas histórias? Curtiu algo seu? Perguntou sobre você para alguém? Apareceu em algum lugar onde você estava? Documente cada sinal com data e contexto. Sinais indiretos são a linguagem real do interesse feminino antes do contato verbal.',
   'A decodificação precisa de sinais indiretos previne tanto a inação por subestimação quanto a ação prematura por interpretação excessiva.',
   're_approach_strategy', 6),

  (4, 'Plano de Reaproximação',
   'Com base em tudo que você coletou nas últimas semanas: (1) Qual é o momento certo para o primeiro contato? (2) O que você vai dizer? (3) Qual é o objetivo da primeira conversa (não reconquista imediata — mas reabertura de canal)? Documente o plano completo.',
   'Um plano claro com objetivos modestos e realistas previne a sobrecarga de expectativa que sabota o primeiro contato.',
   're_approach_strategy', 7)

) AS t(phase_num, title, description, purpose, category, day_number)
WHERE p.number = 4;

-- ================================================================
-- TASKS — Phase 5: Reconexão
-- ================================================================

INSERT INTO tasks (phase_id, title, description, psychological_purpose, category, day_number, is_required)
SELECT p.id, t.title, t.description, t.purpose, t.category, t.day_number, TRUE
FROM phases p, (VALUES

  (5, 'Execução do Primeiro Contato',
   'Execute o plano definido na Fase 4. Envie a mensagem ou crie o contexto para o encontro casual. Documente: (1) O que você disse exatamente. (2) Quando enviou. (3) Como se sentiu imediatamente após. Não monitore a resposta nas primeiras 3 horas.',
   'A ação é o único dado real. Tudo que veio antes é preparação. A execução com desapego do resultado é o teste de maturidade emocional do processo.',
   're_approach_strategy', 1),

  (5, 'Análise da Resposta Dela',
   'Como ela respondeu? Analise o TOM (não apenas o conteúdo): (1) Foi aberta, neutra, fria ou defensiva? (2) Respondeu rápido ou demorou? (3) Usou emojis ou foi formal? (4) Fez uma pergunta de volta? Escreva sua análise objetiva antes de decidir o próximo passo.',
   'Leitura precisa do tom emocional previne tanto o otimismo excessivo quanto o pessimismo paralisante. Ambos levam a erros estratégicos equivalentes.',
   're_approach_strategy', 2),

  (5, 'Manutenção do Momentum',
   'Se a conversa está evoluindo positivamente: (1) Responda no ritmo dela (não imediatamente, não demorando demais). (2) Leve a conversa para um assunto onde ela se sente confortável e interessante. (3) Termine a conversa quando ainda está boa — não espere ela acabar naturalmente.',
   'O momentum de uma conversa depende mais do timing e da qualidade das trocas do que do conteúdo em si. Terminar no pico cria antecipação.',
   're_approach_strategy', 3),

  (5, 'Criação de Contexto de Encontro',
   'Identifique um contexto natural para um encontro presencial — não um "encontro formal", mas uma situação onde ver ela pessoalmente faz sentido logicamente. Evento em comum, lugar que vocês frequentam, ocasião de terceiros. A naturalidade é mais poderosa que o convite direto.',
   'O encontro presencial modifica o campo de influência completamente. Presença física ativa mecanismos de atração que a comunicação digital não consegue recriar.',
   're_approach_strategy', 4),

  (5, 'Presença de Alto Valor no Reencontro',
   'Antes do encontro: (1) Apresentação física impecável — não exagerada, mas cuidada. (2) Postura aberta, gestos lentos, voz controlada. (3) Foco total nela durante a conversa — sem checar celular. (4) Perguntas genuínas sobre ela, não sobre o relacionamento passado. Seja a versão mais interessante de você.',
   'A primeira impressão presencial após o No Contact é o momento de maior impacto do processo inteiro. O estado interno se comunica antes das palavras.',
   'attraction_rebuilding', 5),

  (5, 'Leitura da Reconexão Emocional',
   'Após o encontro ou conversa: (1) Ela se abriu emocionalmente ou ficou guarda? (2) Houve momentos de conexão genuína? (3) Ela fez planos ou sugeriu um próximo contato? (4) Como você se sentiu — houve reciprocidade real? Documente honestamente sem interpretar em excesso.',
   'A reconexão real se manifesta em comportamentos específicos e observáveis, não em sentimentos ou interpretações. Clareza sobre o estado real previne ilusão e decepção.',
   're_approach_strategy', 6),

  (5, 'Avaliação Final do Protocolo',
   'Você completou o PNRM. Responda: (1) Quem você era quando começou? (2) Quem você é agora? (3) O que mudou em você — além da situação com ela? (4) Independente do resultado da reconquista, o que você ganhou como homem? Essa resposta é o verdadeiro resultado do protocolo.',
   'O objetivo final do PNRM não é apenas a reconquista — é a reconstrução do homem. Um homem transformado cria resultados diferentes, independente de qual relacionamento.',
   'self_reconstruction', 7)

) AS t(phase_num, title, description, purpose, category, day_number)
WHERE p.number = 5;
