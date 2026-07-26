import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});

    try {
      const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with ${numQuestions} multiple choice questions. 
      Return ONLY a JSON array of objects with the following structure:
      [{
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // index of correct option
        "explanation": "Explanation of the correct answer."
      }]`;

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

      // Parse JSON from text
      const jsonMatch = fullText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        setQuiz(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error('Failed to parse quiz data');
      }

    } catch (error) {
      console.error(error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const currentQuestion = quiz?.[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== undefined;
  
  const calculateScore = () => {
    if (!quiz) return 0;
    return Object.entries(selectedAnswers).reduce((score, [qIndex, aIndex]) => {
      return score + (quiz[Number(qIndex)].correctAnswer === aIndex ? 1 : 0);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Instantly test your knowledge on any topic.</p>
      </div>

      {!quiz && (
        <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-white/10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. World War II, React Hooks, Quantum Physics"
                className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Questions</label>
                <select 
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateQuiz}
              disabled={!topic.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl py-4 font-medium transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Quiz...</>
              ) : (
                <><BrainCircuit className="w-5 h-5" /> Generate Quiz</>
              )}
            </button>
          </div>
        </div>
      )}

      {quiz && currentQuestion && !showResults && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-white/10"
        >
          <div className="flex justify-between items-center mb-6 text-sm font-medium text-slate-500">
            <span>Question {currentQuestionIndex + 1} of {quiz.length}</span>
            <span>{difficulty} Difficulty</span>
          </div>
          
          <h2 className="text-xl font-bold mb-8">{currentQuestion.question}</h2>
          
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-xl border transition-all",
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                    : "border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50"
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setQuiz(null)}
              className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                if (currentQuestionIndex < quiz.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  setShowResults(true);
                }
              }}
              disabled={!hasAnsweredCurrent}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
            >
              {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        </motion.div>
      )}

      {quiz && showResults && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-white/10"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-3xl font-bold mb-4">
              {calculateScore()} / {quiz.length}
            </div>
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-slate-500">Here's how you did on "{topic}"</p>
          </div>

          <div className="space-y-6 mb-8">
            {quiz.map((q, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={qIndex} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10">
                  <div className="flex gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                    )}
                    <h3 className="font-semibold text-lg">{q.question}</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-sm">
                      <span className="text-slate-500">Your answer: </span>
                      <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {q.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="text-slate-500">Correct answer: </span>
                        <span className="text-green-600 dark:text-green-400">{q.options[q.correctAnswer]}</span>
                      </p>
                    )}
                    <div className="mt-4 p-4 rounded-xl bg-white dark:bg-white/5 text-sm border border-slate-200 dark:border-white/5">
                      <strong>Explanation: </strong> {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setQuiz(null)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
            >
              Generate New Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
