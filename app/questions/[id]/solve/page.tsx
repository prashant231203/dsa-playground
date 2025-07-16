'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Clock, Target, CheckCircle } from 'lucide-react';
import CodeEditor from '@/components/code-editor';
import { toast } from 'sonner';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  test_cases: Array<{
    input: any;
    output: any;
  }>;
  solution_template?: string;
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

const QuestionSolvePage = () => {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${params.id}`);
      if (!response.ok) {
        throw new Error('Question not found');
      }
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutionComplete = (result: ExecutionResult) => {
    setExecutionResult(result);
    
    if (result.success) {
      toast.success('Congratulations! All test cases passed! 🎉');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {question.title}
            </h1>
            <div className="flex items-center gap-3">
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline">
                {question.category}
              </Badge>
            </div>
          </div>
          
          {executionResult && (
            <div className="flex items-center gap-2">
              {executionResult.success ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Solved
                </Badge>
              ) : (
                <Badge variant="outline">
                  {executionResult.testCasesPassed}/{executionResult.totalTestCases} passed
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Question Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {question.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {question.test_cases.map((testCase, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">
                      Test Case {index + 1}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Input:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(testCase.input, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Output:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(testCase.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {question.solution_template && (
            <Card>
              <CardHeader>
                <CardTitle>Solution Template</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {question.solution_template}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="h-[800px]">
          <CodeEditor
            questionId={question.id}
            initialCode={question.solution_template || '// Write your solution here\n'}
            language="javascript"
            theme="vs-dark"
            onExecutionComplete={handleExecutionComplete}
          />
        </div>
      </div>

      {/* Execution Results Modal */}
      {executionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {executionResult.success ? '🎉 Solution Accepted!' : '❌ Solution Failed'}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setExecutionResult(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {executionResult.testCasesPassed}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {executionResult.totalTestCases - executionResult.testCasesPassed}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {executionResult.executionTime}ms
                  </div>
                  <div className="text-sm text-gray-600">Time</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Test Case Details</h3>
                {executionResult.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Test Case {result.testCase}</span>
                      {result.passed ? (
                        <Badge className="bg-green-500">Passed</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Input:</span>
                        <pre className="mt-1 p-1 bg-white rounded text-xs">
                          {JSON.stringify(result.input)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected:</span>
                        <pre className="mt-1 p-1 bg-white rounded text-xs">
                          {JSON.stringify(result.expected)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <pre className="mt-1 p-1 bg-white rounded text-xs">
                          {result.error || JSON.stringify(result.actual)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setExecutionResult(null)}
              >
                Close
              </Button>
              {executionResult.success && (
                <Button
                  onClick={() => {
                    setExecutionResult(null);
                    router.push('/questions');
                  }}
                >
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSolvePage; 