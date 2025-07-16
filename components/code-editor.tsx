'use client';

import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  questionId: string;
  initialCode?: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  onCodeChange?: (code: string) => void;
  onExecutionComplete?: (result: any) => void;
}

interface ExecutionResult {
  success: boolean;
  results: Array<{
    testCase: number;
    input: any;
    expected: any;
    actual: any;
    passed: boolean;
    executionTime?: number;
    error?: string;
  }>;
  executionTime: number;
  testCasesPassed: number;
  totalTestCases: number;
  submissionId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  questionId,
  initialCode = '// Write your solution here\n',
  language = 'javascript',
  theme = 'vs-dark',
  onCodeChange,
  onExecutionComplete
}) => {
  const [code, setCode] = useState(initialCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const executeCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          questionId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Execution failed');
      }

      setExecutionResult(result);
      onExecutionComplete?.(result);

      if (result.success) {
        toast.success(`All test cases passed! 🎉`);
      } else {
        toast.error(`${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
      }
    } catch (error) {
      console.error('Execution error:', error);
      toast.error(error instanceof Error ? error.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setExecutionResult(null);
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
  };

  const getLanguageConfig = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return {
          language: 'javascript',
          defaultCode: `// Write your solution here
function solution() {
  // Your code here
  return null;
}`,
        };
      case 'python':
        return {
          language: 'python',
          defaultCode: `# Write your solution here
def solution():
    # Your code here
    pass`,
        };
      case 'java':
        return {
          language: 'java',
          defaultCode: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        };
      default:
        return {
          language: 'javascript',
          defaultCode: `// Write your solution here
function solution() {
  // Your code here
  return null;
}`,
        };
    }
  };

  const langConfig = getLanguageConfig(language);

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Code Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {language}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCode}
                disabled={isExecuting}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                onClick={executeCode}
                disabled={isExecuting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isExecuting ? (
                  <>
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="results" disabled={!executionResult}>
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 mt-0">
              <div className="h-full min-h-[500px]">
                <Editor
                  height="100%"
                  language={langConfig.language}
                  theme={theme}
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: {
                      enabled: true
                    },
                    autoIndent: 'full',
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    insertSpaces: true,
                    detectIndentation: true,
                    trimAutoWhitespace: true,
                    largeFileOptimizations: true,
                    suggest: {
                      showKeywords: true,
                      showSnippets: true,
                      showClasses: true,
                      showFunctions: true,
                      showVariables: true,
                      showConstants: true,
                      showEnums: true,
                      showEnumMembers: true,
                      showColors: true,
                      showFiles: true,
                      showReferences: true,
                      showFolders: true,
                      showTypeParameters: true,
                      showWords: true,
                      showUsers: true,
                      showIssues: true,
                    }
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="flex-1 mt-0">
              {executionResult && (
                <div className="h-full overflow-auto p-4 space-y-4">
                  {/* Summary */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {executionResult.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        Execution Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span>Execution Time:</span>
                          <span className="font-mono">{executionResult.executionTime}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Test Cases:</span>
                          <span className="font-mono">
                            {executionResult.testCasesPassed}/{executionResult.totalTestCases}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Case Results */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Test Case Results</h3>
                    {executionResult.results.map((result, index) => (
                      <Card key={index} className={result.passed ? 'border-green-200' : 'border-red-200'}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Test Case {result.testCase}</span>
                            {result.passed ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Input:</span>
                              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                {JSON.stringify(result.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Expected:</span>
                              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                {JSON.stringify(result.expected, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Actual:</span>
                              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                {result.error ? (
                                  <span className="text-red-600">{result.error}</span>
                                ) : (
                                  JSON.stringify(result.actual, null, 2)
                                )}
                              </pre>
                            </div>
                          </div>
                          
                          {result.executionTime && (
                            <div className="mt-2 text-xs text-gray-500">
                              Execution time: {result.executionTime}ms
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor; 