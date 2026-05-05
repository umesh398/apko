import React from 'react';
import { motion } from 'motion/react';
import { useStorage } from '../context/StorageContext';
import { Activity, Clock, Wallet, BookOpen, Quote } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const Dashboard = () => {
  const { sessions, bills, notes, workouts } = useStorage();

  const today = new Date().getDay();
  const todayWorkout = workouts.find(w => w.days.includes(today));
  
  const totalFocusToday = sessions
    .filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.duration, 0);

  const totalSpentThisMonth = bills
    .filter(b => new Date(b.date).getMonth() === new Date().getMonth())
    .reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.price, 0), 0);

  return (
    <div className="p-6 pb-24 flex flex-col gap-6">
      <header className="mb-2">
        <p className="label-micro text-brand-accent mb-1 tracking-[0.2em]">System Online</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Sovereign System</h1>
        <p className="text-brand-muted text-sm">{format(new Date(), 'EEEE, MMMM do')}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="card-high-density"
        >
          <div className="p-2 w-fit bg-indigo-500/10 text-indigo-400 rounded-xl mb-3 border border-indigo-500/20">
            <Clock size={20} />
          </div>
          <p className="label-micro">FocusTime</p>
          <p className="text-2xl font-mono font-bold text-white">{Math.floor(totalFocusToday/60)}m</p>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="card-high-density"
        >
          <div className="p-2 w-fit bg-amber-500/10 text-amber-500 rounded-xl mb-3 border border-amber-500/20">
            <Wallet size={20} />
          </div>
          <p className="label-micro">Burn Rate</p>
          <p className="text-2xl font-mono font-bold text-white">${totalSpentThisMonth.toFixed(0)}</p>
        </motion.div>
      </div>

      <section className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 opacity-40 blur-[60px] rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-indigo-200" size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100/60">Current Directive</h3>
            </div>
            <div className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-indigo-100 font-bold uppercase">Active</div>
          </div>
          {todayWorkout ? (
            <div>
              <h4 className="text-2xl font-bold mb-1 text-white">{todayWorkout.name}</h4>
              <p className="text-sm text-indigo-100/70 mb-4">{todayWorkout.bodyParts.join(' • ')}</p>
              <div className="flex gap-2">
                {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex-1 py-2 px-3 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-bold text-white border border-white/5 truncate">{ex.name}</div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-2xl font-bold mb-1 text-white">Neural Recovery</h4>
              <p className="text-sm text-indigo-100/70">Rest day prioritized. Focus on reading and study.</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-brand-surface p-6 rounded-[2rem] border border-brand-border shadow-sm relative group overflow-hidden">
        <Quote className="absolute top-6 right-6 text-indigo-500/5 group-hover:scale-110 transition-transform" size={80} />
        <h4 className="label-micro mb-4 flex items-center gap-2 text-indigo-400">
          <BookOpen size={14} /> Philosophy Sync
        </h4>
        <p className="text-lg font-serif italic text-brand-text leading-relaxed relative z-10">
          "The universe is change; life is what our thoughts make of it."
        </p>
        <p className="label-micro mt-4 text-brand-muted">— Marcus Aurelius</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-brand-surface border border-brand-border rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Active Mentals: {notes.filter(n => !n.completed).length}</span>
        </div>
        <button className="text-[10px] font-bold text-brand-accent underline underline-offset-4 decoration-border-brand-accent/30">Optimize System</button>
      </div>
    </div>
  );
};
