#!/usr/bin/env python3
"""Add content for Phases 2-5 (Days 8-35)"""

# Phase 2: Reconstrução (Days 8-14)
PHASE2_DAYS = [
    (2, 1, "Arquitetura Masculina", {
        "reading1": ("Reconstruindo os Alicerces", "O homem que reconquista com sucesso não volta ao mesmo. Ele retorna como uma versão melhorada. Hoje você começa a reconstruir sua arquitetura interna."),
        "reading2": ("Pilares da Masculinidade Saudável", "Propósito + Postura + Presença = Magnetismo Natural. Sem esses pilares, você é apenas um menino pedindo atenção."),
        "reading3": ("O Arco-Íris da Transformação", "A transformação não é linear. Há dias de glória e dias de lama. Mas o trend é sempre para cima quando você segue o protocolo."),
        "caso": ("Caso: A Reconstrução de André", "André perdeu 10kg, começou a meditar, mudou de carreira. Em 3 meses, a ex viu o novo André e quis voltar. Ele decidiu se manter no poder."),
        "quiz": ("Quiz: O que é reconstrução?", "A) Mudar para ela voltar\\nB) Mudar para ser melhor\\nC) Fingir que mudou\\nD) Prometer que vai mudar"),
        "mission1": ("Missão: Auditoria de Vida", "[ ] Avalie saúde física (1-10)\\n[ ] Avalie saúde mental (1-10)\\n[ ] Avalie vida social (1-10)\\n[ ] Avalie propósito (1-10)"),
        "mission2": ("Missão: Plano de Ação", "[ ] Escolha 1 área para focar\\n[ ] Defina 1 meta de 30 dias\\n[ ] Defina 3 ações semanais\\n[ ] Agende no calendário"),
        "mission3": ("Missão: Compromisso", "Escreva um contrato consigo mesmo sobre sua transformação. Assine."),
        "rules": ("Regras: Construção", "Hoje você é o arquiteto:\\n- Não olhe para trás\\n- Foque no blueprint do futuro\\n- Cada ação constrói o novo você"),
        "bio1": ("Respiração de Construção", "Inspire energia nova\\nSegure força interior\\nExpire passado velho"),
        "bio2": ("Plank de Poder", "Faça plank por 1 min. Sinta-se forte e estável."),
        "restr": ("Reestruturação: Fundações", "O que você construiu antes que não funcionou?\\nO que precisa ser diferente?\\nEscreva o blueprint do novo você."),
        "sobre": ("Sobrecarga: Aprenda uma Habilidade", "Assista um tutorial de algo novo. Construção de habilidades ocupam a mente."),
        "quebra": ("Quebra: Visite um Lugar de Construção", "Obra, museu de arquitetura, ou lugar em reforma. Veja transformação acontecendo."),
    }),
    (2, 2, "Força Interior", {
        "reading1": ("A Fortaleza do Homem", "Força interior não é sobre não sentir. É sobre sentir e continuar mesmo assim. É sobre escolher ação apesar do medo."),
        "reading2": ("Desenvolvendo Resiliência", "Resiliência é como um músculo. Quanto mais você a usa, mais forte ela fica. Cada dia de protocolo é um rep de resiliência."),
        "reading3": ("A Calma na Tempestade", "O homem forte é ainda quando tudo balança. Sua calma emocional torna-se um farol que atrai quando o caos diminui."),
        "caso": ("Caso: A Calma de Ricardo", "Ricardo manteve a postura mesmo quando a ex tentou provocar ciúmes. Sua calma demonstrou valor. Ela percebeu que não podia mais manipular."),
        "quiz": ("Quiz: O que é força interior?", "A) Não sentir emoções\\nB) Sentir e continuar\\nC) Esconder fraqueza\\nD) Ser duro"),
        "mission1": ("Missão: Teste de Força", "[ ] Faça 50 polichinelos\\n[ ] Aguentar desconforto por 5 min\\n[ ] Diga 'não' a algo que não quer\\n[ ] Mantenha postura sob pressão"),
        "mission2": ("Missão: Fortaleza Mental", "[ ] Medite por 15 min\\n[ ] Journal sobre medos\\n[ ] Escreva 3 medos superados\\n[ ] Visualize vitória"),
        "mission3": ("Missão: Mantra de Força", "Crie um mantra pessoal de força. Repita 10x quando sentir fraqueza."),
        "rules": ("Regras: Força Total", "Hoje você é indestrutível:\\n- Nenhuma emoção te controla\\n- Nenhuma provocação te move\\n- Você é a rocha no centro da tempestade"),
        "bio1": ("Respiração de Ferro", "Inspire força\\nSegure poder\\nExpire fraqueza"),
        "bio2": ("Burpees de Guerra", "Faça 10 burpees rápidos. Sinta o fogo no corpo."),
        "restr": ("Reestruturação: Minha Força", "Quando você foi forte antes?\\nComo pode ser forte agora?\\nEscreva: 'Eu sou forte porque...'"),
        "sobre": ("Sobrecarga: Leia sobre Resiliência", "Leia sobre alguém que superou dificuldades. Inspiração constrói força."),
        "quebra": ("Quebra: Desafie-se", "Faça algo que tem medo (pequeno). Ação no medo = força."),
    }),
    (2, 3, "Propósito e Direção", {
        "reading1": ("O Homem com Norte", "Homem sem propósito é folha ao vento. Homem com propósito é imã. Descubra seu norte hoje."),
        "reading2": ("Missão de Vida", "Você não nasceu para ser namorado. Você nasceu para algo maior. O relacionamento é complemento, não definição."),
        "reading3": ("Atração por Propósito", "Mulheres são atraídas por homens em missão. Não pelo homem que implora atenção. Defina sua missão."),
        "caso": ("Caso: O Propósito de Daniel", "Daniel descobriu paixão por ajudar animais. Começou ONG. Ex viu propósito e voltou. Ele estava tão focado que nem percebeu de imediato."),
        "quiz": ("Quiz: Qual seu propósito?", "A) Fazê-la feliz\\nB) Ser o melhor em algo\\nC) Agradar os outros\\nD) Não sei"),
        "mission1": ("Missão: Descoberta", "[ ] Liste 5 coisas que faz perder noção do tempo\\n[ ] Identifique 3 valores principais\\n[ ] Escreva missão em 1 frase\\n[ ] Crie plano de 90 dias"),
        "mission2": ("Missão: Movimento", "[ ] Dê 1 passo na direção do propósito\\n[ ] Converse com alguém na área\\n[ ] Pesquise sobre o tema\\n[ ] Anote 3 aprendizados"),
        "mission3": ("Missão: Declaração de Propósito", "Escreva e recite: 'Meu propósito é...'"),
        "rules": ("Regras: Propósito Primeiro", "Hoje seu propósito vem antes:\\n- Toda decisão passa pelo filtro do propósito\\n- Nada atrapalha sua missão\\n- Você é o protagonista da sua história"),
        "bio1": ("Respiração de Propósito", "Inspire missão\\nSegure visão\\nExpire distração"),
        "bio2": ("Exercício: Foco Total", "Fique em posição de atenção por 3 min. Imóvel, focado, presente."),
        "restr": ("Reestruturação: Meu Norte", "O que você fazia antes que abandonou?\\nPor que abandonou?\\nComo pode retomar?"),
        "sobre": ("Sobrecarga: Documentário de Propósito", "Assista algo inspirador sobre pessoas em missão."),
        "quebra": ("Quebra: Ação no Propósito", "Faça 1 ação concreta em direção ao seu propósito."),
    }),
    (2, 4, "Rede de Conexões", {
        "reading1": ("Abundância Social", "Homens isolados são desesperados. Homens conectados são atrativos. Construa sua rede antes de precisar dela."),
        "reading2": ("A Lei da Aprovação Social", "Quando outros te valorizam, ela questiona: 'Será que eu subestimei ele?' Aprovação social é prova de valor."),
        "reading3": ("Amizades de Verdade", "Amigos são ativos emocionais. Investir em amizades é investir em si mesmo. Hoje você fortalece laços."),
        "caso": ("Caso: O Retorno Social de Lucas", "Lucas reconectou com amigos, fez novos contatos. Quando a ex viu fotos de grupo, sentiu que perdeu algo valioso."),
        "quiz": ("Quiz: Como construir rede?", "A) Ficar sozinho sofrendo\\nB) Reconectar com amigos\\nC) Fingir que tem amigos\\nD) Fazer novos amigos\\nResposta: B e D"),
        "mission1": ("Missão: Reconexão", "[ ] Ligue para 1 amigo antigo\\n[ ] Agende 1 encontro social\\n[ ] Entre em 1 grupo online\\n[ ] Participe de 1 evento"),
        "mission2": ("Missão: Novas Conexões", "[ ] Converse com 1 estranho\\n[ ] Troque contatos com alguém\\n[ ] Ajude alguém hoje\\n[ ] Sorria para 5 pessoas"),
        "mission3": ("Missão: Gratidão Social", "Escreva 3 mensagens de gratidão para amigos. Envie."),
        "rules": ("Regras: Conexão", "Hoje você está entre pessoas:\\n- Não fique isolado\\n- Compartilhe experiências\\n- Seja presente nas conversas"),
        "bio1": ("Respiração Social", "Inspire abertura\\nSegure conexão\\nExpire isolamento"),
        "bio2": ("Alongamento em Grupo", "Se possível, faça atividade física com alguém. Conexão + movimento."),
        "restr": ("Reestruturação: Minha Rede", "Quem são seus verdadeiros aliados?\\nQuem te tira energia?\\nComo pode fortalecer bons laços?"),
        "sobre": ("Sobrecarga: Networking", "Assista vídeo sobre como fazer conexões. Aprenda uma técnica nova."),
        "quebra": ("Quebra: Evento Social", "Participe de qualquer evento com pessoas. Online ou presencial."),
    }),
    (2, 5, "Corpo e Mente", {
        "reading1": ("O Templo do Ser", "Seu corpo é seu veículo nesta vida. Se você não cuida dele, está sabotando sua própria missão. Hoje você honra seu corpo."),
        "reading2": ("Saúde como Base", "Mente forte exige corpo forte. Alimentação, sono, exercício não são luxos - são necessidades para alta performance."),
        "reading3": ("Atração Física", "Aparência não é tudo, mas é a porta de entrada. Cuidar do corpo demonstra autodisciplina e auto-respeito."),
        "caso": ("Caso: A Transformação Física de Bruno", "Bruno perdeu 15kg, ganhou músculos. Ex não reconheceu de imediato. Quando reconheceu, a mudança física foi evidência de mudança interna."),
        "quiz": ("Quiz: Por que cuidar do corpo?", "A) Para ela voltar\\nB) Para ser saudável\\nC) Para parecer bem\\nD) Para postar fotos"),
        "mission1": ("Missão: Movimento", "[ ] Exercício por 30 min\\n[ ] 10.000 passos\\n[ ] Alongamento por 10 min\\n[ ] Beba 3L de água"),
        "mission2": ("Missão: Nutrição", "[ ] Coma vegetais hoje\\n[ ] Elimine açúcar\\n[ ] Coma proteína em todas refeições\\n[ ] Durma 8 horas"),
        "mission3": ("Missão: Compromisso Físico", "Escreva 3 hábitos físicos que manterá pelos próximos 30 dias."),
        "rules": ("Regras: Corpo Santo", "Hoje você honra o templo:\\n- Comida é combustível, não consolo\\n- Exercício é obrigação, não opção\\n- Sono é sagrado"),
        "bio1": ("Respiração Corporal", "Inspire energia\\nSegure vitalidade\\nExpire toxinas"),
        "bio2": ("HIIT Express", "Faça 5 min de exercício intenso: 30s trabalho, 30s descanso."),
        "restr": ("Reestruturação: Meu Corpo", "Como você tem tratado seu corpo?\\nO que precisa mudar?\\nEscreva: 'Eu mereço saúde porque...'"),
        "sobre": ("Sobrecarga: Receita Saudável", "Pesquise e anote uma receita saudável. Prepare amanhã."),
        "quebra": ("Quebra: Natureza", "Caminhe ao ar livre por 20 min. Movimento + natureza = cura."),
    }),
    (2, 6, "Transformação Visível", {
        "reading1": ("Sinais Externos de Mudança Interna", "Mudança interna precisa refletir externamente. Novo visual = novo você. Hoje você mostra ao mundo que mudou."),
        "reading2": ("O Poder da Aparência Renovada", "Corte de cabelo, roupa nova, postura diferente. Pequenas mudanças visuais causam grandes impactos perceptivos."),
        "reading3": ("Marketing Pessoal", "Você é uma marca. Como você se apresenta ao mundo? Hoje você atualiza sua marca pessoal."),
        "caso": ("Caso: O Novo Visual de Tiago", "Tiago mudou corte, barba, estilo. Amigos postaram fotos. Ex viu e comentou 'que mudança!' - curiosidade ativada."),
        "quiz": ("Quiz: O que muda aparência?", "A) Apenas roupa\\nB) Postura, corte, roupa, atitude\\nC) Apenas academia\\nD) Apenas sorriso"),
        "mission1": ("Missão: Visual", "[ ] Mude algo no cabelo/barba\\n[ ] Vista algo diferente\\n[ ] Melhore postura\\n[ ] Sorria mais hoje"),
        "mission2": ("Missão: Documentação", "[ ] Tire fotos do novo visual\\n[ ] Peça feedback de amigos\\n[ ] Atualize foto de perfil\\n[ ] Guarde para comparar"),
        "mission3": ("Missão: Confiança", "Olhe no espelho e diga: 'Eu gosto do que vejo.' Repita até sentir."),
        "rules": ("Regras: Novo Visual", "Hoje você é a nova versão:\\n- Vista-se como quem você quer ser\\n- Postura de confiança\\n- Sorriso de quem sabe seu valor"),
        "bio1": ("Respiração de Confiança", "Inspire poder\\nSegure postura\\nExpire insegurança"),
        "bio2": ("Power Pose", "Fique em pose de poder por 2 min. Sinta-se expansivo."),
        "restr": ("Reestruturação: Minha Imagem", "Como você se via antes?\\nComo quer ser visto agora?\\nO que precisa mudar?"),
        "sobre": ("Sobrecarga: Estilo", "Pesquise sobre estilo pessoal. Encontre referências."),
        "quebra": ("Quebra: Shopping", "Visite uma loja e experimente algo diferente."),
    }),
    (2, 7, "Consolidação da Fase 2", {
        "reading1": ("Os 14 Dias de Construção", "Duas semanas de reconstrução. Você já não é o mesmo homem que iniciou. A base está sendo construída."),
        "reading2": ("Análise da Transformação", "Reveja: o que mudou em você? O que ainda precisa mudar? O que você aprendeu sobre si mesmo?"),
        "reading3": ("Preparando a Fase 3", "A próxima fase é sobre Criação de Valor. Você vai se tornar o homem de alto valor que naturalmente atrai."),
        "caso": ("Caso: Resultados da Semana 2", "Homens que completam 14 dias de reconstrução relatam: mais energia, mais confiança, mais atenção de mulheres em geral."),
        "quiz": ("Quiz: Você mudou?", "A) Sim, drasticamente\\nB) Um pouco\\nC) Não mudei\\nD) Piorou"),
        "mission1": ("Missão: Avaliação", "[ ] Compare fotos do dia 1 e hoje\\n[ ] Liste 5 mudanças internas\\n[ ] Liste 3 mudanças externas\\n[ ] Defina próximos passos"),
        "mission2": ("Missão: Celebração", "[ ] Faça algo que recompense o esforço\\n[ ] Compartilhe conquistas com alguém\\n[ ] Agradeça pela jornada"),
        "mission3": ("Missão: Renovação", "Reafirme seu compromisso com a transformação. Escreva: 'Continuo porque...'"),
        "rules": ("Regras: Celebração", "Hoje é dia de:\\n- Refletir sobre conquistas\\n- Agradecer pelo progresso\\n- Renovar compromisso"),
        "bio1": ("Respiração de Gratidão", "Agradeça por cada mudança. Sinta gratidão genuína."),
        "bio2": ("Relaxamento", "Banho morno, relaxamento total. Você merece."),
        "restr": ("Reestruturação: Evolução", "Quem você era no dia 1?\\nQuem você é hoje?\\nQuem você será no dia 35?"),
        "sobre": ("Sobrecarga: Plano", "Planeje a próxima fase em detalhes."),
        "quebra": ("Quebra: Relaxamento", "Dia de descanso ativo. Caminhe, relaxe, recarregue."),
    }),
]

def format_content(module, day, data):
    lines = [f"    // M{module}D{day}"]
    for key in ['reading1', 'reading2', 'reading3', 'caso', 'quiz', 'mission1', 'mission2', 'mission3', 'rules', 'bio1', 'bio2', 'restr', 'sobre', 'quebra']:
        if key in data:
            title, desc = data[key]
            lines.append(f"    'p.m{module}.d{day}.{key}.title': '{title}',")
            lines.append(f"    'p.m{module}.d{day}.{key}.desc': '{desc}',")
    lines.append("")
    return '\n'.join(lines)

# Generate all content
content = ""
for module, day, title, data in PHASE2_DAYS:
    content += format_content(module, day, data)

# Read and update i18n.ts
with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'r') as f:
    original = f.read()

marker = "    'p.m1.d7.quebra.desc': 'Natureza'"
if marker in original:
    new_content = original.replace(marker, marker + '\n' + content)
    with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'w') as f:
        f.write(new_content)
    print("Phase 2 content added!")
else:
    print("Marker not found")
    # Try alternative
    marker = "    'p.m1.d7.quebra.desc'"
    print("Searching for:", marker)
    if marker in original:
        print("Found partial marker")
