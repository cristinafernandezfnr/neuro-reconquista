export interface AnamneseQuestion {
  id: number
  options: { label: string; points: number }[]
  alertKey?: string
}

export const QUESTIONS: AnamneseQuestion[] = [
  {
    id: 1,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 4 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 2,
    options: [
      { label: 'A', points: 8 },
      { label: 'B', points: 10 },
      { label: 'C', points: 6 },
      { label: 'D', points: 3 },
    ],
  },
  {
    id: 3,
    options: [
      { label: 'A', points: 5 },
      { label: 'B', points: 7 },
      { label: 'C', points: 3 },
      { label: 'D', points: 2 },
    ],
  },
  {
    id: 4,
    options: [
      { label: 'A', points: 0 },
      { label: 'B', points: 2 },
      { label: 'C', points: 10 },
      { label: 'D', points: 4 },
    ],
  },
  {
    id: 5,
    alertKey: 'anamnese.q5.alert',
    options: [
      { label: 'A', points: 0 },
      { label: 'B', points: 1 },
      { label: 'C', points: 2 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 6,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 3 },
      { label: 'C', points: 6 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 7,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 5 },
      { label: 'C', points: 8 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 8,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 4 },
      { label: 'C', points: 5 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 9,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 5 },
      { label: 'C', points: 8 },
      { label: 'D', points: 6 },
    ],
  },
  {
    id: 10,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 5 },
      { label: 'C', points: 8 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 11,
    options: [
      { label: 'A', points: 5 },
      { label: 'B', points: 6 },
      { label: 'C', points: 8 },
      { label: 'D', points: 7 },
    ],
  },
  {
    id: 12,
    options: [
      { label: 'A', points: 4 },
      { label: 'B', points: 5 },
      { label: 'C', points: 7 },
      { label: 'D', points: 6 },
    ],
  },
  {
    id: 13,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 4 },
      { label: 'C', points: 5 },
      { label: 'D', points: 8 },
    ],
  },
  {
    id: 14,
    options: [
      { label: 'A', points: 3 },
      { label: 'B', points: 6 },
      { label: 'C', points: 7 },
      { label: 'D', points: 8 },
    ],
  },
  {
    id: 15,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 5 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 16,
    options: [
      { label: 'A', points: 5 },
      { label: 'B', points: 8 },
      { label: 'C', points: 2 },
      { label: 'D', points: 6 },
    ],
  },
  {
    id: 17,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 5 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 18,
    options: [
      { label: 'A', points: 4 },
      { label: 'B', points: 6 },
      { label: 'C', points: 7 },
      { label: 'D', points: 5 },
    ],
  },
  {
    id: 19,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 5 },
      { label: 'C', points: 8 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 20,
    options: [
      { label: 'A', points: 6 },
      { label: 'B', points: 8 },
      { label: 'C', points: 4 },
      { label: 'D', points: 1 },
    ],
  },
  {
    id: 21,
    options: [
      { label: 'A', points: 0 },
      { label: 'B', points: 5 },
      { label: 'C', points: 8 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 22,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 5 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 23,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 6 },
      { label: 'C', points: 8 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 24,
    options: [
      { label: 'A', points: 4 },
      { label: 'B', points: 5 },
      { label: 'C', points: 6 },
      { label: 'D', points: 4 },
    ],
  },
  {
    id: 25,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 4 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 26,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 4 },
      { label: 'C', points: 7 },
      { label: 'D', points: 9 },
    ],
  },
  {
    id: 27,
    options: [
      { label: 'A', points: 4 },
      { label: 'B', points: 3 },
      { label: 'C', points: 7 },
      { label: 'D', points: 9 },
    ],
  },
  {
    id: 28,
    options: [
      { label: 'A', points: 2 },
      { label: 'B', points: 5 },
      { label: 'C', points: 7 },
      { label: 'D', points: 9 },
    ],
  },
  {
    id: 29,
    options: [
      { label: 'A', points: 0 },
      { label: 'B', points: 4 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
  {
    id: 30,
    options: [
      { label: 'A', points: 1 },
      { label: 'B', points: 4 },
      { label: 'C', points: 7 },
      { label: 'D', points: 10 },
    ],
  },
]

export const computeScore = (answers: Record<number, string>): number => {
  return QUESTIONS.reduce((total, q) => {
    const answer = answers[q.id]
    const option = q.options.find(o => o.label === answer)
    return total + (option?.points || 0)
  }, 0)
}

export const getLevelFromScore = (score: number): 1 | 2 | 3 | 4 => {
  if (score <= 70) return 1
  if (score <= 120) return 2
  if (score <= 170) return 3
  return 4
}

export const LEVEL_DATA: Record<1 | 2 | 3 | 4, { color: string; reconnectWeek: number }> = {
  1: { color: '#e0a020', reconnectWeek: 4 },
  2: { color: '#7c6ef5', reconnectWeek: 4 },
  3: { color: '#4ecb8a', reconnectWeek: 3 },
  4: { color: '#c8102e', reconnectWeek: 3 },
}
