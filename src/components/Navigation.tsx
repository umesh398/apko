import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Receipt, Timer, Notebook, Dumbbell, Home } from 'lucide-react';
import { cn } from '../lib/utils';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300",
      isActive ? "text-brand-accent scale-110" : "text-brand-muted grayscale"
    )}
  >
    <Icon size={20} strokeWidth={2.5} />
    <span className="text-[10px] font-semibold mt-1 uppercase tracking-widest">{label}</span>
  </NavLink>
);

export const Navigation = () => {
  return (
    <nav className="nav-blur fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-50 max-w-md mx-auto">
      <NavItem to="/" icon={Home} label="Focus" />
      <NavItem to="/read" icon={Book} label="Library" />
      <NavItem to="/study" icon={Timer} label="Core" />
      <NavItem to="/expenses" icon={Receipt} label="Audit" />
      <NavItem to="/notes" icon={Notebook} label="Brain" />
      <NavItem to="/workout" icon={Dumbbell} label="Physical" />
    </nav>
  );
};
