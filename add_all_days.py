#!/usr/bin/env python3
import re

# Template for day content
def day_content(m, d):
    return f"""
    // M{m}D{d}
    'p.m{m}.d{d}.reading1.title': 'Leitura 1 - Fundamentos do Dia {d}',
    'p.m{m}.d{d}.reading1.desc': 'Conteúdo profundo sobre transformação pessoal, desenvolvimento de caráter e crescimento emocional. Este material foi criado para ajudá-lo a se tornar o melhor homem que pode ser.',
    'p.m{m}.d{d}.reading2.title': 'Leitura 2 - Psicologia Aplicada',
    'p.m{m}.d{d}.reading2.desc': 'Entenda os mecanismos psicológicos por trás das dinâmicas de relacionamento e como você pode usar esse conhecimento para criar conexões mais profundas e significativas.',
    'p.m{m}.d{d}.reading3.title': 'Leitura 3 - Estudo de Caso Real',
    'p.m{m}.d{d}.reading3.desc': 'Análise de situações reais onde homens como você transformaram suas vidas e relacionamentos através do autoconhecimento e aplicação desses princípios.',
    'p.m{m}.d{d}.caso.title': 'Estudo de Caso Aplicável',
    'p.m{m}.d{d}.caso.desc': 'Cenário prático baseado em histórias reais de homens que enfrentaram desafios similares aos seus e emergiram mais fortes, mais confiantes e mais capacitados.',
    'p.m{m}.d{d}.quiz.title': 'Quiz de Fixação',
    'p.m{m}.d{d}.quiz.desc': 'Teste seus conhecimentos sobre os conceitos aprendidos hoje e veja como pode aplicá-los imediatamente em sua jornada de transformação.',
    'p.m{m}.d{d}.mission1.title': 'Missão 1 - Ação Estratégica',
    'p.m{m}.d{d}.mission1.desc': '[ ] Complete a primeira tarefa do dia\n[ ] Mantenha o foco no seu crescimento\n[ ] Documente seu progresso',
    'p.m{m}.d{d}.mission2.title': 'Missão 2 - Desenvolvimento Pessoal',
    'p.m{m}.d{d}.mission2.desc': '[ ] Pratique uma nova habilidade\n[ ] Saia da zona de conforto\n[ ] Celebre pequenas vitórias',
    'p.m{m}.d{d}.mission3.title': 'Missão 3 - Consolidação',
    'p.m{m}.d{d}.mission3.desc': 'Refleta sobre o dia e escreva três aprendizados importantes que você pode levar consigo para sempre.',
    'p.m{m}.d{d}.rules.title': 'Regras de Engajamento - Dia {d}',
    'p.m{m}.d{d}.rules.desc': 'Mantenha o protocolo. Se ela entrar em contato: espere antes de responder, seja breve, mantenha emoção zero. Seu poder está na sua ausência estratégica.',
    'p.m{m}.d{d}.bio1.title': 'Exercício 1 - Respiração e Calma',
    'p.m{m}.d{d}.bio1.desc': 'Pratique respiração profunda por 5 minutos. Inspire por 4s, segure por 4s, expire por 6s. Isso ativa o sistema nervoso parassimpático e reduz ansiedade.',
    'p.m{m}.d{d}.bio2.title': 'Exercício 2 - Movimento Físico',
    'p.m{m}.d{d}.bio2.desc': 'Faça atividade física por 20 minutos. Pode ser caminhada, corrida, musculação ou qualquer movimento que faça seu corpo sentir-se vivo e forte.',
    'p.m{m}.d{d}.restr.title': 'Exercício 3 - Reestruturação Cognitiva',
    'p.m{m}.d{d}.restr.desc': 'Escreva no seu diário: quais crenças limitantes você identificou hoje? Como pode substituí-las por crenças empoderadoras?',
    'p.m{m}.d{d}.sobre.title': 'Exercício 4 - Sobrecarga Positiva',
    'p.m{m}.d{d}.sobre.desc': 'Engaje-se em uma atividade que exija foco total por 30 minutos. Isso pode ser um hobby, aprendizado novo ou qualquer coisa que ocupe sua mente completamente.',
    'p.m{m}.d{d}.quebra.title': 'Exercício 5 - Quebra de Padrão',
    'p.m{m}.d{d}.quebra.desc': 'Faça algo diferente hoje. Um novo caminho, um novo lugar, uma nova conversa. Novas experiências criam novas conexões neurais e perspectivas.',
"""

with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'r') as f:
    content = f.read()

# Check what needs to be added
for m in range(1, 6):
    for d in range(2, 8):
        if m == 5 and d > 7:
            break
        if f"p.m{m}.d{d}.reading1" not in content:
            # Find where to insert - after previous day
            prev_day_marker = f"p.m{m}.d{d-1}.quebra.desc"
            if prev_day_marker in content:
                # Find the full line
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if prev_day_marker in line and "'" in line:
                        lines.insert(i+1, day_content(m, d))
                        content = '\n'.join(lines)
                        break

with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'w') as f:
    f.write(content)

print("Content added for all days!")
