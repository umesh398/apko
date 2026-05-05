import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, StickyNote, SquareCheck } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export const NotesView = () => {
  const { notes, addNote, updateNote, deleteNote } = useStorage();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState({ title: '', content: '', isTodo: false });

  const handleSave = () => {
    if (!editNote.title && !editNote.content) return;
    
    if (selectedNote) {
      updateNote({ ...selectedNote, ...editNote });
    } else {
      addNote({
        id: Math.random().toString(),
        ...editNote,
        completed: false,
        createdAt: Date.now()
      });
    }
    setIsAdding(false);
    setSelectedNote(null);
    setEditNote({ title: '', content: '', isTodo: false });
  };

  const openEdit = (note: Note) => {
    setSelectedNote(note);
    setEditNote({ title: note.title, content: note.content, isTodo: note.isTodo });
    setIsAdding(true);
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">External Brain</h1>
          <p className="label-micro text-indigo-400">Knowledge Hub</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-3 bg-brand-accent text-white rounded-xl shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {notes.length === 0 && (
          <div className="text-center py-20 card-high-density border-dashed bg-transparent">
            <StickyNote className="mx-auto text-slate-800 mb-4" size={40} />
            <p className="text-slate-600 italic text-xs tracking-tight">System awaiting input. Add your first mental object.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => openEdit(note)}
              className={cn(
                "card-high-density relative group active:scale-98 transition-all hover:bg-slate-900",
                note.completed && "opacity-40"
              )}
            >
              <div className="flex gap-3 mb-2">
                {note.isTodo && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote({ ...note, completed: !note.completed });
                    }}
                    className="text-indigo-400"
                  >
                    {note.completed ? <CheckCircle2 size={18} fill="currentColor" /> : <div className="w-[18px] h-[18px] border-2 border-indigo-500/50 rounded" />}
                  </button>
                )}
                <h3 className={cn("font-bold text-white truncate text-sm uppercase tracking-wider", note.completed && "line-through")}>
                  {note.title || (note.isTodo ? "Todo Action" : "Raw Insight")}
                </h3>
              </div>
              <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{note.content}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="absolute right-4 top-4 text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[80] bg-brand-bg p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">External Brain Sync</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditNote({ ...editNote, isTodo: !editNote.isTodo })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest",
                    editNote.isTodo ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-brand-surface text-slate-500 border border-brand-border"
                  )}
                >
                  <SquareCheck size={14} /> Protocol
                </button>
                <button onClick={() => { setIsAdding(false); setSelectedNote(null); }} className="px-4 py-2 bg-brand-surface border border-brand-border rounded-xl font-bold text-sm text-brand-muted">Back</button>
              </div>
            </div>

            <div className="flex-1 space-y-6 flex flex-col">
              <input 
                type="text" 
                value={editNote.title}
                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                placeholder="Topic..." 
                className="text-2xl font-bold border-none bg-transparent outline-none w-full text-white placeholder-slate-800" 
              />
              <textarea 
                value={editNote.content}
                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                placeholder="Synchronize thoughts (markdown supported)..." 
                className="flex-1 text-sm leading-relaxed text-brand-text border-none bg-transparent outline-none resize-none placeholder-slate-800 font-medium"
              />
              
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-brand-accent text-white rounded-2xl font-bold mt-auto mb-6 shadow-xl shadow-indigo-500/20 border-b-4 border-indigo-800"
              >
                Sync to Neural Network
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
