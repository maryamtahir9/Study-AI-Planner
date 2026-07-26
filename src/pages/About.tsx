import { Github, Twitter, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About StudyAI</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Empowering students with intelligent, accessible, and fast learning tools.
          </p>
        </div>

        <div className="prose dark:prose-invert prose-lg max-w-none">
          <p>
            StudyAI was built with a simple mission: to make high-quality, personalized tutoring available to anyone, anywhere. By leveraging advanced language models, we provide instantaneous help with homework, concept explanations, and study materials.
          </p>
          <p>
            Whether you're preparing for a major exam, trying to understand a complex programming bug, or simply looking to learn something new, StudyAI adapts to your pace and style.
          </p>
          
          <h3 className="text-2xl font-semibold mt-10 mb-4">Our Technology</h3>
          <ul className="space-y-2">
            <li><strong>Frontend:</strong> React, Tailwind CSS, Framer Motion</li>
            <li><strong>Backend:</strong> Node.js, Express</li>
            <li><strong>AI Models:</strong> Advanced Language Models</li>
            <li><strong>Voice:</strong> Native Web Speech API for Speech-to-Text and Text-to-Speech</li>
          </ul>
        </div>

        <div className="pt-12 mt-12 border-t border-slate-200 dark:border-white/10">
          <h3 className="text-xl font-semibold mb-6 text-center">Connect with the Developer</h3>
          <div className="flex justify-center gap-6">
            <a href="#" className="p-3 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-indigo-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-indigo-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-indigo-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
