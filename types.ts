
export enum StudyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate'
}

export enum StudyMode {
  EXPLAIN = 'Explain',
  SUMMARY = 'Summary',
  QUIZ = 'Quiz'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyResult {
  content: string;
  quiz?: QuizQuestion[];
  mode: StudyMode;
  topic: string;
}
