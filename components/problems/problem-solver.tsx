"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProblemsStore, useProgressStore, useUIStore } from "@/lib/store"
import type { Submission } from "@/lib/store"
import {
  Play,
  Save,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MemoryStickIcon as Memory,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ProblemSolverProps {
  problemId: string
}

export function ProblemSolver({ problemId }: ProblemSolverProps) {
  const { problems, likeProblem, dislikeProblem } = useProblemsStore()
  const { addSubmission, submissions } = useProgressStore()
  const { addNotification } = useUIStore()

  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<Array<{
    id: number
    input: string
    expected: string
    actual: string
    passed: boolean
    runtime: number
    memory: number
  }>>([])
  const [activeTab, setActiveTab] = useState("description")

  const problem = problems.find((p) => p.id === problemId)
  const userSubmissions = submissions.filter((s) => s.problemId === problemId)
  // const lastSubmission = userSubmissions[userSubmissions.length - 1]

  useEffect(() => {
    if (problem && language === "javascript") {
      setCode(`function ${problem.title.toLowerCase().replace(/\s+/g, "")}() {
    // Write your solution here
    
}`)
    }
  }, [problem, language])

  if (!problem) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 mb-2">Problem not found</div>
          <p className="text-slate-400">The requested problem could not be loaded.</p>
        </CardContent>
      </Card>
    )
  }

  const difficultyColors = {
    Easy: "bg-green-600/20 text-green-400 border-green-600/30",
    Medium: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    Hard: "bg-red-600/20 text-red-400 border-red-600/30",
  }

  const runCode = async () => {
    setIsRunning(true)
    setActiveTab("results")

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const results = problem.testCases.map((testCase, index) => ({
        id: index,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: testCase.expectedOutput, // Mock: assume all pass for demo
        passed: Math.random() > 0.3, // 70% pass rate for demo
        runtime: Math.floor(Math.random() * 100) + 10,
        memory: Math.floor(Math.random() * 50) + 10,
      }))

      setTestResults(results)

      const allPassed = results.every((r) => r.passed)
      if (allPassed) {
        addNotification({
          type: "success",
          title: "All tests passed!",
          message: "Great job! Your solution is correct.",
        })
      } else {
        addNotification({
          type: "warning",
          title: "Some tests failed",
          message: "Check the results and try again.",
        })
      }
    } catch {
      addNotification({
        type: "error",
        title: "Execution failed",
        message: "There was an error running your code.",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    if (!code.trim()) {
      addNotification({
        type: "error",
        title: "No code to submit",
        message: "Please write your solution first.",
      })
      return
    }

    setIsRunning(true)

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const submission: Submission = {
        id: Date.now().toString(),
        problemId: problem.id,
        code,
        language,
        status: Math.random() > 0.4 ? "Accepted" : "Wrong Answer",
        runtime: Math.floor(Math.random() * 100) + 10,
        memory: Math.floor(Math.random() * 50) + 10,
        submittedAt: new Date().toISOString(),
        testCasesPassed: Math.floor(Math.random() * problem.testCases.length) + 1,
        totalTestCases: problem.testCases.length,
      }

      addSubmission(submission)

      if (submission.status === "Accepted") {
        addNotification({
          type: "success",
          title: "Accepted!",
          message: "Congratulations! Your solution has been accepted.",
        })
      } else {
        addNotification({
          type: "error",
          title: "Wrong Answer",
          message: "Your solution didn't pass all test cases.",
        })
      }

      setActiveTab("submissions")
    } catch {
      addNotification({
        type: "error",
        title: "Submission failed",
        message: "There was an error submitting your code.",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(`function ${problem.title.toLowerCase().replace(/\s+/g, "")}() {
    // Write your solution here
    
}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen max-h-screen overflow-hidden">
      {/* Problem Description */}
      <div className="flex flex-col">
        <Card className="bg-slate-800/50 border-slate-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-white">{problem.title}</CardTitle>
                <Badge className={`${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeProblem(problem.id)}
                  className="hover:bg-green-600/20"
                >
                  <ThumbsUp className="h-4 w-4 text-green-400" />
                  <span className="ml-1 text-xs">{problem.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dislikeProblem(problem.id)}
                  className="hover:bg-red-600/20"
                >
                  <ThumbsDown className="h-4 w-4 text-red-400" />
                  <span className="ml-1 text-xs">{problem.dislikes}</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Problem Statement</h3>
                  <p className="text-slate-300 leading-relaxed">{problem.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">Constraints</h3>
                  <ul className="space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="text-slate-300 text-sm">
                        • {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge key={company} variant="outline" className="border-slate-600">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="mt-4 space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Example {index + 1}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">Input: </span>
                        <code className="text-green-400 bg-slate-800/50 px-2 py-1 rounded">{example.input}</code>
                      </div>
                      <div>
                        <span className="text-slate-400">Output: </span>
                        <code className="text-blue-400 bg-slate-800/50 px-2 py-1 rounded">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-slate-400">Explanation: </span>
                          <span className="text-slate-300">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="results" className="mt-4">
                {testResults.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded-lg border ${
                          result.passed ? "bg-green-600/10 border-green-600/30" : "bg-red-600/10 border-red-600/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-sm font-medium text-white">Test Case {result.id + 1}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{result.runtime}ms</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Memory className="h-3 w-3" />
                              <span>{result.memory}MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="text-slate-400">Input: </span>
                            <code className="text-slate-300">{result.input}</code>
                          </div>
                          <div>
                            <span className="text-slate-400">Expected: </span>
                            <code className="text-slate-300">{result.expected}</code>
                          </div>
                          <div>
                            <span className="text-slate-400">Actual: </span>
                            <code className={result.passed ? "text-green-400" : "text-red-400"}>{result.actual}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">Run your code to see test results</div>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="mt-4">
                {userSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {userSubmissions
                      .slice()
                      .reverse()
                      .map((submission) => (
                        <div
                          key={submission.id}
                          className={`p-3 rounded-lg border ${
                            submission.status === "Accepted"
                              ? "bg-green-600/10 border-green-600/30"
                              : "bg-red-600/10 border-red-600/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {submission.status === "Accepted" ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                              <span className="font-medium text-white">{submission.status}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                            <span>
                              {submission.testCasesPassed}/{submission.totalTestCases} test cases passed
                            </span>
                            {submission.runtime && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{submission.runtime}ms</span>
                              </div>
                            )}
                            {submission.memory && (
                              <div className="flex items-center space-x-1">
                                <Memory className="h-3 w-3" />
                                <span>{submission.memory}MB</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">No submissions yet</div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Code Editor */}
      <div className="flex flex-col">
        <Card className="bg-slate-800/50 border-slate-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={resetCode} className="border-slate-600 bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runCode}
                  disabled={isRunning}
                  className="border-slate-600 bg-transparent"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
                <Button size="sm" onClick={submitCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  {isRunning ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 font-mono text-sm bg-slate-900/50 border-slate-600 text-white resize-none"
              placeholder="Write your solution here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
