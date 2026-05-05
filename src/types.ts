export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  category: string;
  philosophical?: boolean;
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  note: string;
  timestamp: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  price: number;
}

export interface Bill {
  id: string;
  name: string;
  items: ExpenseItem[];
  date: string;
}

export interface StudySession {
  id: string;
  duration: number; // in seconds
  timestamp: number;
  subject?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isTodo: boolean;
  completed: boolean;
  createdAt: number;
}

export interface Exercise {
  id: string;
  name: string;
}

export interface WorkoutSplit {
  id: string;
  name: string;
  days: number[]; // 0-6 (Sun-Sat)
  bodyParts: string[];
  exercises: Exercise[];
}
