import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => setIsSubmitted(true), 500);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Have questions, feedback, or feature requests? Let us know!
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Thanks for reaching out. We'll get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input required type="email" className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea required rows={5} className="w-full bg-slate-50 dark:bg-[#050508] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
            </div>
            
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-medium transition-colors">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
