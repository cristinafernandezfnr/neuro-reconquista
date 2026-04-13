-- ============================================================
-- PNRM Seed: Phases + Sample Daily Tasks
-- Run after migration 002
-- ============================================================

-- ── PHASES ────────────────────────────────────────────────

INSERT INTO phases (number, slug, title, description, duration_days, unlock_condition) VALUES
(1, 'emotional_stabilization',
 'Fase 1 – Estabilização Emocional',
 'Recuperar o equilíbrio emocional, interromper comportamentos destrutivos e criar a base psicológica necessária para qualquer avanço estratégico.',
 7, 'always'),

(2, 'strategic_silence',
 'Fase 2 – Silêncio Estratégico',
 'Aplicar o No Contact de forma inteligente: criar ausência percebida, reduzir ansiedade de dependência e ativar o mecanismo de saudade no cérebro dela.',
 7, 'phase_1_complete'),

(3, 'psychological_repositioning',
 'Fase 3 – Reposicionamento Psicológico',
 'Reconstruir a imagem interna e externa. Transformar-se no homem que ela sente que pode perder. Autorrespeito, identidade e presença social.',
 7, 'phase_2_complete'),

(4, 'attraction_rebuild',
 'Fase 4 – Reconstrução da Atração',
 'Reativar a atração de forma não verbal. Usar o ambiente social, a postura e a escassez para criar curiosidade genuína sem parecer estratégico.',
 7, 'phase_3_complete'),

(5, 'reconquest_conversation',
 'Fase 5 – Conversa de Reconquista',
 'Iniciar o primeiro contato de reengajamento com postura, tom e intenção corretos. Criar a conversa que não parece desesperada nem calculada.',
 7, 'phase_4_complete');

-- ── DAILY TASKS – PHASE 1: Estabilização Emocional ────────

INSERT INTO daily_tasks (phase_id, day_number, title, description, psychological_objective, task_type) VALUES

(1, 1,
 'Mapeamento da Dor',
 'Escreva durante 15 minutos sem parar sobre o que você está sentindo agora. Não edite. Não filtre. Deixe tudo sair. Use papel ou um documento privado.',
 'Externalizar a dor emocional reduz a ativação do córtex pré-frontal e diminui a intensidade do sofrimento ao transferir a experiência interna para uma forma concreta.',
 'reflection'),

(1, 2,
 'Mapeamento dos Gatilhos',
 'Liste os 5 principais gatilhos que te fazem querer entrar em contato com ela (música, lugar, horário, objeto, foto). Para cada um, escreva um substituto de ação imediata.',
 'A substituição de estímulo-resposta é uma técnica de TCC que interrompe o ciclo de ruminação compulsiva antes que ele se instale.',
 'exercise'),

(1, 3,
 'Protocolo de Emergência Emocional',
 'Crie seu protocolo pessoal de 3 passos para quando a ansiedade de contato aparecer. Exemplo: 1) Respiração 4-7-8. 2) Ligar para um amigo. 3) Treinar por 20 min. Escreva os seus 3 passos.',
 'Ter um protocolo predefinido elimina a necessidade de tomar decisões emocionais em momento de alta ativação, reduzindo comportamentos de arrependimento.',
 'action'),

(1, 4,
 'Inventário de Identidade',
 'Responda: Quem você era ANTES dela? Liste 10 características, interesses e valores que definem você independente de qualquer relacionamento.',
 'Reconstruir o senso de identidade autônomo é o primeiro passo para recuperar autoestima que não depende da validação externa.',
 'reflection'),

(1, 5,
 'Higiene Digital',
 'Remova a foto dela como plano de fundo. Mute o perfil dela (não bloquear). Remova notificações de "última vez online". Desinstale apps que te levam a monitorá-la.',
 'Reduzir a exposição a estímulos que ativam o sistema de recompensa dopaminérgico é essencial para quebrar o ciclo de checagem compulsiva.',
 'action'),

(1, 6,
 'Respiração Neurorreguladora',
 'Pratique a respiração 4-7-8 por 10 minutos hoje: inspire 4s, segure 7s, expire 8s. Faça isso de manhã e antes de dormir.',
 'A técnica 4-7-8 ativa o sistema nervoso parassimpático, reduzindo cortisol e adrenalina — hormônios que amplificam a dor emocional e a impulsividade.',
 'exercise'),

(1, 7,
 'Carta Não Enviada',
 'Escreva uma carta completa para ela dizendo TUDO que você quer dizer. Depois guarde ou destrua. Não envie.',
 'Técnica de processamento emocional que permite a expressão completa sem as consequências sociais do envio. Cria fechamento interno sem depender dela.',
 'reflection');

-- ── DAILY TASKS – PHASE 2: Silêncio Estratégico ──────────

INSERT INTO daily_tasks (phase_id, day_number, title, description, psychological_objective, task_type) VALUES

(2, 1,
 'Compreender o No Contact',
 'Leia e internalize: No Contact não é punição, não é jogo. É dar ao sistema nervoso dela espaço suficiente para sentir sua ausência. Escreva com suas palavras por que você está fazendo isso.',
 'A motivação consciente determina a sustentabilidade do comportamento. Quem faz No Contact por raiva abandona. Quem faz por estratégia mantém.',
 'reflection'),

(2, 2,
 'Definir o Período de Silêncio',
 'Com base no seu diagnóstico, defina quantos dias de No Contact você vai cumprir (mínimo 21 dias, ideal 30–45). Escreva a data de término. Coloque no calendário.',
 'Metas com data específica têm 42% mais chance de serem cumpridas do que metas vagas.',
 'action'),

(2, 3,
 'Gestão de Contas em Comum',
 'Se vocês têm grupos em comum, conversas de trabalho ou situações inevitáveis: defina regras para cada uma. Respostas curtas, neutras e somente quando necessário.',
 'Neutralidade emocional em contatos inevitáveis é mais poderosa que o silêncio total, pois demonstra autocontrole sem parecer hostilidade.',
 'action'),

(2, 4,
 'Ativar a Vida Social',
 'Entre em contato com 3 pessoas que você deixou de ver durante o relacionamento. Marque ao menos um encontro real esta semana.',
 'O isolamento amplifica a dor. Reativar vínculos sociais cria prova social e reduz a dependência emocional centrada nela.',
 'action'),

(2, 5,
 'Observar Sem Agir',
 'Se você viu algo dela online hoje que te deu impulso de reagir: escreva o que sentiu, o que quis fazer, e o que fez ao invés disso.',
 'O espaço entre estímulo e resposta é onde o autocontrole é construído. Documentar esse espaço treina o músculo da regulação emocional.',
 'reflection'),

(2, 6,
 'Construir Prova Social',
 'Poste algo genuíno nas suas redes (foto, conquista, momento real). Não force. Não exagere. Apenas mostre que sua vida está acontecendo.',
 'Prova social passiva é mais eficaz que tentativas diretas de impressionar. Ela percebe sem que você precise dizer nada.',
 'action'),

(2, 7,
 'Revisão da Semana 2',
 'Como foi a semana de silêncio? O que foi difícil? O que funcionou? O que você descobriu sobre você mesmo nessa semana?',
 'Metacognição — pensar sobre o próprio processo — consolida os aprendizados e prepara o sistema para o próximo estágio.',
 'reflection');

-- ── DAILY TASKS – PHASE 3: Reposicionamento Psicológico ──

INSERT INTO daily_tasks (phase_id, day_number, title, description, psychological_objective, task_type) VALUES

(3, 1,
 'Auditoria de Valor',
 'Liste: o que você tem a oferecer como homem? Carreira, saúde, caráter, presença, missão, habilidades. Seja honesto. Depois: o que você quer desenvolver nos próximos 30 dias?',
 'Valor percebido começa pelo valor que o próprio homem atribui a si mesmo. Autoconhecimento precede autoconfiança.',
 'reflection'),

(3, 2,
 'Missão de 90 Dias',
 'Defina uma meta concreta para os próximos 90 dias em UMA das áreas: corpo, carreira ou habilidade. Escreva a meta, as ações semanais e o resultado esperado.',
 'Homens com propósito ativo são percebidos como mais atraentes neurologicamente. A missão cria magnetismo natural.',
 'action'),

(3, 3,
 'Atualização Física',
 'Escolha e faça hoje: novo corte de cabelo, ajuste na barba, ou compra de uma peça de roupa que projete a imagem de quem você quer ser.',
 'Mudanças físicas visíveis servem como sinalizadores sociais de transformação. A imagem exterior influencia como ela vai te perceber no primeiro reencontro.',
 'action'),

(3, 4,
 'Expansão Social Estratégica',
 'Participe de um novo ambiente social esta semana (evento, grupo, aula, esporte coletivo). O objetivo não é impressionar. É existir em novos contextos.',
 'Novos ambientes sociais ampliam a rede de percepção social sobre você e criam oportunidades orgânicas de encontro futuro.',
 'action'),

(3, 5,
 'Arquitetura de Presença',
 'Revise seu perfil em uma rede social. Ele reflete quem você está se tornando? Atualize a bio, fotos e última postagem se necessário.',
 'Presença digital é o primeiro ponto de contato quando ela decide te pesquisar. Ela vai pesquisar.',
 'action'),

(3, 6,
 'Diário de Crescimento',
 'Escreva 3 coisas que você fez esta semana que o você de 3 meses atrás não faria. Por que essas ações importam para quem você está se tornando?',
 'Documentar progresso real cria evidências internas de mudança, prevenindo o retorno ao padrão anterior de baixa autoestima.',
 'reflection'),

(3, 7,
 'Preparação para Fase 4',
 'O que você acredita que ainda precisa resolver internamente antes de considerar qualquer reaproximação? Seja honesto. Escreva sem julgamento.',
 'Auto-avaliação crítica honesta é o indicador mais confiável de prontidão emocional para avançar.',
 'reflection');

-- ── DAILY TASKS – PHASE 4: Reconstrução da Atração ───────

INSERT INTO daily_tasks (phase_id, day_number, title, description, psychological_objective, task_type) VALUES

(4, 1,
 'Entender Atração Feminina',
 'Leia e internalize: atração não é construída com palavras. É construída com postura, escassez, presença social e indiferença estratégica. Escreva o que isso significa na prática para você.',
 'Compreensão cognitiva do mecanismo de atração é prerequisito para comportamentos autênticos e não mecânicos.',
 'reflection'),

(4, 2,
 'Escassez Real',
 'Hoje: seja genuinamente ocupado. Cancele ou adie algo de baixo valor. Diga não para algo que normalmente diria sim. Foque em você.',
 'Escassez real gera atração natural. Escassez fingida gera desconfiança. A diferença está na autenticidade da fonte.',
 'mindset'),

(4, 3,
 'Ambiente Social Visível',
 'Apareça em um lugar onde há chance de ela ouvir falar de você através de terceiros. Não para ser visto por ela — para existir plenamente.',
 'Informação social que chega por vias indiretas (amigos em comum, redes sociais, eventos) tem 3x mais impacto que informação direta.',
 'action'),

(4, 4,
 'Linguagem Corporal de Alto Status',
 'Pesquise e pratique hoje: ombros abertos, contato visual sustentado, voz controlada, gestos lentos. Grave um vídeo seu falando por 2 minutos e observe.',
 'Comunicação não verbal representa 55% da primeira impressão. Linguagem corporal de alto status é treinável.',
 'exercise'),

(4, 5,
 'Cultivar Abundância',
 'Conecte-se genuinamente com uma mulher hoje (amiga, colega, conhecido). Sem agenda. Apenas pratique ser alguém interessante e presente.',
 'Abundância afetiva reduz a postura de escassez que repele. Não é sobre infidelidade — é sobre não ser o homem que só tem uma opção.',
 'action'),

(4, 6,
 'Construir o Mistério',
 'Hoje não explique onde você foi. Não justifique o que fez. Deixe espaços. Respostas curtas quando perguntado sobre sua vida. Observe como as pessoas reagem.',
 'O mistério ativa o sistema de curiosidade. O homem que não precisa se explicar projeta confiança e independência.',
 'mindset'),

(4, 7,
 'Indicadores de Reengajamento',
 'Você notou algum sinal de que ela está observando você? Viu sua história, curtiu algo antigo, perguntou sobre você para alguém? Documente sem interpretar excessivamente.',
 'Reconhecer sinais reais sem amplificação ansiosa é uma habilidade de regulação emocional que previne ações prematuras.',
 'reflection');

-- ── DAILY TASKS – PHASE 5: Conversa de Reconquista ───────

INSERT INTO daily_tasks (phase_id, day_number, title, description, psychological_objective, task_type) VALUES

(5, 1,
 'Critérios de Prontidão',
 'Responda honestamente: (1) Você está bem mesmo que ela diga não? (2) Você está buscando reconexão ou validação? (3) Você tem algo genuíno e interessante a oferecer? Só avance se as 3 respostas forem sim.',
 'Prontidão emocional real é o único critério válido para iniciar o contato. Contato prematuro reinicia o ciclo negativo.',
 'reflection'),

(5, 2,
 'Escolher o Canal Certo',
 'Qual canal de comunicação faz mais sentido para o histórico de vocês? Mensagem de texto, DM, encontro casual? Escreva o racional da sua escolha.',
 'O canal determina o tom. Mensagem permite edição e reflexão. Encontro permite presença. A escolha estratégica do canal é a primeira decisão da conversa.',
 'reflection'),

(5, 3,
 'Rascunhar a Primeira Mensagem',
 'Escreva 3 versões da sua primeira mensagem. Regras: (1) Nada de "eu estava pensando em você". (2) Nada de referência ao passado. (3) Algo genuíno, leve, com gancho de resposta.',
 'A primeira mensagem define o frame de toda a conversa. Ela precisa parecer espontânea, não calculada — mesmo sendo planejada.',
 'exercise'),

(5, 4,
 'Simulação de Conversa',
 'Antecipe as 5 respostas mais prováveis dela (positiva, neutra, fria, curiosa, defensiva). Escreva sua resposta ideal para cada uma.',
 'Preparação para variáveis emocionais reduz a reatividade ansiosa durante a conversa real.',
 'exercise'),

(5, 5,
 'Envio ou Encontro',
 'Execute. Envie a mensagem ou crie o contexto para o encontro casual. Documente como foi — o que você disse, como ela respondeu, como você se sentiu.',
 'A ação é o único dado real. Tudo antes disso é teoria.',
 'communication'),

(5, 6,
 'Análise da Resposta',
 'Como ela respondeu? Analise o tom (não o conteúdo). Ela foi aberta, fria, curiosa, defensiva? O que isso indica sobre o estado emocional dela?',
 'Leitura precisa do estado emocional dela previne interpretações excessivamente positivas ou negativas que distorcem as próximas ações.',
 'reflection'),

(5, 7,
 'Próximos Passos',
 'Com base na resposta dela: qual é o próximo movimento lógico? Avançar? Esperar? Dar espaço? Não existe resposta errada — existe a resposta que respeita a realidade do momento.',
 'Flexibilidade estratégica baseada em dados reais é o marcador final de maturidade emocional no processo de reconquista.',
 'reflection');
