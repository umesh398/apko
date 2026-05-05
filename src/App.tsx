/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StorageProvider } from './context/StorageContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { ReadingView } from './pages/ReadingView';
import { ExpenseView } from './pages/ExpenseView';
import { StudyView } from './pages/StudyView';
import { NotesView } from './pages/NotesView';
import { WorkoutView } from './pages/WorkoutView';

export default function App() {
  return (
    <StorageProvider>
      <Router>
        <div className="mobile-container pb-20">
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/read" element={<ReadingView />} />
              <Route path="/expenses" element={<ExpenseView />} />
              <Route path="/study" element={<StudyView />} />
              <Route path="/notes" element={<NotesView />} />
              <Route path="/workout" element={<WorkoutView />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
    </StorageProvider>
  );
}


