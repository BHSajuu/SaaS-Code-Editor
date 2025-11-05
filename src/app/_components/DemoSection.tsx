"use client";

import { motion } from "framer-motion";
import { Play, Code, Terminal, Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CODE_EXAMPLES = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    code: `// Welcome to CodeNexta!
const greet = (name) => {
  return \`Hello, \${name}! 🚀\`;
};
 
// Define languages
const languages = ['JS', 'Python', 'Java', 'Go'];
 
// Greet each developer
languages.forEach(lang => {
  console.log(greet(\`\${lang} Developer\`));
});
 
// Execution complete`,
    output: "Hello, JS Developer! 🚀\nHello, Python Developer! 🚀\nHello, Java Developer! 🚀\nHello, Go Developer! 🚀"
  },
  python: {
    name: "Python",
    icon: "/python.png",
    code: `# Data Science with Python
import math

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate Fibonacci sequence
sequence = [fibonacci(i) for i in range(8)]
print("Fibonacci sequence:", sequence)

# Calculate statistics
avg = sum(sequence) / len(sequence)
print(f"Average: {avg:.2f}")`,
    output: "Fibonacci sequence: [0, 1, 1, 2, 3, 5, 8, 13]\nAverage: 4.12"
  },
  java: {
    name: "Java",
    icon: "/java.png",
    code: `// Object-Oriented Programming
public class CodeNexta {
    private String name;
    public CodeNexta(String name) {
        this.name = name;
    }
    public void displayInfo() {
        System.out.println("Welcome to " + name);
        System.out.println("The best online IDE!");
    }
    public static void main(String[] args) {
        new CodeNexta("CodeNexta").displayInfo();
    }
}
// End of snippet`,
    output: "Welcome to CodeNexta\nThe best online IDE!"
  }
};


// Custom GitHub Dark theme configuration
const githubDarkTheme = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    color: '#c9d1d9',
    background: '#0d1117',
    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    color: '#c9d1d9',
    background: '#0d1117',
    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0,
    padding: '1rem',
    overflow: 'auto',
  },
  comment: { color: '#6e7681', fontStyle: 'italic' },
  string: { color: '#a5d6ff' },
  keyword: { color: '#ff7b72', fontWeight: 'bold' },
  number: { color: '#79c0ff' },
  operator: { color: '#ff7b72' },
  function: { color: '#d2a8ff' },
  variable: { color: '#ffa657' },
  'class-name': { color: '#ffa657' },
  boolean: { color: '#79c0ff' },
  constant: { color: '#79c0ff' },
  builtin: { color: '#ffa657' },
  punctuation: { color: '#c9d1d9' },
  property: { color: '#79c0ff' },
  namespace: { color: '#ffa657' },
  regex: { color: '#96d0ff' },
  'attr-name': { color: '#79c0ff' },
  'attr-value': { color: '#a5d6ff' },
  tag: { color: '#7ee787' },
  selector: { color: '#7ee787' },
  'line-numbers': { color: '#6e7681' },
  'line-numbers-rows': { color: '#6e7681' },
};
function DemoSection() {
  const [activeLanguage, setActiveLanguage] = useState<keyof typeof CODE_EXAMPLES>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 2000);
  };

  const getLanguageForHighlighter = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'java': return 'java';
      default: return 'javascript';
    }
  };
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Live Demo</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              See CodeNexta in {" "}
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Action
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the power of our online IDE with real-time code execution, 
            syntax highlighting, and intelligent error detection.
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-gray-400 text-sm">CodeNexta IDE</span>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                {Object.entries(CODE_EXAMPLES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLanguage(key as keyof typeof CODE_EXAMPLES);
                      setShowOutput(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      activeLanguage === key
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Image src={lang.icon} alt={lang.name} width={16} height={16} />
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Code Editor */}
              <div className="relative">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm">Editor</span>
                    </div>
                    
                    <motion.button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Code
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-gray-800/50">
                    <SyntaxHighlighter
                      language={getLanguageForHighlighter(activeLanguage)}
                      style={githubDarkTheme}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6e7681',
                        backgroundColor: '#0d1117',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                        minWidth: '2.5em',
                      }}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#0d1117',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {CODE_EXAMPLES[activeLanguage].code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>

              {/* Output Panel */}
              <div className="border-l border-white/10 bg-[#0d1117]/50">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Output</span>
                  </div>
                  
                  <div className="bg-[#0d1117] rounded-lg p-4 h-64 font-mono text-sm border border-gray-800/50">
                    {isRunning ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full loader-spin mx-auto mb-3" />
                          <p className="text-gray-400">Executing code...</p>
                        </div>
                      </div>
                    ) : showOutput ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <pre className="text-[#7ee787] whitespace-pre-wrap">
                          {CODE_EXAMPLES[activeLanguage].output}
                        </pre>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Click "Run Code" to see the output
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">Ready to start coding?</p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            <Play className="w-5 h-5" />
            Try CodeNexta Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default DemoSection;