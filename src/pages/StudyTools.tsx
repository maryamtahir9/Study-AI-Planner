import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Wand2, Calculator, Edit3, Code, LayoutList } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const tools = [
  {
    id: 'summarizer',
    name: 'AI Summarizer',
    description: 'Paste long text and get a concise summary with key points.',
    icon: <LayoutList className="w-6 h-6 text-indigo-500" />,
    prompt: 'Please summarize the following text, highlighting the most important key points:\n\n'
  },
  {
    id: 'notes',
    name: 'Note Generator',
    description: 'Turn unstructured text or concepts into organized study notes.',
    icon: <FileText className="w-6 h-6 text-purple-500" />,
    prompt: 'Please create structured, easy-to-read study notes from the following topic/text:\n\n'
  },
  {
    id: 'explainer',
    name: 'Concept Explainer',
    description: 'Explain complex topics like Im talking to a 5-year-old.',
    icon: <Wand2 className="w-6 h-6 text-blue-500" />,
    prompt: 'Please explain the following concept in very simple terms, using an analogy if possible (ELI5):\n\n'
  },
  {
    id: 'math',
    name: 'Math Solver',
    description: 'Get step-by-step solutions to mathematical problems.',
    icon: <Calculator className="w-6 h-6 text-emerald-500" />,
    prompt: 'Please solve the following math problem step-by-step, explaining each step clearly:\n\n'
  },
  {
    id: 'coding',
    name: 'Programming Assistant',
    description: 'Explain code snippets, find bugs, or write new functions.',
    icon: <Code className="w-6 h-6 text-orange-500" />,
    prompt: 'Please review, explain, or help me write the following code:\n\n'
  },
  {
    id: 'essay',
    name: 'Essay Helper',
    description: 'Improve grammar, structure, and vocabulary of your writing.',
    icon: <Edit3 className="w-6 h-6 text-pink-500" />,
    prompt: 'Please review the following text/essay for grammar, structure, and vocabulary improvements:\n\n'
  }
];

export default function StudyTools() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  
  const handleUseTool = (prompt: string) => {
    if (!inputText.trim()) return;
    const fullPrompt = prompt + inputText;
    // We navigate to the chat page, ideally we could pass state via location, 
    // but for now we'll just redirect to chat (a real app might use a global state or Context)
    // To make it fully functional in a simple way, let's keep it here or redirect.
    // Let's implement the response inline for the tool!
  };

  const activeTool = tools.find(t => t.id === selectedTool);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Quick Study Tools</h1>
        <p className="text-slate-600 dark:text-slate-400">One-click AI tools for your specific study needs.</p>
      </div>

      {!selectedTool ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className="bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-3xl p-6 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-3xl mx-auto"
        >
          <button 
            onClick={() => {
              setSelectedTool(null);
              setInputText('');
            }}
            className="text-sm font-medium text-slate-500 hover:text-indigo-500 mb-6 flex items-center gap-2"
          >
            &larr; Back to Tools
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              {activeTool?.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{activeTool?.name}</h2>
              <p className="text-slate-500">{activeTool?.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text, topic, or problem here..."
              className="w-full h-48 bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            
            <button
              onClick={() => {
                // Here we would ideally execute the AI call inline or redirect to chat with state.
                // We'll redirect to chat with the pre-filled prompt using browser's sessionStorage
                sessionStorage.setItem('initialChatPrompt', activeTool!.prompt + inputText);
                navigate('/chat');
              }}
              disabled={!inputText.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Run Tool &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
