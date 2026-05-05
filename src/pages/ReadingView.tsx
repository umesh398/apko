import React, { useState } from 'react';
import { Search, Book as BookIcon, Highlighter as HighlightIcon, Bookmark, ChevronRight, Globe, ScrollText } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Highlight } from '../types';
import { cn } from '../lib/utils';

const PHILOSOPHY_COLLECTION: Book[] = [
  {
    id: 'phil-1',
    title: 'Meditations',
    authors: ['Marcus Aurelius'],
    description: 'A series of personal writings by the Roman Emperor, recording his private notes to himself and ideas on Stoic philosophy.',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
    category: 'Philosophy',
    philosophical: true
  },
  {
    id: 'phil-2',
    title: 'Tao Te Ching',
    authors: ['Lao Tzu'],
    description: 'Fundamental text for both philosophical and religious Taoism, focusing on the Way (Tao).',
    thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=200',
    category: 'Philosophy',
    philosophical: true
  },
  {
    id: 'phil-3',
    title: 'The Bhagavad Gita',
    authors: ['Vyasa'],
    description: 'A 700-verse Hindu scripture that is part of the epic Mahabharata, exploring karma and duty.',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200',
    category: 'Philosophy',
    philosophical: true
  }
];

export const ReadingView = () => {
  const { highlights, addHighlight } = useStorage();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
      const data = await response.json();
      const items = data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        description: item.volumeInfo.description,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
        category: item.volumeInfo.categories?.[0] || 'Uncategorized'
      })) || [];
      setSearchResults(items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHighlight = (text: string) => {
    if (!selectedBook) return;
    addHighlight({
      id: Math.random().toString(),
      bookId: selectedBook.id,
      text,
      note: '',
      timestamp: Date.now()
    });
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Library</h1>
        <p className="text-brand-muted text-sm uppercase tracking-widest text-[10px] font-bold">Knowledge Repository</p>
      </header>

      <div className="relative mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
          placeholder="Search repository..." 
          className="input-sovereign pl-12" 
        />
        <Search className="absolute left-4 top-4 text-slate-500" size={20} />
      </div>

      {searchResults.length > 0 && (
        <section className="mb-8">
          <h2 className="label-micro mb-4">Results</h2>
          <div className="space-y-4">
            {searchResults.map(book => (
              <div 
                key={book.id} 
                onClick={() => setSelectedBook(book)}
                className="flex gap-4 p-3 bg-brand-surface rounded-2xl border border-brand-border shadow-sm active:scale-95 transition-all cursor-pointer group"
              >
                <img src={book.thumbnail} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-lg group-hover:brightness-110 transition-all" />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-sm text-white truncate">{book.title}</h3>
                  <p className="text-xs text-brand-muted truncate">{book.authors.join(', ')}</p>
                  <p className="text-[10px] mt-2 text-indigo-400 font-bold uppercase tracking-wider">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="text-indigo-400" size={18} />
          <h2 className="label-micro">Philosophical Gems</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {PHILOSOPHY_COLLECTION.map(book => (
            <div 
              key={book.id} 
              onClick={() => setSelectedBook(book)}
              className="flex-shrink-0 w-32 group"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-2 shadow-xl group-active:scale-95 transition-transform border border-brand-border">
                <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition-colors" />
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-indigo-600 rounded-full overflow-hidden">
                   <div className="h-full bg-white/40 w-1/3" />
                </div>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{book.title}</h3>
              <p className="text-[10px] text-brand-muted">{book.authors[0]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="text-indigo-400" size={18} />
          <h2 className="label-micro">Neural Snapshots</h2>
        </div>
        <div className="space-y-4">
          {highlights.slice(0, 3).map(h => (
            <div key={h.id} className="p-4 bg-brand-surface rounded-2xl border-l-[3px] border-indigo-500 italic text-xs text-brand-text leading-relaxed">
              "{h.text}"
            </div>
          ))}
          {highlights.length === 0 && <p className="text-xs text-brand-muted italic opacity-50 px-2">System awaiting input. Highlight to persist knowledge.</p>}
        </div>
      </section>

      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-brand-bg z-[70] p-6 pb-24 overflow-y-auto"
          >
            <button onClick={() => setSelectedBook(null)} className="mb-6 p-2 bg-brand-surface border border-brand-border rounded-full text-white">
              <ChevronRight className="rotate-180" />
            </button>
            <div className="flex gap-6 mb-8">
              <img src={selectedBook.thumbnail} alt="" className="w-32 h-48 object-cover rounded-2xl shadow-2xl border border-brand-border" />
              <div className="pt-4">
                <h2 className="text-2xl font-bold leading-tight text-white">{selectedBook.title}</h2>
                <p className="text-brand-muted mb-4 text-sm">{selectedBook.authors.join(', ')}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-widest border border-indigo-500/30">
                    {selectedBook.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-black/40 border border-brand-border rounded-2xl">
                <h4 className="label-micro mb-3 flex items-center gap-2">
                  <Globe size={12} className="text-indigo-400" /> Abstract
                </h4>
                <p className="text-sm leading-relaxed text-brand-text/80">{selectedBook.description || "System data unavailable."}</p>
              </div>

              <div className="space-y-4">
                <h4 className="label-micro text-indigo-400">Memory Actions</h4>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => handleHighlight("Insightful reflection on virtue and duty.")} className="p-4 bg-brand-surface border border-brand-border rounded-2xl text-xs font-bold text-white uppercase tracking-tighter hover:bg-brand-accent transition-colors">Capture Reflection</button>
                  <button onClick={() => handleHighlight("Key concept regarding personal growth.")} className="p-4 bg-brand-surface border border-brand-border rounded-2xl text-xs font-bold text-white uppercase tracking-tighter hover:bg-brand-accent transition-colors">Neural Bookmark</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
