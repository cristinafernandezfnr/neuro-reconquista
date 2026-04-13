// ── Expanded Protocol Types ───────────────────────────────────────────────
// High-density task system: Module > Day > Subtopic > Exercise

export type ExerciseType =
  | 'behavioral_action'      // do something physically
  | 'reflection'             // think/analyze
  | 'breathing'              // breathwork technique
  | 'journaling'             // write in journal
  | 'emotional_regulation'   // emotion management technique
  | 'social_behavior'        // social interaction adjustment
  | 'reconquest_strategy'    // specific reconquest tactic
  | 'mindset_reprogramming'  // thought pattern change
  | 'visualization'          // guided mental imagery
  | 'physical_exercise'      // body movement
  | 'digital_detox'          // tech / social media action
  | 'affirmation'            // repeat / write affirmations
  | 'self_analysis'          // analyze own patterns
  | 'commitment'             // make a binding commitment
  | 'challenge'              // push beyond comfort zone
  | 'cold_exposure'          // cold shower / ice
  | 'meditation'             // seated mindfulness

export type SubtopicType =
  | 'psychological_understanding'  // why this works (theory)
  | 'emotional_control'            // regulation techniques
  | 'behavioral_exercises'         // habit / action training
  | 'reconquest_actions'           // concrete reconquest steps
  | 'structured_reflection'        // guided journaling / analysis
  | 'mindset_reprogramming'        // belief / identity work

export interface Exercise {
  id: string
  type: ExerciseType
  title: string
  description: string
  durationMinutes: number
  difficulty: 1 | 2 | 3  // 1=easy, 2=medium, 3=hard
}

export interface Subtopic {
  id: string
  type: SubtopicType
  title: string
  objective: string
  exercises: Exercise[]
}

export interface ExpandedDay {
  day: number
  module: number
  title: string
  theme: string            // one-line framing of the day
  subtopics: Subtopic[]
}

export interface ExpandedModule {
  module: number
  title: string
  goal: string
  duration: string         // "Dias 1–7"
  days: ExpandedDay[]
}
