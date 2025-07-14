"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Trophy, Timer, Target, Sparkles, Flame, Star, CheckCircle, XCircle, Brain } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"
import { ParticleBackground } from "@/components/particle-background"

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  category: string
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [health, setHealth] = useState(100)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)

  const questions: Question[] = [
    {
      id: "1",
      question: "What is the time complexity of accessing an element in a linked list?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 2,
      explanation: "In a linked list, you must traverse from the head to reach any element, making it O(n)",
      difficulty: "Easy",
      points: 25,
      category: "Complexity",
    },
    {
      id: "2",
      question: "Which data structure follows LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
      explanation: "A stack follows LIFO - the last element added is the first one to be removed",
      difficulty: "Easy",
      points: 25,
      category: "Data Structures",
    },
    {
      id: "3",
      question: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
      correct: 2,
      explanation: "QuickSort has O(n²) worst-case when the pivot is always the smallest or largest element",
      difficulty: "Medium",
      points: 50,
      category: "Sorting",
    },
  ]

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, showResult])

  const handleTimeUp = () => {
    setHealth(Math.max(0, health - 25))
    setShowResult(true)
    setIsCorrect(false)
    setStreak(0)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === questions[currentQuestion].correct
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const basePoints = questions[currentQuestion].points
      const timeBonus = Math.max(0, Math.floor((45 - timeLeft) / 5) * 5)
      const streakBonus = streak >= 3 ? Math.floor(basePoints * 0.5) : 0
      const totalPoints = basePoints + timeBonus + streakBonus

      setScore(score + totalPoints)
      setStreak(streak + 1)
    } else {
      setHealth(Math.max(0, health - 20))
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(null)
      setTimeLeft(45)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setHealth(100)
    setScore(0)
    setTimeLeft(45)
    setShowResult(false)
    setIsCorrect(null)
    setStreak(0)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Practice Arena
              </h1>
              <p className="text-xl text-slate-400 mt-2">Test your DSA knowledge with interactive challenges</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Adaptive Learning
            </Badge>
            <Badge className="bg-pink-500/20 text-pink-400 border-pink-400/30 px-4 py-2">Real-time Feedback</Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Health */}
            <GlassmorphismCard className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-white">Health</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${health}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-2xl font-bold text-white">{health}/100</div>
            </GlassmorphismCard>

            {/* Score */}
            <GlassmorphismCard className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Score</span>
              </div>
              <motion.div
                className="text-3xl font-bold text-yellow-400"
                animate={{ scale: isCorrect ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {score}
              </motion.div>
            </GlassmorphismCard>

            {/* Timer */}
            <GlassmorphismCard className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Timer className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Time</span>
              </div>
              <motion.div
                className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}
                animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0 }}
              >
                {timeLeft}s
              </motion.div>
            </GlassmorphismCard>

            {/* Streak */}
            <GlassmorphismCard className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-semibold text-white">Streak</span>
              </div>
              <motion.div
                className="text-3xl font-bold text-orange-400 flex items-center"
                animate={{
                  scale: streak > 0 ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {streak}
                {streak >= 3 && <Sparkles className="w-6 h-6 ml-2 animate-spin" />}
              </motion.div>
            </GlassmorphismCard>
          </div>

          {/* Main Quiz Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Progress */}
            <GlassmorphismCard className="p-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3" />
                <motion.div
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </GlassmorphismCard>

            {/* Question Card */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 15 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <GlassmorphismCard className="p-8 relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`${
                          currentQ.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400 border-green-400/30"
                            : currentQ.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                              : "bg-red-500/20 text-red-400 border-red-400/30"
                        }`}
                      >
                        {currentQ.difficulty} • {currentQ.points} XP
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                        {currentQ.category}
                      </Badge>
                    </div>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-white leading-relaxed">{currentQ.question}</h2>

                  <div className="grid gap-4">
                    {currentQ.options?.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          selectedAnswer === index
                            ? isCorrect
                              ? "border-green-400 bg-green-400/10 text-green-400"
                              : "border-red-400 bg-red-400/10 text-red-400"
                            : showResult && index === currentQ.correct
                              ? "border-green-400 bg-green-400/10 text-green-400"
                              : "border-slate-600 bg-slate-800/30 text-white hover:border-purple-400 hover:bg-purple-400/5"
                        }`}
                        whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
                        whileTap={!showResult ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                              selectedAnswer === index
                                ? isCorrect
                                  ? "border-green-400 bg-green-400 text-slate-900"
                                  : "border-red-400 bg-red-400 text-white"
                                : showResult && index === currentQ.correct
                                  ? "border-green-400 bg-green-400 text-slate-900"
                                  : "border-slate-500 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg">{option}</span>
                          {showResult && (
                            <div className="ml-auto">
                              {index === currentQ.correct ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                              ) : selectedAnswer === index ? (
                                <XCircle className="w-6 h-6 text-red-400" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Result Feedback */}
                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`p-6 rounded-xl border-2 ${
                          isCorrect ? "border-green-400/30 bg-green-400/5" : "border-red-400/30 bg-red-400/5"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-6 h-6 text-green-400" />
                              <span className="text-xl font-bold text-green-400">Excellent! 🎉</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 text-red-400" />
                              <span className="text-xl font-bold text-red-400">Not quite right 😅</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>

                        {isCorrect && streak > 1 && (
                          <motion.div
                            className="flex items-center space-x-2 mt-4 p-3 bg-orange-400/10 rounded-lg border border-orange-400/30"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5, repeat: 3 }}
                          >
                            <Flame className="w-5 h-5 text-orange-400" />
                            <span className="text-orange-400 font-semibold">
                              {streak} question streak! You&apos;re on fire! 🔥
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassmorphismCard>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent"
              >
                Reset Quiz
              </Button>

              {showResult && (
                <Button
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold"
                  disabled={currentQuestion >= questions.length - 1}
                >
                  {currentQuestion >= questions.length - 1 ? "Quiz Complete!" : "Next Question"}
                  {currentQuestion < questions.length - 1 && <Target className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Final Results */}
        {currentQuestion >= questions.length - 1 && showResult && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-8"
          >
            <GlassmorphismCard className="p-8 text-center relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {score >= 150 ? "🏆" : score >= 75 ? "🥈" : "🥉"}
                </motion.div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Quiz Complete!
                </h2>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">{score}</div>
                    <div className="text-slate-400">Total Score</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400">{health}</div>
                    <div className="text-slate-400">Health Left</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-400">
                      {Math.round((score / (questions.length * 50)) * 100)}%
                    </div>
                    <div className="text-slate-400">Accuracy</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400">{streak}</div>
                    <div className="text-slate-400">Best Streak</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent px-8 py-3"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    View Progress
                  </Button>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
