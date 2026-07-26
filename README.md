# StudyAI 🧠

A modern, fully functional AI-powered Study Guide web application designed to help students learn faster and retain more. Powered by advanced language models via the Groq API, StudyAI offers a premium, responsive UI/UX with an "Elegant Dark" aesthetic.

## 🌟 Features

### 💬 AI Study Chat
A ChatGPT-like AI interface tailored for educational purposes.
- **Groq API Integration:** Lightning-fast responses using Llama 3 models.
- **Voice Input (Speech-to-Text):** Ask questions using your microphone via the native Web Speech API.
- **Read Aloud (Text-to-Speech):** Listen to the AI's explanations.
- **Rich Text & Code:** Full Markdown rendering and syntax highlighting for programming questions.
- **Copy & Clear:** Easy tools to copy answers or clear the chat history.

### 📝 Quiz Generator
Test your knowledge instantly.
- Enter any topic.
- Select difficulty (Easy, Medium, Hard) and the number of questions.
- Auto-generates multiple-choice questions.
- Interactive quiz taking with instant grading and detailed explanations for each answer.

### 🗂️ Flashcard Generator
Master concepts quickly.
- Generate interactive study flashcards on any topic.
- Smooth 3D flip animations using Framer Motion and Tailwind CSS.
- Next/Previous navigation through your custom deck.

### 🛠️ Quick Study Tools
One-click AI tools for specific study needs:
- **AI Summarizer:** Paste long text and get a concise summary with key points.
- **Note Generator:** Turn unstructured text or concepts into organized study notes.
- **Concept Explainer:** Explain complex topics simply (ELI5).
- **Math Solver:** Get step-by-step solutions to mathematical problems.
- **Programming Assistant:** Explain code snippets, find bugs, or write new functions.
- **Essay Helper:** Improve grammar, structure, and vocabulary of your writing.

### 🎨 User Experience & Design
- **Elegant Dark Theme:** A premium dark mode featuring beautiful gradients, glassmorphism, and rounded UI components.
- **Light/Dark Toggle:** Seamlessly switch between themes.
- **Responsive:** Mobile-first design that looks great on all screen sizes.
- **Animations:** Smooth page transitions and component interactions powered by Framer Motion.

### Live App
**Link:** : https://study-ai-planner-seven.vercel.app

## 🚀 Tech Stack

- **Frontend:** React.js, React Router, Tailwind CSS, Framer Motion, Lucide React, React Markdown, React Syntax Highlighter
- **Backend:** Node.js, Express.js, Vite (development middleware)
- **AI Integration:** Groq SDK (Llama 3.1 8B Instant)
- **Build Tool:** Vite & ESBuild

## ⚙️ Setup & Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY="your_groq_api_key_here"
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

## 📄 License
This project is licensed under the MIT License.
