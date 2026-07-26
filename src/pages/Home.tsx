import { motion } from 'motion/react';
import { ArrowRight, Brain, Zap, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
    title: 'AI Study Chat',
    description: 'Chat with an intelligent assistant to explain complex concepts, solve math problems, and get coding help.',
  },
  {
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    title: 'Quiz Generator',
    description: 'Instantly generate custom quizzes on any topic with adjustable difficulty levels.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    title: 'Flashcards',
    description: 'Transform your study material into interactive flashcards for better retention.',
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: 'Quick Tools',
    description: 'Access AI summarizers, note generators, and essay helpers with a single click.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-50/0 to-slate-50/0 dark:from-indigo-500/20 dark:via-[#050508]/0 dark:to-[#050508]/0"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 dark:border dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Study Guide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Supercharge Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Learning Journey
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your personal AI tutor that never sleeps. Generate quizzes, create flashcards, 
            and understand complex topics instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Start Studying
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 text-slate-900 dark:text-white rounded-2xl font-medium transition-all"
            >
              Explore Tools
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ace it</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A complete suite of AI-powered study tools designed to help you learn faster and retain more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: 'Is it free to use?',
              a: 'Yes, this tool is completely free for educational purposes, utilizing high-speed AI models.',
            },
            {
              q: 'What subjects can it help with?',
              a: 'It can assist with Mathematics, Computer Science, Engineering, History, Sciences, Literature, and more.',
            },
            {
              q: 'Does it support voice input?',
              a: 'Yes! The AI Chat features both Speech-to-Text for asking questions and Text-to-Speech to read answers aloud.',
            },
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10">
              <h4 className="font-semibold text-lg mb-2">{faq.q}</h4>
              <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
