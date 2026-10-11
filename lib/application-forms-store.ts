'use client'

export type ApplicationQuestion = {
  id: string
  label: string
  placeholder?: string
  required: boolean
}

const STORAGE_KEY = 'avio-application-questions'

export const defaultApplicationQuestions: ApplicationQuestion[] = [
  { id: 'ideal-candidate', label: 'Why are you the ideal candidate for the position of [role]?', placeholder: 'Explain why you are the ideal candidate.', required: true },
  { id: 'role-qualities', label: 'What qualities do you have that align with those for [role]?', placeholder: 'Describe the qualities and skills you bring.', required: true },
  { id: 'avio-fit', label: 'Why are you the ideal fit for avio group?', placeholder: 'Tell us what makes you a strong fit for avio group.', required: true },
  { id: 'scenario', label: 'How would you handle a difficult passenger or situation?', placeholder: 'Describe how you would handle a challenging scenario.', required: false },
]

function readStore(): Record<string, ApplicationQuestion[]> {
  if (typeof window === 'undefined') return {}
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export function getApplicationQuestions(jobId: string): ApplicationQuestion[] {
  return readStore()[jobId] ?? defaultApplicationQuestions
}

export function saveApplicationQuestions(jobId: string, questions: ApplicationQuestion[]) {
  const store = readStore()
  store[jobId] = questions
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function resetApplicationQuestions(jobId: string) {
  const store = readStore()
  delete store[jobId]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function questionLabel(question: ApplicationQuestion, role: string) {
  return question.label.replaceAll('[role]', role)
}
