import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Loader2, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';

type Flashcard = {
  front: string;
  back: string;
};

export default function Flashcards() {
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateCards = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setCards(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const prompt = `Generate ${numCards} study flashcards about "${topic}". 
      Return ONLY a JSON array of objects with 'front' (the question/concept) and 'back' (the answer/definition).
      Example: [{"front": "What is Mitochondria?", "back": "The powerhouse of the cell."}]`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.body) throw new Error('No response');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                fullText += data.text;
              } catch(e) {}
            }
          }
        }
      }

      const jsonMatch = fullText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        setCards(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error('Failed to parse flashcard data');
      }

    } catch (error) {
      console.error(error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (cards && currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Flashcard Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Master concepts quickly with AI-generated flashcards.</p>
      </div>

      {!cards && (
        <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-white/10 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Topic to Study</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Spanish Vocabulary, Anatomy, State Capitals"
                className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Number of Cards</label>
              <select 
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={5}>5 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={15}>15 Cards</option>
                <option value={20}>20 Cards</option>
              </select>
            </div>

            <button
              onClick={generateCards}
              disabled={!topic.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl py-4 font-medium transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Cards...</>
              ) : (
                <><Layers className="w-5 h-5" /> Generate Flashcards</>
              )}
            </button>
          </div>
        </div>
      )}

      {cards && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-center text-sm font-medium text-slate-500">
            <button onClick={() => setCards(null)} className="hover:text-indigo-500">
              &larr; New Deck
            </button>
            <span>Card {currentIndex + 1} of {cards.length}</span>
          </div>

          <div className="perspective-1000 relative h-96 w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="w-full h-full preserve-3d relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front */}
              <div className={cn(
                "absolute inset-0 backface-hidden bg-white dark:bg-[#15151e] border-2 border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg",
                isFlipped ? "pointer-events-none" : ""
              )}>
                <div className="absolute top-6 text-sm text-slate-400 font-medium">FRONT</div>
                <h2 className="text-3xl font-bold">{cards[currentIndex].front}</h2>
                <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-sm">
                  <RotateCw className="w-4 h-4" /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div 
                className={cn(
                  "absolute inset-0 backface-hidden bg-indigo-50 dark:bg-[#15151e] border-2 border-indigo-200 dark:border-indigo-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg",
                  !isFlipped ? "pointer-events-none" : ""
                )}
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="absolute top-6 text-sm text-indigo-400 font-medium">BACK</div>
                <p className="text-2xl font-medium text-indigo-950 dark:text-indigo-300">{cards[currentIndex].back}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white transition-colors font-medium"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
