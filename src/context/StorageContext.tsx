import React, { createContext, useContext, useEffect, useState } from 'react';
import { Bill, Book, Highlight, Note, StudySession, WorkoutSplit } from '../types';

interface StorageContextType {
  books: Book[];
  highlights: Highlight[];
  bills: Bill[];
  sessions: StudySession[];
  notes: Note[];
  workouts: WorkoutSplit[];
  
  addBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  addSession: (session: StudySession) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addWorkout: (workout: WorkoutSplit) => void;
  deleteWorkout: (id: string) => void;
  addHighlight: (highlight: Highlight) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSplit[]>([]);

  // Load from localStorage
  useEffect(() => {
    const data = {
      books: localStorage.getItem('lumina_books'),
      highlights: localStorage.getItem('lumina_highlights'),
      bills: localStorage.getItem('lumina_bills'),
      sessions: localStorage.getItem('lumina_sessions'),
      notes: localStorage.getItem('lumina_notes'),
      workouts: localStorage.getItem('lumina_workouts'),
    };

    if (data.books) setBooks(JSON.parse(data.books));
    if (data.highlights) setHighlights(JSON.parse(data.highlights));
    if (data.bills) setBills(JSON.parse(data.bills));
    if (data.sessions) setSessions(JSON.parse(data.sessions));
    if (data.notes) setNotes(JSON.parse(data.notes));
    if (data.workouts) setWorkouts(JSON.parse(data.workouts));
  }, []);

  // Save to localStorage helpers
  useEffect(() => localStorage.setItem('lumina_bills', JSON.stringify(bills)), [bills]);
  useEffect(() => localStorage.setItem('lumina_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('lumina_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('lumina_workouts', JSON.stringify(workouts)), [workouts]);
  useEffect(() => localStorage.setItem('lumina_highlights', JSON.stringify(highlights)), [highlights]);

  const addBill = (bill: Bill) => setBills(prev => [bill, ...prev]);
  const deleteBill = (id: string) => setBills(prev => prev.filter(b => b.id !== id));
  
  const addSession = (session: StudySession) => setSessions(prev => [session, ...prev]);
  
  const addNote = (note: Note) => setNotes(prev => [note, ...prev]);
  const updateNote = (note: Note) => setNotes(prev => prev.map(n => n.id === note.id ? note : n));
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));
  
  const addWorkout = (workout: WorkoutSplit) => setWorkouts(prev => [workout, ...prev]);
  const deleteWorkout = (id: string) => setWorkouts(prev => prev.filter(w => w.id !== id));
  
  const addHighlight = (highlight: Highlight) => setHighlights(prev => [highlight, ...prev]);

  return (
    <StorageContext.Provider value={{
      books, highlights, bills, sessions, notes, workouts,
      addBill, deleteBill, addSession, addNote, updateNote, deleteNote, addWorkout, deleteWorkout, addHighlight
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error('useStorage must be used within StorageProvider');
  return context;
};
