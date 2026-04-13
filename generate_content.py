#!/usr/bin/env python3
"""Generate deep content for all 35 days of the protocol"""

# Day content structure for each phase
# Phase 1: Days 1-7 - Afastamento Inteligente
# Phase 2: Days 8-14 - Reconstrução
# Phase 3: Days 15-21 - Criação de Valor
# Phase 4: Days 22-28 - Mind Hack
# Phase 5: Days 29-35 - Reconexão

CONTENT_PT = {}
CONTENT_ES = {}
CONTENT_EN = {}

# Phase 1: Afastamento Inteligente (Days 1-7)
phase1_days = [
    {
        "day": 1,
        "title_pt": "O Silêncio como Arma", "title_es": "El Silencio como Arma", "title_en": "Silence as a Weapon",
        "reading1": ("O Poder do Silêncio Estratégico", "Entenda por que o silêncio é sua arma mais poderosa. Quando você some, cria um vácuo psicológico que força o cérebro dela a processar sua ausência. Isso ativa o sistema de apego e desperta a curiosidade."),
        "reading2": ("Neurociência da Ausência", "Estudos mostram que a ausência intermitente aumenta o valor percebido. O cérebro humano valoriza mais o que é escasso. Ao se ausentar, você se torna um recurso valioso em vez de um commodity abundante."),
        "reading3": ("A Síndrome do Vazio", "Quando você está sempre disponível, seu cérebro produz dopamina na presença dela. Mas na ausência, ocorre uma química diferente: o sistema de recompensa busca o que foi perdido. Use isso a seu favor."),
        "caso": ("Caso: João e Maria - Do Desespero ao Silêncio", "João implorou por 3 semanas. Maria se afastou mais. Quando ele entrou em silêncio total, em 10 dias ela mandou a primeira mensagem. Análise: a mudança de comportamento quebrou o padrão de rejeição."),
        "quiz": ("Quiz: Quando você deve quebrar o silêncio?", "A) Nunca durante o protocolo\\nB) Apenas em emergências\\nC) Quando ela mandar 3 mensagens\\nD) Quando sentir saudade"),
        "mission1": ("Missão Digital: Limpeza Total", "[ ] Arquivar todas as conversas antigas\\n[ ] Silenciar notificações dela\\n[ ] Remover atalhos de acesso rápido\\n[ ] Desabilitar 'visto por último'"),
        "mission2": ("Missão Física: Preparação", "[ ] Guardar presentes em uma caixa\\n[ ] Rearrumar mobília para novo ângulo\\n[ ] Comprar roupa nova diferente\\n[ ] Mudar fragrância pessoal"),
        "mission3": ("Missão Mental: Declaração", "Escreva: 'Eu me ausento não para punir, mas para preservar o que sou. Minha ausência é minha presente.' Leia em voz alta 3x."),
        "rules": ("Regras de Emergência - Dia 1", "Se ela contactar hoje:\\n1. Espere mínimo 4h antes de responder\\n2. Resposta máxima: 'Tô bem, obrigado. Espero que você também esteja.'\\n3. NÃO pergunte nada\\n4. NÃO demonstre emoção"),
        "bio1": ("Técnica 4-7-8 para Ansiedade", "Inspire por 4s\\nSegure por 7s\\nExpire por 8s\\nRepita 10x. Isso ativa o nervo vago e reduz a ansiedade em 60%."),
        "bio2": ("Choque Frio Matinal", "Tome um banho de 2 minutos com água fria pela manhã. Isso aumenta noradrenalina em 530%, melhorando foco e reduzindo depressão."),
        "restr": ("Reestruturação: A Verdadeira Imagem", "Liste 5 comportamentos dela que você ignorou\\nListe 3 momentos onde ela não te valorizou\\nEscreva: 'Eu mereço alguém que me escolhe todos os dias'"),
        "sobre": ("Sobrecarga Cognitiva: Jogo de Memória", "Jogue um jogo de memória por 15 min. Quando seu cérebro foca em padrões visuais, ele para de ruminar sobre ela."),
        "quebra": ("Quebra de Padrão: Novo Café", "Vá em um café diferente hoje. Novos ambientes criam novas conexões neurais que ajudam a quebrar a fixação."),
    },
    {
        "day": 2,
        "title_pt": "O Modo Espectro", "title_es": "El Modo Espectro", "title_en": "Ghost Mode",
        "reading1": ("Invisibilidade Estratégica", "O Modo Espectro não é sobre punir - é sobre se tornar uma incógnita. Quando ela não sabe o que você está fazendo, a imaginação preenche o vácuo com cenas positivas sobre você."),
        "reading2": ("A Psicologia da Curiosidade", "O cérebro humano é programado para resolver incógnitas. Ao se tornar invisível nas redes, você cria uma 'tensão narrativa' que exige resolução. Isso a faz procurar por você."),
        "reading3": ("Histórias de Sucesso: O Sumiço", "Leia 3 casos de homens que sumiram estrategicamente e tiveram resultados surpreendentes. O padrão comum: disciplina total no primeiro mês."),
        "caso": ("Caso: O Executivo que Sumiu", "Carlos parou de postar, mudou o estilo de vestir, sumiu dos lugares comuns. Em 15 dias, ex-mulher perguntou aos amigos se ele estava bem. A incerteza gerou preocupação."),
        "quiz": ("Quiz: O que fazer nas redes sociais?", "A) Postar indiretas\\nB) Silenciar todas as interações\\nC) Bloquear ela\\nD) Postar fotos com outras"),
        "mission1": ("Missão Digital: Modo Espectro", "[ ] Desativar 'online' em todos os apps\\n[ ] Não curtir nada por 24h\\n[ ] Não visualizar stories\\n[ ] Remover ela dos 'melhores amigos'"),
        "mission2": ("Missão Física: Rota Alternativa", "[ ] Mudar seu caminho habitual\\n[ ] Ir a lugares diferentes\\n[ ] Evitar coincidências 'acidentais'\\n[ ] Criar novo horário de academia"),
        "mission3": ("Missão Social: Silêncio Informado", "Avise 2 amigos confiáveis: 'Não vou falar sobre ela por 30 dias. Se me perguntarem, digam que estou bem.'"),
        "rules": ("Regras: Modo Espectro Ativo", "HOJE você é um espectro:\\n- Invisível nas redes\\n- Indetectável nos hábitos\\n- Imprevisível nos horários\\n- Intocável emocionalmente"),
        "bio1": ("Meditação do Observador", "Sente-se e observe seus pensamentos como nuvens passando. Não julgue. Apenas observe. Isso cria distanciamento psicológico da dor."),
        "bio2": ("Exercício de Resistência", "Faça 20 polichinelos ou 10 polichinelos com peso. O desconforto físico reset a ansiedade emocional."),
        "restr": ("Reestruturação: O Espelho", "Olhe no espelho e diga: 'Eu sou completo sozinho'\\nRepita 5x\\nEscreva o que sentiu"),
        "sobre": ("Sobrecarga: Sudoku", "Resolva um sudoku difícil. A lógica pura ocupa o cérebro frontal e impede ruminação emocional."),
        "quebra": ("Quebra: Nova Playlist", "Crie uma playlist completamente diferente do que você ouvia com ela. Música nova = novas associações emocionais."),
    },
    {
        "day": 3,
        "title_pt": "O Valor Crescente", "title_es": "El Valor Creciente", "title_en": "Rising Value",
        "reading1": ("A Lei da Escassez", "Quanto mais escasso algo é, mais valioso se torna. Seu tempo e atenção devem se tornar commodities raras. Você não deve estar disponível 24/7."),
        "reading2": ("Construindo Valor Percebido", "Valor não é sobre dinheiro - é sobre o que você oferece emocionalmente, intelectualmente e experiencialmente. Liste 3 áreas onde você pode aumentar seu valor."),
        "reading3": ("A Pirâmide do Alto Valor", "O homem de alto valor: 1) Tem propósito próprio 2) Não busca validação 3) Tem abundância social 4) Cresce continuamente 5) Sabe dizer não."),
        "caso": ("Caso: De Desvalorizado a Disputado", "Pedro vivia para a ex. Quando começou a investir em si, fazer cursos, viajar, a ex começou a ver ele como premio novamente."),
        "quiz": ("Quiz: O que cria valor?", "A) Disponibilidade constante\\nB) Conquistas pessoais\\nC) Declarações de amor\\nD) Ciúmes"),
        "mission1": ("Missão: Investimento em Você", "[ ] Liste 3 habilidades para desenvolver\\n[ ] Pesquise 1 curso gratuito\\n[ ] Leia 20 páginas de um livro\\n[ ] Anote 1 insight"),
        "mission2": ("Missão: Upgrade Visual", "[ ] Escolha nova barba/cabelo\\n[ ] Organize o guarda-roupa\\n[ ] Defina 3 combinações novas\\n[ ] Tire uma foto do 'novo você'"),
        "mission3": ("Missão: Propósito", "Escreva sua missão pessoal em 1 frase. O que você quer conquistar além dela?"),
        "rules": ("Regras: Proteja Seu Valor", "Hoje:\\n- Não inicie nenhuma conversa\\n- Se ela falar, demore 6h para responder\\n- Responda com brevidade máxima\\n- Pergunte NADA sobre a vida dela"),
        "bio1": ("Respiração para Auto-Valor", "Inspire pensando 'Eu sou valioso'\\nSegure pensando 'Eu sou suficiente'\\nExpire pensando 'Eu não preciso provar nada'"),
        "bio2": ("Exercício: Postura de Poder", "Fique em pé com mãos na cintura por 2 min. Essa postura aumenta testosterona em 20% e reduz cortisol."),
        "restr": ("Reestruturação: Inventário de Valor", "Liste 10 coisas que você oferece em um relacionamento\\nListe 5 coisas que você aceitou de menos\\nDecida: não aceitará mais 3 delas"),
        "sobre": ("Sobrecarga: Aprenda Algo Novo", "Assista a um vídeo sobre um tópico completamente novo (física quântica, história da arte, etc). Aprendizado ocupa o cérebro."),
        "quebra": ("Quebra: Jantar Solo", "Jante sozinho em um restaurante diferente. Sentir-se bem em solitude é marcador de alto valor."),
    },
    {
        "day": 4,
        "title_pt": "Ancoragem de Identidade", "title_es": "Ancoraje de Identidad", "title_en": "Identity Anchoring",
        "reading1": ("Quem Você É Sem Ela?", "Muitos homens perdem a identidade no relacionamento. Hoje você reconstrói quem você é independente de qualquer pessoa."),
        "reading2": ("Ancoragem Emocional", "Crie âncoras físicas que lembram sua força: uma música, uma postura, uma frase. Use quando sentir fraqueza."),
        "reading3": ("O Homem de Propósito", "Homens sem propósito buscam validação em mulheres. Homens com propósito atraem mulheres naturalmente. Descubra seu propósito hoje."),
        "caso": ("Caso: A Reconstrução de Marcos", "Marcos tinha deixado de ser quem era. Quando redescobriu suas paixões (surf, música), a ex viu o homem que conhecera novamente."),
        "quiz": ("Quiz: Qual é sua âncora?", "A) O relacionamento dela\\nB) Seus hobbies antigos\\nC) O trabalho\\nD) Amigos"),
        "mission1": ("Missão: Reconexão Com o Passado", "[ ] Liste 3 paixões que abandonou\\n[ ] Escolha 1 para retomar\\n[ ] Agende 1 hora essa semana\\n[ ] Compre/comunique o equipamento necessário"),
        "mission2": ("Missão: Declaração de Identidade", "[ ] Escreva: 'Eu sou...' com 10 atributos\\n[ ] Escolha 1 para fortalecer\\n[ ] Defina 1 ação diária\\n[ ] Crie lembrete no celular"),
        "mission3": ("Missão: Ritual Matinal", "Crie um ritual de 10 min pela manhã que inclua: gratidão, intenção, movimento físico."),
        "rules": ("Regras: Identidade Primeiro", "Hoje você é prioridade:\\n- Não verifique se ela viu seus stories\\n- Não pense no que ela está fazendo\\n- Foque 100% em você mesmo"),
        "bio1": ("Âncora Respiratória", "Crie uma respiração pessoal: inspire 4s em pé, segure 4s com os braços abertos, expire 6s sentando. Repita 5x."),
        "bio2": ("Choque de Identidade", "Tome banho frio e grite 'EU SOU FORTE' no final. Isso ancora corpo e mente."),
        "restr": ("Reestruturação: Eu Sou", "Complete 20x: 'Eu sou _____'\\nVarie entre atributos, sonhos, características\\nLeia em voz alta"),
        "sobre": ("Sobrecarga: Desenhe", "Desenhe algo, mesmo que mal. Ativar o lado criativo direito equilibra o analítico esquerdo (que ruminia)."),
        "quebra": ("Quebra: Lugar de Infância", "Visite ou pesquise sobre um lugar da sua infância. Reconectar com raízes fortalece identidade."),
    },
    {
        "day": 5,
        "title_pt": "Magnetismo Seletivo", "title_es": "Magnetismo Selectivo", "title_en": "Selective Magnetism",
        "reading1": ("Atrair Sem Perseguir", "Magnetismo é sobre ser tão valioso que outros são atraídos naturalmente. Não é sobre perseguir - é sobre cultivar."),
        "reading2": ("Abundância Social", "Quando você tem opções, seu comportamento muda naturalmente. Crie uma vida social abundante para ter postura de abundância."),
        "reading3": ("O Efeito da Aprovação Social", "O cérebro feminino observa sinais de aprovação social. Se outros te valorizam, ela repete. Cultive sua rede social."),
        "caso": ("Caso: O Efeito da Festa", "Lucas começou a sair mais, postar fotos com amigos (sem exageros). A ex viu movimento social e curtiu uma foto após 2 meses."),
        "quiz": ("Quiz: Como criar magnetismo?", "A) Perseguindo mais\\nB) Sendo raro e valioso\\nC) Declarando amor\\nD) Fazendo ciúmes"),
        "mission1": ("Missão: Abertura Social", "[ ] Entre em 1 grupo novo (app/meetup)\\n[ ] Agende 1 encontro com amigos\\n[ ] Converse com 1 estranho hoje\\n[ ] Troque contatos com alguém"),
        "mission2": ("Missão: Documentação", "[ ] Tire foto fazendo algo interessante\\n[ ] NÃO poste ainda - guarde\\n[ ] Anote 1 história engraçada\\n[ ] Organize fotos antigas"),
        "mission3": ("Missão: Postura de Abundância", "Escreva: 'Tenho abundância de:' e liste 5 áreas. Foque nelas hoje."),
        "rules": ("Regras: Magnetismo Natural", "Hoje:\\n- Sorria para estranhos\\n- Inicie 1 conversa casual\\n- Não fale da sua ex para ninguém\\n- Demonstre interesse genuíno em outros"),
        "bio1": ("Respiração Magnética", "Respire profundamente imaginando energia saindo do seu peito. Sinta-se expansivo e atraente."),
        "bio2": ("Exercício: Postura Aberta", "Ande 5 minutos com braços abertos e peito erguido. Postura aberta = mente aberta = magnetismo."),
        "restr": ("Reestruturação: Abundância", "Liste 20 coisas pelas quais é grato\\nListe 5 pessoas que valorizam você\\nEscreva: 'Eu sou suficiente'"),
        "sobre": ("Sobrecarga: Dança", "Dance sozinho por 10 minutos. Movimento libera endorfinas e interrompe padrões mentais."),
        "quebra": ("Quebra: Evento Social", "Participe de algum evento social hoje, mesmo que online. Interação social é combustível emocional."),
    },
    {
        "day": 6,
        "title_pt": "Espelho de Aço", "title_es": "Espejo de Acero", "title_en": "Steel Mirror",
        "reading1": ("Reflexão Inquebrável", "O espelho de aço não distorce, não quebra, mostra a verdade. Você deve se tornar um espelho que reflete a realidade sem emoção excessiva."),
        "reading2": ("Gestão de Crises Emocionais", "Momentos de fraqueza virão. O espelho de aço é sua capacidade de olhar para a dor e não reagir impulsivamente."),
        "reading3": ("A Força do Indiferente Positivo", "Não é sobre não se importar - é sobre se importar PRIMEIRO de você. O espelho reflete: você está bem consigo mesmo?"),
        "caso": ("Caso: O Colapso Evitado", "Rafael quase quebrou o protocolo no dia 45 (aniversário da mãe da ex). Seu espelho de aço: lembrou que o momento difícil passa, mas a dignidade perdida não volta."),
        "quiz": ("Quiz: O que fazer na crise?", "A) Mandar mensagem\\nB) Chamar um amigo\\nC) Esperar passar\\nD) Usar técnicas de sobrevivência"),
        "mission1": ("Missão: Kit de Emergência", "[ ] Liste 5 gatilhos de crise\\n[ ] Crie 3 respostas alternativas\\n[ ] Salve números de apoio\\n[ ] Escreva carta para si no futuro"),
        "mission2": ("Missão: Aço Frio", "[ ] Pratique dizer 'não' em voz alta\\n[ ] Visualize rejeitando um apelo emocional\\n[ ] Escreva: 'Eu aguento a tempestade'"),
        "mission3": ("Missão: Preparação", "Planeje o que fará se ela tentar contato hoje. Tenha o script pronto."),
        "rules": ("Regras: Espelho de Aço", "HOJE você é invencível:\\n- Nenhuma mensagem será enviada\\n- Nenhuma story será vista\\n- Nenhuma emoção tomará decisões\\n- Você é o observador, não a vítima"),
        "bio1": ("Técnica do Observador", "Quando sentir dor, imagine-se vendo de fora. Observe a emoção sem ser consumido por ela."),
        "bio2": ("Choque de Disciplina", "Tome banho gelado por 3 min. Grite 'EU SOU FORTE' a cada minuto."),
        "restr": ("Reestruturação: Verdades", "Escreva 5 verdades difíceis sobre a relação\\nAgora escreva 5 verdades sobre sua força\\nCompare: onde você quer focar?"),
        "sobre": ("Sobrecarga: Corrida", "Corra 10 minutos ou pule corda. O corpo em movimento não sente ansiedade da mesma forma."),
        "quebra": ("Quebra: Documentário", "Assista um documentário sobre superação humana. Inspiração externa fortalece interna."),
    },
    {
        "day": 7,
        "title_pt": "Consolidação da Fase 1", "title_es": "Consolidación Fase 1", "title_en": "Phase 1 Consolidation",
        "reading1": ("Os 7 Dias de Guerra", "Você completou a primeira batalha. O silêncio estratégico já está criando efeito, mesmo que você não veja ainda."),
        "reading2": ("Análise de Danos e Vitórias", "Reveja a semana: onde você quase falhou? O que funcionou? O que aprendeu sobre si mesmo?"),
        "reading3": ("Preparando a Fase 2", "A próxima fase é sobre reconstrução. Você vai se tornar o homem que ela não conhecia mais - e vai querer conhecer."),
        "caso": ("Caso: Resultados da Semana 1", "Veja estatísticas: 70% dos homens que completam 7 dias de silêncio total relatam algum movimento da ex até o dia 14."),
        "quiz": ("Quiz: Você está pronto para a Fase 2?", "A) Sim, quero mais\\nB) Não sei se aguento\\nC) Quase desisti\\nD) Já mandei mensagem"),
        "mission1": ("Missão: Inventário", "[ ] Liste 3 vitórias da semana\\n[ ] Liste 1 lição aprendida\\n[ ] Ajuste 1 coisa para próxima semana\\n[ ] Escreva meta para Fase 2"),
        "mission2": ("Missão: Celebração", "[ ] Faça algo prazeroso só seu\\n[ ] Coma algo que gosta\\n[ ] Ouça música de vitória\\n[ ] Dance sozinho"),
        "mission3": ("Missão: Renovação", "Releia seu juramento inicial. Renove-o. Você é mais forte agora."),
        "rules": ("Regras: Vitória Parcial", "Hoje é dia de:\\n- Celebração contida\\n- Planejamento estratégico\\n- Gratidão genuína\\n- Confiança renovada"),
        "bio1": ("Respiração de Gratidão", "Respire agradecendo por cada dia completado. Você provou que é capaz."),
        "bio2": ("Banho de Vitória", "Banho morno com sal (desintoxicação emocional). Sente-se em paz."),
        "restr": ("Reestruturação: Evolução", "Compare o seu dia 1 com hoje\\nO que mudou internamente?\\nEscreva: 'Em 7 dias eu me tornei...'"),
        "sobre": ("Sobrecarga: Planejamento", "Planeje a próxima semana em detalhes. Planejamento ocupa a mente produtivamente."),
        "quebra": ("Quebra: Natureza", "Passe tempo na natureza. Reconecte-se com algo maior que o relacionamento."),
    },
]

# Generate all content
for day_data in phase1_days:
    d = day_data["day"]
    # PT
    CONTENT_PT[f'p.m1.d{d}.reading1.title'] = day_data["reading1"][0]
    CONTENT_PT[f'p.m1.d{d}.reading1.desc'] = day_data["reading1"][1]
    CONTENT_PT[f'p.m1.d{d}.reading2.title'] = day_data["reading2"][0]
    CONTENT_PT[f'p.m1.d{d}.reading2.desc'] = day_data["reading2"][1]
    CONTENT_PT[f'p.m1.d{d}.reading3.title'] = day_data["reading3"][0]
    CONTENT_PT[f'p.m1.d{d}.reading3.desc'] = day_data["reading3"][1]
    CONTENT_PT[f'p.m1.d{d}.caso.title'] = day_data["caso"][0]
    CONTENT_PT[f'p.m1.d{d}.caso.desc'] = day_data["caso"][1]
    CONTENT_PT[f'p.m1.d{d}.quiz.title'] = day_data["quiz"][0]
    CONTENT_PT[f'p.m1.d{d}.quiz.desc'] = day_data["quiz"][1]
    CONTENT_PT[f'p.m1.d{d}.mission1.title'] = day_data["mission1"][0]
    CONTENT_PT[f'p.m1.d{d}.mission1.desc'] = day_data["mission1"][1]
    CONTENT_PT[f'p.m1.d{d}.mission2.title'] = day_data["mission2"][0]
    CONTENT_PT[f'p.m1.d{d}.mission2.desc'] = day_data["mission2"][1]
    CONTENT_PT[f'p.m1.d{d}.mission3.title'] = day_data["mission3"][0]
    CONTENT_PT[f'p.m1.d{d}.mission3.desc'] = day_data["mission3"][1]
    CONTENT_PT[f'p.m1.d{d}.rules.title'] = day_data["rules"][0]
    CONTENT_PT[f'p.m1.d{d}.rules.desc'] = day_data["rules"][1]
    CONTENT_PT[f'p.m1.d{d}.bio1.title'] = day_data["bio1"][0]
    CONTENT_PT[f'p.m1.d{d}.bio1.desc'] = day_data["bio1"][1]
    CONTENT_PT[f'p.m1.d{d}.bio2.title'] = day_data["bio2"][0]
    CONTENT_PT[f'p.m1.d{d}.bio2.desc'] = day_data["bio2"][1]
    CONTENT_PT[f'p.m1.d{d}.restr.title'] = day_data["restr"][0]
    CONTENT_PT[f'p.m1.d{d}.restr.desc'] = day_data["restr"][1]
    CONTENT_PT[f'p.m1.d{d}.sobre.title'] = day_data["sobre"][0]
    CONTENT_PT[f'p.m1.d{d}.sobre.desc'] = day_data["sobre"][1]
    CONTENT_PT[f'p.m1.d{d}.quebra.title'] = day_data["quebra"][0]
    CONTENT_PT[f'p.m1.d{d}.quebra.desc'] = day_data["quebra"][1]

print("Phase 1 content generated!")
print(f"Total keys: {len(CONTENT_PT)}")
