import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, History, TrendingUp, Search } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../lib/utils';

export const StudyView = () => {
  const { sessions, addSession } = useStorage();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isActive]);

  const toggleTimer = () => {
    if (isActive) {
      // Stop and save
      addSession({
        id: Math.random().toString(36).substr(2, 9),
        duration: time,
        timestamp: Date.now()
      });
      setTime(0);
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Prepare chart data for last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const chartData = last7Days.map(date => {
    const daySessions = sessions.filter(s => {
      const sDate = new Date(s.timestamp);
      return sDate.getDate() === date.getDate() && 
             sDate.getMonth() === date.getMonth();
    });
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    return {
      name: format(date, 'eee'),
      minutes: Math.round(totalMinutes)
    };
  });

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Study Core</h1>
        <p className="label-micro text-emerald-400">Deep Work Protocol</p>
      </header>

      <div className="card-high-density p-8 mb-8 flex flex-col items-center bg-black/40">
        <div className="w-56 h-56 rounded-full border-[10px] border-brand-border flex items-center justify-center relative mb-8 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
          <div className="text-4xl font-mono font-bold text-white tracking-tighter">{formatTime(time)}</div>
          {isActive && (
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-[-10px] border-[10px] border-emerald-500 rounded-full"
            />
          )}
        </div>
        
        <button 
          onClick={toggleTimer}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all",
            isActive ? "bg-rose-900/30 text-rose-500 border border-rose-500/30" : "bg-brand-accent text-white shadow-lg shadow-indigo-500/20 border-b-4 border-indigo-800"
          )}
        >
          {isActive ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          {isActive ? "Terminate Session" : "Initiate Sequence"}
        </button>
      </div>

      <section className="mb-8 card-high-density">
        <div className="flex items-center gap-2 mb-6 label-micro text-indigo-400">
          <TrendingUp size={14} /> Weekly Velocity (Min)
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#4f46e5' : '#1e293b'} />
                ))}
              </Bar>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 border border-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl font-bold">
                      {payload[0].value}M
                    </div>
                  );
                }
                return null;
              }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <a 
          href="https://www.google.com/search?q=research+papers" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-4 bg-brand-surface border border-brand-border rounded-2xl flex flex-col gap-2 group hover:bg-brand-accent transition-colors"
        >
          <Search className="text-indigo-400 group-hover:text-white transition-colors" size={20} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Research Hub</span>
        </a>
        <div className="p-4 bg-brand-surface border border-brand-border rounded-2xl flex flex-col gap-2">
          <History className="text-indigo-400" size={20} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{sessions.length} Logs</span>
        </div>
      </div>
    </div>
  );
};
