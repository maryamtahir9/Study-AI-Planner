import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Send, Mic, MicOff, Volume2, Square, 
  Copy, RefreshCw, Trash2, Bot, User, StopCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('initialChatPrompt');
    if (initialPrompt) {
      sessionStorage.removeItem('initialChatPrompt');
      handleSend(initialPrompt);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start recording", e);
      }
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // Strip markdown for speech
    const plainText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch response');
      }
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

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
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: msg.content + data.text }
                      : msg
                  )
                );
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `**Error**: ${error.message || 'Could not connect to the AI. Please try again.'}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white dark:bg-[#0a0a0f]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0a0a0f]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight">AI Study Assistant</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center transform -rotate-6">
              <Bot className="w-10 h-10 text-indigo-500 dark:text-indigo-400 transform rotate-6" />
            </div>
            <p className="text-xl font-semibold mb-2">How can I help you study today?</p>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Ask about complex topics, request study notes, or paste a problem you are stuck on.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-3xl mx-auto",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border dark:border-white/10 mt-1",
                msg.role === 'user' 
                  ? "bg-slate-100 dark:bg-white/5 dark:text-white" 
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20"
              )}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-gray-300" />
                ) : (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              
              <div className={cn(
                "group relative px-5 py-4 rounded-3xl max-w-[85%]",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-sm shadow-sm" 
                  : "bg-white dark:bg-white/5 rounded-tl-sm border border-slate-200 dark:border-white/10 shadow-sm"
              )}>
                {msg.role === 'assistant' && (
                  <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button onClick={() => speakText(msg.content)} className="p-2 rounded-full bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-white transition-colors">
                      {isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => copyToClipboard(msg.content)} className="p-2 rounded-full bg-white dark:bg-[#1a1a24] border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className={cn("prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed", 
                  msg.role === 'user' ? "text-white prose-p:text-white prose-headings:text-white" : "dark:text-gray-200"
                )}>
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl my-4 text-sm"
                          />
                        ) : (
                          <code {...props} className={cn(className, "bg-black/10 dark:bg-black/30 px-1.5 py-0.5 rounded-md font-mono text-sm")}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 border dark:border-white/10 shadow-md shadow-indigo-500/20 mt-1">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>
            <div className="px-5 py-4 rounded-3xl bg-white dark:bg-white/5 rounded-tl-sm border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1.5 h-[52px]">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-indigo-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-md border-t border-slate-200 dark:border-white/10 z-10">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 dark:opacity-20 group-hover:dark:opacity-30 transition duration-1000 hidden dark:block pointer-events-none"></div>
          <div className="relative bg-slate-50 dark:bg-[#15151e] border border-slate-200 dark:border-white/10 rounded-3xl p-2 flex items-end shadow-sm">
            <button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-full transition-colors shrink-0 mb-1 ml-1",
                isRecording 
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10" 
                  : "text-slate-400 hover:text-indigo-500 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
              )}
              title="Voice Input"
            >
              {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your studies..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base py-3.5 px-3 resize-none min-h-[52px] max-h-40 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-gray-200"
              rows={1}
            />
            <div className="flex items-center gap-2 p-1.5 shrink-0 mb-0.5">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 sm:px-5 rounded-full font-medium transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <span className="hidden sm:inline">Send</span>
                {isLoading ? <Square className="w-4 h-4 fill-current" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest hidden sm:flex font-medium">
            <span>Markdown Supported</span>
            <span>•</span>
            <span>Voice Input Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
