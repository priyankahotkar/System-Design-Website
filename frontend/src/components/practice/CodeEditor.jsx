import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Copy } from 'lucide-react';
import Button from '../common/Button';

const getCodeSnippet = (language, questionId) => {
  const snippets = {
    javascript: `// System Design Implementation for: ${questionId}
class SystemDesign {
  constructor() {
    // Initialize your system components
    this.loadBalancer = new LoadBalancer();
    this.database = new Database();
    this.cache = new Cache();
  }
  
  // Implement your solution here
  handleRequest(request) {
    // Your implementation
  }
}

// Example usage
const system = new SystemDesign();
`,
    python: `# System Design Implementation for: ${questionId}
class SystemDesign:
    def __init__(self):
        # Initialize your system components
        self.load_balancer = "LoadBalancer()"
        self.database = "Database()"
        self.cache = "Cache()"

    def handle_request(self, request):
        # Your implementation
        pass

# Example usage
system = SystemDesign()
`,
    java: `// System Design Implementation for: ${questionId}
class SystemDesign {
    // Initialize your system components
    private LoadBalancer loadBalancer;
    private Database database;
    private Cache cache;

    public SystemDesign() {
        this.loadBalancer = new LoadBalancer();
        this.database = new Database();
        this.cache = new Cache();
    }

    public void handleRequest(Request request) {
        // Your implementation
    }
}

// Example usage
// SystemDesign system = new SystemDesign();
`,
    cpp: `// System Design Implementation for: ${questionId}
#include <iostream>

class SystemDesign {
public:
    // Initialize your system components
    // LoadBalancer loadBalancer;
    // Database database;
    // Cache cache;

    SystemDesign() {
        // Constructor
    }

    void handleRequest(const std::string& request) {
        // Your implementation
    }
};

int main() {
    // Example usage
    // SystemDesign system;
    return 0;
}
`
  };
  return snippets[language] || '';
};


const CodeEditor = ({ questionId }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(getCodeSnippet(language, questionId));
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    setCode(getCodeSnippet(language, questionId));
  }, [language, questionId]);

  const handleRun = async () => {
    console.log("1. 'Run' button clicked. Starting execution...");
    setIsRunning(true);
    setOutput('');

    try {
      console.log("2. Preparing to send request to backend with:", { language, code });
      const response = await fetch('http://localhost:8080/runCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });

      console.log("3. Received response from backend:", response);

      const result = await response.json();
      console.log("4. Parsed JSON result:", result);

      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.output || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error("5. CRITICAL ERROR in handleRun:", error);
      setOutput(`Failed to connect to the execution service. Error: ${error.message}. Check the browser console (F12) for more details.`);
    } finally {
      setIsRunning(false);
      console.log("6. Execution finished.");
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-design-${questionId}-solution.${language === 'javascript' ? 'js' : language}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Code Editor</h3>
          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="small" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="small" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="primary" size="small" onClick={handleRun} loading={isRunning}>
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-2/3 h-full">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              independentColorPoolPerBracketType: true,
            }}
          />
        </div>

        <div className="w-1/3 border-l border-slate-200 bg-slate-900 text-white p-4 font-mono text-sm overflow-auto">
          <div className="mb-2 text-slate-300 font-semibold">Output:</div>
          {output ? (
            <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
          ) : (
            <pre className="text-slate-500">
              {isRunning ? "Executing..." : "Output will be displayed here after running the code."}
            </pre>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          💡 Tip: Implement key components like load balancers, databases, caching layers, and APIs
        </p>
      </div>
    </div>
  );
};

export default CodeEditor;