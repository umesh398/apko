import React, { useState } from 'react';
import { Plus, Dumbbell, Calendar, ChevronRight, Activity, Zap, ClipboardList } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutSplit } from '../types';
import { cn } from '../lib/utils';

const BODY_PARTS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

export const WorkoutView = () => {
  const { workouts, addWorkout, deleteWorkout } = useStorage();
  const [isAdding, setIsAdding] = useState(false);
  const [newSplit, setNewSplit] = useState({ name: '', days: [] as number[], bodyParts: [] as string[], exercises: [] as string[] });

  const today = new Date().getDay();
  const tomorrow = (today + 1) % 7;

  const todayWorkouts = workouts.filter(w => w.days.includes(today));
  const tomorrowWorkouts = workouts.filter(w => w.days.includes(tomorrow));

  const handleAddSplit = () => {
    if (!newSplit.name) return;
    addWorkout({
      id: Math.random().toString(),
      name: newSplit.name,
      days: newSplit.days,
      bodyParts: newSplit.bodyParts,
      exercises: newSplit.exercises.map(e => ({ id: Math.random().toString(), name: e }))
    });
    setIsAdding(false);
    setNewSplit({ name: '', days: [], bodyParts: [], exercises: [] });
  };

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Physical Architect</h1>
        <p className="label-micro text-rose-500">Biological Evolution</p>
      </header>

      {/* Today Section */}
      <section className="mb-8 p-6 bg-rose-600 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-rose-200" size={18} fill="currentColor" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Today's Protocol</p>
            </div>
            <div className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold uppercase">Locked In</div>
          </div>
          {todayWorkouts.length > 0 ? (
            todayWorkouts.map(w => (
              <div key={w.id}>
                <h3 className="text-2xl font-bold mb-1">{w.name}</h3>
                <div className="flex gap-2 flex-wrap mb-4">
                  {w.bodyParts.map(p => (
                    <span key={p} className="text-[9px] font-bold px-2 py-0.5 bg-white/10 rounded-lg border border-white/10 uppercase tracking-tighter">{p}</span>
                  ))}
                </div>
                <div className="space-y-2 pb-2">
                  {w.exercises.map(ex => (
                    <div key={ex.id} className="flex items-center gap-3 text-sm font-medium bg-black/10 p-2 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 bg-rose-300 rounded-full shadow-[0_0_8px_rgba(253,164,175,0.6)]" />
                      {ex.name}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4">
              <h3 className="text-2xl font-bold mb-1">Neural Recovery</h3>
              <p className="text-sm text-white/50">Rest cycle active. Re-architecting muscle tissue.</p>
            </div>
          )}
        </div>
      </section>

      {/* Preview Section */}
      <section className="mb-8 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h4 className="label-micro">Next Evolution</h4>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{DAYS[tomorrow]} Protocol</span>
        </div>
        <div className="card-high-density flex items-center justify-between group hover:bg-slate-900 border-dashed">
          {tomorrowWorkouts.length > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Activity className="text-rose-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{tomorrowWorkouts[0].name}</p>
                  <p className="text-[10px] text-brand-muted">{tomorrowWorkouts[0].bodyParts.join(' • ')}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-700" />
            </>
          ) : (
            <div className="w-full flex justify-between items-center text-slate-700 text-xs font-bold uppercase tracking-widest">
               <span>Recovery incoming</span>
               <Calendar size={18} />
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-6 border border-brand-border bg-brand-surface rounded-3xl flex items-center justify-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs hover:border-indigo-500 transition-all shadow-xl shadow-indigo-500/5 active:scale-98"
        >
          <Plus size={20} /> Design Split Protocol
        </button>

        {workouts.map(w => (
          <div key={w.id} className="card-high-density group">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">{w.name}</h4>
              <button onClick={() => deleteWorkout(w.id)} className="text-slate-800 hover:text-rose-500 transition-colors">
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
            <div className="flex gap-1 flex-wrap mb-4">
              {w.days.map(d => (
                <span key={d} className="px-2 py-0.5 bg-black/40 text-[9px] font-bold text-indigo-400 rounded-md border border-brand-border uppercase">{DAYS[d]}</span>
              ))}
            </div>
            <p className="label-micro text-slate-600 mb-2">Targeting</p>
            <div className="flex flex-wrap gap-1">
               {w.bodyParts.map(p => <span key={p} className="text-[9px] font-medium text-brand-muted bg-brand-border/30 px-2 py-0.5 rounded uppercase tracking-tighter">{p}</span>)}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[90] bg-brand-bg p-6 pb-24 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">System Architect</h2>
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-brand-surface border border-brand-border rounded-xl font-bold text-sm text-brand-muted">Abort</button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="label-micro block mb-3 text-indigo-400">Protocol Designation</label>
                <input 
                  type="text" 
                  value={newSplit.name}
                  onChange={(e) => setNewSplit({...newSplit, name: e.target.value})}
                  placeholder="e.g. Hypertrophy A" 
                  className="input-sovereign" 
                />
              </div>

              <div>
                <label className="label-micro block mb-3 text-indigo-400">Temporal Schedule</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, i) => (
                    <button 
                      key={day}
                      onClick={() => {
                        const days = newSplit.days.includes(i) ? newSplit.days.filter(d => d !== i) : [...newSplit.days, i];
                        setNewSplit({...newSplit, days});
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xs font-bold transition-all border",
                        newSplit.days.includes(i) ? "bg-indigo-600 border-indigo-400 text-white" : "bg-brand-surface border-brand-border text-slate-600"
                      )}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-micro block mb-3 text-indigo-400">Biological Focus</label>
                <div className="flex gap-2 flex-wrap">
                  {BODY_PARTS.map(part => (
                    <button 
                      key={part}
                      onClick={() => {
                        const parts = newSplit.bodyParts.includes(part) ? newSplit.bodyParts.filter(p => p !== part) : [...newSplit.bodyParts, part];
                        setNewSplit({...newSplit, bodyParts: parts});
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                        newSplit.bodyParts.includes(part) ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-black/20 border-brand-border text-slate-600 border"
                      )}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-brand-surface border border-brand-border rounded-3xl">
                <label className="label-micro block mb-4 text-white">Movement List</label>
                <div className="space-y-2">
                  {newSplit.exercises.map((ex, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        type="text" 
                        value={ex}
                        onChange={(e) => {
                          const exes = [...newSplit.exercises];
                          exes[i] = e.target.value;
                          setNewSplit({...newSplit, exercises: exes});
                        }}
                        className="flex-1 p-3 bg-black/40 border border-brand-border rounded-xl text-xs text-white outline-none" 
                        placeholder={`Movement ${i+1}`}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setNewSplit({...newSplit, exercises: [...newSplit.exercises, '']})}
                    className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 px-2 mt-4 uppercase tracking-[0.2em]"
                  >
                    <Plus size={14} /> Add Movement
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddSplit}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/10 border-b-4 border-indigo-800"
              >
                Sync Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
