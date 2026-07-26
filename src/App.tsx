/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import QuizGenerator from './pages/QuizGenerator';
import Flashcards from './pages/Flashcards';
import StudyTools from './pages/StudyTools';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-[#050508] text-slate-900 dark:text-gray-200 transition-colors duration-300 font-sans">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/quiz" element={<QuizGenerator />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/tools" element={<StudyTools />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
