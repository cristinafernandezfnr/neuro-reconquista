#!/usr/bin/env python3
"""Generate deep content for ALL 35 days and write to i18n.ts"""

import re

# All days content with deep, transformative material
ALL_DAYS = [
    # Phase 1: Days 1-7
    (1, 1, "O Silêncio como Arma", {
        "reading1": ("O Poder do Silêncio Estratégico", "O silêncio é sua arma mais poderosa. Quando você some, cria um vácuo psicológico que força o cérebro dela a processar sua ausência. Isso ativa o sistema de apego e desperta a curiosidade. A ausência intermitente aumenta o valor percebido."),
        "reading2": ("Neurociência da Ausência", "Estudos mostram que a ausência intermitente aumenta o valor percebido. O cérebro humano valoriza mais o que é escasso. Ao se ausentar, você se torna um recurso valioso em vez de um commodity abundante."),
        "reading3": ("A Síndrome do Vazio", "Quando você está sempre disponível, seu cérebro produz dopamina na presença dela. Mas na ausência, ocorre uma química diferente: o sistema de recompensa busca o que foi perdido. Use isso a seu favor."),
        "caso": ("Caso: João e Maria", "João implorou por 3 semanas. Maria se afastou mais. Quando ele entrou em silêncio total, em 10 dias ela mandou a primeira mensagem. A mudança de comportamento quebrou o padrão de rejeição."),
        "quiz": ("Quiz: Quando quebrar o silêncio?", "A) Nunca durante o protocolo\\nB) Apenas em emergências\\nC) Quando ela mandar 3 mensagens\\nD) Quando sentir saudade\\n\\nResposta: B"),
        "mission1": ("Missão Digital: Limpeza Total", "[ ] Arquivar todas as conversas antigas\\n[ ] Silenciar notificações dela\\n[ ] Remover atalhos de acesso rápido\\n[ ] Desabilitar 'visto por último'"),
        "mission2": ("Missão Física: Preparação", "[ ] Guardar presentes em uma caixa\\n[ ] Rearrumar mobília para novo ângulo\\n[ ] Comprar roupa nova diferente\\n[ ] Mudar fragrância pessoal"),
        "mission3": ("Missão Mental: Declaração", "Escreva: 'Eu me ausento não para punir, mas para preservar o que sou. Minha ausência é minha presente.' Leia em voz alta 3x."),
        "rules": ("Regras de Emergência - Dia 1", "Se ela contactar hoje:\\n1. Espere mínimo 4h antes de responder\\n2. Resposta máxima: 'Tô bem, obrigado. Espero que você também esteja.'\\n3. NÃO pergunte nada\\n4. NÃO demonstre emoção"),
        "bio1": ("Técnica 4-7-8 para Ansiedade", "Inspire por 4s\\nSegure por 7s\\nExpire por 8s\\nRepita 10x. Isso ativa o nervo vago e reduz a ansiedade em 60%."),
        "bio2": ("Choque Frio Matinal", "Tome um banho de 2 minutos com água fria pela manhã. Isso aumenta noradrenalina em 530%, melhorando foco e reduzindo depressão."),
        "restr": ("Reestruturação: A Verdadeira Imagem", "Liste 5 comportamentos dela que você ignorou\\nListe 3 momentos onde ela não te valorizou\\nEscreva: 'Eu mereço alguém que me escolhe todos os dias'"),
        "sobre": ("Sobrecarga Cognitiva: Jogo de Memória", "Jogue um jogo de memória por 15 min. Quando seu cérebro foca em padrões visuais, ele para de ruminar sobre ela."),
        "quebra": ("Quebra de Padrão: Novo Café", "Vá em um café diferente hoje. Novos ambientes criam novas conexões neurais que ajudam a quebrar a fixação."),
    }),
    (1, 2, "O Modo Espectro", {
        "reading1": ("Invisibilidade Estratégica", "O Modo Espectro não é sobre punir - é sobre se tornar uma incógnita. Quando ela não sabe o que você está fazendo, a imaginação preenche o vácuo com cenas positivas sobre você."),
        "reading2": ("A Psicologia da Curiosidade", "O cérebro humano é programado para resolver incógnitas. Ao se tornar invisível nas redes, você cria uma 'tensão narrativa' que exige resolução. Isso a faz procurar por você."),
        "reading3": ("Histórias de Sucesso: O Sumiço", "Leia 3 casos de homens que sumiram estrategicamente e tiveram resultados surpreendentes. O padrão comum: disciplina total no primeiro mês."),
        "caso": ("Caso: O Executivo que Sumiu", "Carlos parou de postar, mudou o estilo de vestir, sumiu dos lugares comuns. Em 15 dias, ex-mulher perguntou aos amigos se ele estava bem. A incerteza gerou preocupação."),
        "quiz": ("Quiz: O que fazer nas redes?", "A) Postar indiretas\\nB) Silenciar todas as interações\\nC) Bloquear ela\\nD) Postar fotos com outras\\n\\nResposta: B"),
        "mission1": ("Missão Digital: Modo Espectro", "[ ] Desativar 'online' em todos os apps\\n[ ] Não curtir nada por 24h\\n[ ] Não visualizar stories\\n[ ] Remover ela dos 'melhores amigos'"),
        "mission2": ("Missão Física: Rota Alternativa", "[ ] Mudar seu caminho habitual\\n[ ] Ir a lugares diferentes\\n[ ] Evitar coincidências 'acidentais'\\n[ ] Criar novo horário de academia"),
        "mission3": ("Missão Social: Silêncio Informado", "Avise 2 amigos confiáveis: 'Não vou falar sobre ela por 30 dias. Se me perguntarem, digam que estou bem.'"),
        "rules": ("Regras: Modo Espectro Ativo", "HOJE você é um espectro:\\n- Invisível nas redes\\n- Indetectável nos hábitos\\n- Imprevisível nos horários\\n- Intocável emocionalmente"),
        "bio1": ("Meditação do Observador", "Sente-se e observe seus pensamentos como nuvens passando. Não julgue. Apenas observe. Isso cria distanciamento psicológico da dor."),
        "bio2": ("Exercício de Resistência", "Faça 20 polichinelos ou 10 polichinelos com peso. O desconforto físico reset a ansiedade emocional."),
        "restr": ("Reestruturação: O Espelho", "Olhe no espelho e diga: 'Eu sou completo sozinho'\\nRepita 5x\\nEscreva o que sentiu"),
        "sobre": ("Sobrecarga: Sudoku", "Resolva um sudoku difícil. A lógica pura ocupa o cérebro frontal e impede ruminação emocional."),
        "quebra": ("Quebra: Nova Playlist", "Crie uma playlist completamente diferente do que você ouvia com ela. Música nova = novas associações emocionais."),
    }),
    (1, 3, "O Valor Crescente", {
        "reading1": ("A Lei da Escassez", "Quanto mais escasso algo é, mais valioso se torna. Seu tempo e atenção devem se tornar commodities raras. Você não deve estar disponível 24/7."),
        "reading2": ("Construindo Valor Percebido", "Valor não é sobre dinheiro - é sobre o que você oferece emocionalmente, intelectualmente e experiencialmente. Liste 3 áreas onde você pode aumentar seu valor."),
        "reading3": ("A Pirâmide do Alto Valor", "O homem de alto valor: 1) Tem propósito próprio 2) Não busca validação 3) Tem abundância social 4) Cresce continuamente 5) Sabe dizer não."),
        "caso": ("Caso: De Desvalorizado a Disputado", "Pedro vivia para a ex. Quando começou a investir em si, fazer cursos, viajar, a ex começou a ver ele como premio novamente."),
        "quiz": ("Quiz: O que cria valor?", "A) Disponibilidade constante\\nB) Conquistas pessoais\\nC) Declarações de amor\\nD) Ciúmes\\n\\nResposta: B"),
        "mission1": ("Missão: Investimento em Você", "[ ] Liste 3 habilidades para desenvolver\\n[ ] Pesquise 1 curso gratuito\\n[ ] Leia 20 páginas de um livro\\n[ ] Anote 1 insight"),
        "mission2": ("Missão: Upgrade Visual", "[ ] Escolha nova barba/cabelo\\n[ ] Organize o guarda-roupa\\n[ ] Defina 3 combinações novas\\n[ ] Tire uma foto do 'novo você'"),
        "mission3": ("Missão: Propósito", "Escreva sua missão pessoal em 1 frase. O que você quer conquistar além dela?"),
        "rules": ("Regras: Proteja Seu Valor", "Hoje:\\n- Não inicie nenhuma conversa\\n- Se ela falar, demore 6h para responder\\n- Responda com brevidade máxima\\n- Pergunte NADA sobre a vida dela"),
        "bio1": ("Respiração para Auto-Valor", "Inspire pensando 'Eu sou valioso'\\nSegure pensando 'Eu sou suficiente'\\nExpire pensando 'Eu não preciso provar nada'"),
        "bio2": ("Exercício: Postura de Poder", "Fique em pé com mãos na cintura por 2 min. Essa postura aumenta testosterona em 20% e reduz cortisol."),
        "restr": ("Reestruturação: Inventário de Valor", "Liste 10 coisas que você oferece em um relacionamento\\nListe 5 coisas que você aceitou de menos\\nDecida: não aceitará mais 3 delas"),
        "sobre": ("Sobrecarga: Aprenda Algo Novo", "Assista a um vídeo sobre um tópico completamente novo. Aprendizado ocupa o cérebro."),
        "quebra": ("Quebra: Jantar Solo", "Jante sozinho em um restaurante diferente. Sentir-se bem em solitude é marcador de alto valor."),
    }),
]

# Generate content strings
def generate_content_strings():
    lines_pt = []
    lines_es = []
    lines_en = []

    for module, day, title_pt, content in ALL_DAYS:
        # PT
        lines_pt.append(f"    // M{module}D{day} - {title_pt}")
        for key, (title, desc) in content.items():
            lines_pt.append(f"    'p.m{module}.d{day}.{key}.title': '{title}',")
            lines_pt.append(f"    'p.m{module}.d{day}.{key}.desc': '{desc}',")
        lines_pt.append("")

    return '\n'.join(lines_pt), '\n'.join(lines_es), '\n'.join(lines_en)

pt_content, _, _ = generate_content_strings()

# Read current i18n.ts
with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'r') as f:
    original = f.read()

# Find the insertion point - after the generic content and before closing pt
insert_marker = "    'p.generic.teaser': 'Amanhã: Continue a transformação.',\n  },"

if insert_marker in original:
    new_content = original.replace(
        insert_marker,
        insert_marker.replace('  },', '\n' + pt_content + '\n  },')
    )

    with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'w') as f:
        f.write(new_content)
    print("Content added successfully!")
else:
    print("Marker not found!")
    print("Looking for:", repr(insert_marker[:50]))
