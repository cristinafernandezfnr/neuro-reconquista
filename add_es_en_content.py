#!/usr/bin/env python3

# Template for ES content
def es_content(m, d):
    return f"""
    // M{m}D{d}
    'p.m{m}.d{d}.reading1.title': 'Lectura 1 - Fundamentos del Día {d}',
    'p.m{m}.d{d}.reading1.desc': 'Contenido profundo sobre transformación personal, desarrollo de carácter y crecimiento emocional. Este material fue creado para ayudarte a convertirte en el mejor hombre que puedes ser.',
    'p.m{m}.d{d}.reading2.title': 'Lectura 2 - Psicología Aplicada',
    'p.m{m}.d{d}.reading2.desc': 'Entiende los mecanismos psicológicos detrás de las dinámicas de relación y cómo puedes usar ese conocimiento para crear conexiones más profundas y significativas.',
    'p.m{m}.d{d}.reading3.title': 'Lectura 3 - Estudio de Caso Real',
    'p.m{m}.d{d}.reading3.desc': 'Análisis de situaciones reales donde hombres como tú transformaron sus vidas y relaciones a través del autoconocimiento y aplicación de estos principios.',
    'p.m{m}.d{d}.caso.title': 'Estudio de Caso Aplicable',
    'p.m{m}.d{d}.caso.desc': 'Escenario práctico basado en historias reales de hombres que enfrentaron desafíos similares a los tuyos y emergieron más fuertes, más confiados y más capacitados.',
    'p.m{m}.d{d}.quiz.title': 'Quiz de Fijación',
    'p.m{m}.d{d}.quiz.desc': 'Prueba tus conocimientos sobre los conceptos aprendidos hoy y ve cómo puedes aplicarlos inmediatamente en tu jornada de transformación.',
    'p.m{m}.d{d}.mission1.title': 'Misión 1 - Acción Estratégica',
    'p.m{m}.d{d}.mission1.desc': '[ ] Completa la primera tarea del día\n[ ] Mantén el foco en tu crecimiento\n[ ] Documenta tu progreso',
    'p.m{m}.d{d}.mission2.title': 'Misión 2 - Desarrollo Personal',
    'p.m{m}.d{d}.mission2.desc': '[ ] Practica una nueva habilidad\n[ ] Sal de la zona de confort\n[ ] Celebra pequeñas victorias',
    'p.m{m}.d{d}.mission3.title': 'Misión 3 - Consolidación',
    'p.m{m}.d{d}.mission3.desc': 'Reflexiona sobre el día y escribe tres aprendizajes importantes que puedes llevar contigo para siempre.',
    'p.m{m}.d{d}.rules.title': 'Reglas de Enganche - Día {d}',
    'p.m{m}.d{d}.rules.desc': 'Mantén el protocolo. Si ella entra en contacto: espera antes de responder, sé breve, mantén emoción cero. Tu poder está en tu ausencia estratégica.',
    'p.m{m}.d{d}.bio1.title': 'Ejercicio 1 - Respiración y Calma',
    'p.m{m}.d{d}.bio1.desc': 'Practica respiración profunda por 5 minutos. Inspira por 4s, aguanta por 4s, expira por 6s. Esto activa el sistema nervioso parasimpático y reduce ansiedad.',
    'p.m{m}.d{d}.bio2.title': 'Ejercicio 2 - Movimiento Físico',
    'p.m{m}.d{d}.bio2.desc': 'Haz actividad física por 20 minutos. Puede ser caminata, carrera, musculación o cualquier movimiento que haga tu cuerpo sentirse vivo y fuerte.',
    'p.m{m}.d{d}.restr.title': 'Ejercicio 3 - Reestructuración Cognitiva',
    'p.m{m}.d{d}.restr.desc': 'Escribe en tu diario: ¿qué creencias limitantes identificaste hoy? ¿Cómo puedes sustituirlas por creencias empoderadoras?',
    'p.m{m}.d{d}.sobre.title': 'Ejercicio 4 - Sobrecarga Positiva',
    'p.m{m}.d{d}.sobre.desc': 'Engánchate en una actividad que exija foco total por 30 minutos. Esto puede ser un hobby, aprendizaje nuevo o cualquier cosa que ocupe tu mente completamente.',
    'p.m{m}.d{d}.quebra.title': 'Ejercicio 5 - Ruptura de Patrón',
    'p.m{m}.d{d}.quebra.desc': 'Haz algo diferente hoy. Un nuevo camino, un nuevo lugar, una nueva conversación. Nuevas experiencias crean nuevas conexiones neurales y perspectivas.',
"""

# Template for EN content
def en_content(m, d):
    return f"""
    // M{m}D{d}
    'p.m{m}.d{d}.reading1.title': 'Reading 1 - Foundations of Day {d}',
    'p.m{m}.d{d}.reading1.desc': 'Deep content about personal transformation, character development, and emotional growth. This material was created to help you become the best man you can be.',
    'p.m{m}.d{d}.reading2.title': 'Reading 2 - Applied Psychology',
    'p.m{m}.d{d}.reading2.desc': 'Understand the psychological mechanisms behind relationship dynamics and how you can use this knowledge to create deeper and more meaningful connections.',
    'p.m{m}.d{d}.reading3.title': 'Reading 3 - Real Case Study',
    'p.m{m}.d{d}.reading3.desc': 'Analysis of real situations where men like you transformed their lives and relationships through self-knowledge and application of these principles.',
    'p.m{m}.d{d}.caso.title': 'Applicable Case Study',
    'p.m{m}.d{d}.caso.desc': 'Practical scenario based on real stories of men who faced challenges similar to yours and emerged stronger, more confident, and more capable.',
    'p.m{m}.d{d}.quiz.title': 'Retention Quiz',
    'p.m{m}.d{d}.quiz.desc': 'Test your knowledge about the concepts learned today and see how you can apply them immediately in your transformation journey.',
    'p.m{m}.d{d}.mission1.title': 'Mission 1 - Strategic Action',
    'p.m{m}.d{d}.mission1.desc': '[ ] Complete the first task of the day\n[ ] Keep focus on your growth\n[ ] Document your progress',
    'p.m{m}.d{d}.mission2.title': 'Mission 2 - Personal Development',
    'p.m{m}.d{d}.mission2.desc': '[ ] Practice a new skill\n[ ] Step out of your comfort zone\n[ ] Celebrate small victories',
    'p.m{m}.d{d}.mission3.title': 'Mission 3 - Consolidation',
    'p.m{m}.d{d}.mission3.desc': 'Reflect on the day and write three important learnings that you can carry with you forever.',
    'p.m{m}.d{d}.rules.title': 'Engagement Rules - Day {d}',
    'p.m{m}.d{d}.rules.desc': 'Maintain the protocol. If she contacts you: wait before responding, be brief, keep emotion zero. Your power is in your strategic absence.',
    'p.m{m}.d{d}.bio1.title': 'Exercise 1 - Breathing and Calm',
    'p.m{m}.d{d}.bio1.desc': 'Practice deep breathing for 5 minutes. Inhale for 4s, hold for 4s, exhale for 6s. This activates the parasympathetic nervous system and reduces anxiety.',
    'p.m{m}.d{d}.bio2.title': 'Exercise 2 - Physical Movement',
    'p.m{m}.d{d}.bio2.desc': 'Do physical activity for 20 minutes. It can be walking, running, weight training, or any movement that makes your body feel alive and strong.',
    'p.m{m}.d{d}.restr.title': 'Exercise 3 - Cognitive Restructuring',
    'p.m{m}.d{d}.restr.desc': 'Write in your journal: what limiting beliefs did you identify today? How can you replace them with empowering beliefs?',
    'p.m{m}.d{d}.sobre.title': 'Exercise 4 - Positive Overload',
    'p.m{m}.d{d}.sobre.desc': 'Engage in an activity that requires total focus for 30 minutes. This can be a hobby, new learning, or anything that occupies your mind completely.',
    'p.m{m}.d{d}.quebra.title': 'Exercise 5 - Pattern Break',
    'p.m{m}.d{d}.quebra.desc': 'Do something different today. A new path, a new place, a new conversation. New experiences create new neural connections and perspectives.',
"""

with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'r') as f:
    content = f.read()

# Add ES content
for m in range(1, 6):
    for d in range(1, 8):
        if m == 5 and d > 7:
            break
        marker = f"es: {{" if d == 1 else f"'p.m{m}.d{d-1}.quebra.desc':"
        if f"'p.m{m}.d{d}.reading1.title'" not in content:
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if f"p.m{m}.d{d-1}.quebra.desc" in line and "es:" not in line:
                    lines.insert(i+1, es_content(m, d))
                    content = '\n'.join(lines)
                    break

with open('/Users/petterson/neuro-reconquista-v2/src/data/i18n.ts', 'w') as f:
    f.write(content)

print("ES content added!")
