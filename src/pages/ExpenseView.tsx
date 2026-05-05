import React, { useState } from 'react';
import { Plus, Receipt, Trash2, PieChart, ChevronRight } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfMonth, isSameMonth } from 'date-fns';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

export const ExpenseView = () => {
  const { bills, addBill, deleteBill } = useStorage();
  const [isAdding, setIsAdding] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', items: [{ name: '', price: '' }] });

  const totalSpentThisMonth = bills
    .filter(b => isSameMonth(new Date(b.date), new Date()))
    .reduce((acc, b) => acc + b.items.reduce((sum, i) => sum + i.price, 0), 0);

  const handleAddBill = () => {
    if (!newBill.name) return;
    const items = newBill.items
      .filter(i => i.name && i.price)
      .map(i => ({ id: Math.random().toString(), name: i.name, price: parseFloat(i.price) }));
    
    addBill({
      id: Math.random().toString(),
      name: newBill.name,
      items,
      date: new Date().toISOString()
    });
    setNewBill({ name: '', items: [{ name: '', price: '' }] });
    setIsAdding(false);
  };

  const COLORS = ['#101010', '#33d2ff', '#94A3B8', '#E2E8F0'];

  const categoryData = bills
    .filter(b => isSameMonth(new Date(b.date), new Date()))
    .map(b => ({
      name: b.name,
      value: b.items.reduce((acc, i) => acc + i.price, 0)
    }));

  return (
    <div className="p-6 pb-24">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Audit</h1>
          <p className="label-micro text-amber-500">Resource Monitoring</p>
        </div>
        <div className="text-right">
          <p className="label-micro">Total Monthly</p>
          <p className="text-2xl font-mono font-bold text-white">${totalSpentThisMonth.toFixed(2)}</p>
        </div>
      </header>

      {categoryData.length > 0 && (
        <div className="card-high-density mb-8 flex items-center bg-black/40">
          <div className="w-1/2 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-4 space-y-2">
            {categoryData.slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] font-bold text-white truncate max-w-[80px] uppercase tracking-wider">{d.name}</span>
                <span className="text-[10px] ml-auto text-brand-muted font-mono">${d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsAdding(true)}
        className="w-full py-4 mb-8 bg-brand-accent text-white rounded-2xl font-bold border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        <Plus size={20} /> Register Expense
      </button>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="card-high-density group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-widest">{bill.name}</h3>
                <p className="text-[10px] text-brand-muted">{format(new Date(bill.date), 'MMM d, h:mm a')}</p>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-mono font-bold text-amber-500">${bill.items.reduce((acc, i) => acc + i.price, 0).toFixed(2)}</span>
                <button onClick={() => deleteBill(bill.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2 border-t border-brand-border pt-3">
              {bill.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-brand-muted font-medium">
                  <span>{item.name}</span>
                  <span className="text-brand-text font-mono">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-brand-bg p-6 pb-24 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">New Transaction</h2>
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-brand-surface border border-brand-border rounded-xl font-bold text-sm text-brand-muted">Cancel</button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="label-micro block mb-3">Category Allocation</label>
                <input 
                  type="text" 
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  placeholder="e.g. Biological Input" 
                  className="input-sovereign" 
                />
              </div>

              <div>
                <label className="label-micro block mb-3">Line Items</label>
                <div className="space-y-3">
                  {newBill.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Description"
                        value={item.name}
                        onChange={(e) => {
                          const items = [...newBill.items];
                          items[idx].name = e.target.value;
                          setNewBill({ ...newBill, items });
                        }}
                        className="flex-1 p-3 bg-black/40 border border-brand-border rounded-xl text-xs text-white outline-none" 
                      />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => {
                          const items = [...newBill.items];
                          items[idx].price = e.target.value;
                          setNewBill({ ...newBill, items });
                        }}
                        className="w-24 p-3 bg-black/40 border border-brand-border rounded-xl text-xs text-white text-right font-mono outline-none" 
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setNewBill({ ...newBill, items: [...newBill.items, { name: '', price: '' }] })}
                    className="flex items-center gap-2 text-[10px] font-bold text-brand-accent px-2 mt-2 uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddBill}
                className="w-full py-4 bg-brand-accent text-white rounded-2xl font-bold mt-8 shadow-xl shadow-brand-accent/20 border-b-4 border-indigo-800"
              >
                Execute Transaction
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
