import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  xp: number
  streak: number
  joinedAt: string
  lastActive: string
  preferences: {
    theme: "light" | "dark"
    notifications: boolean
    memeMode: boolean
    difficulty: "beginner" | "intermediate" | "advanced"
    learningPath: string[]
  }
  stats: {
    problemsSolved: number
    quizzesTaken: number
    studyTimeMinutes: number
    conceptsCompleted: number
    averageScore: number
    bestStreak: number
  }
}

export interface Progress {
  conceptId: string
  conceptName: string
  completed: boolean
  progress: number
  timeSpent: number
  lastAccessed: string
  score?: number
  attempts: number
  mastery: "beginner" | "intermediate" | "advanced" | "expert"
  weakAreas: string[]
  strongAreas: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  category: "learning" | "streak" | "quiz" | "problem" | "social" | "milestone"
  rarity: "common" | "rare" | "epic" | "legendary"
  xpReward: number
  requirements: {
    type: string
    value: number
    current?: number
  }[]
}

export interface QuizResult {
  id: string
  conceptId: string
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  difficulty: "easy" | "medium" | "hard"
  answers: Array<{
    questionId: string
    selectedAnswer: number
    correct: boolean
    timeSpent: number
    explanation?: string
  }>
  improvements: string[]
}

export interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  hints: string[]
  solution?: string
  testCases: Array<{
    input: string
    expectedOutput: string
    hidden?: boolean
  }>
  tags: string[]
  companies: string[]
  acceptance: number
  submissions: number
  likes: number
  dislikes: number
  discussionCount: number
  relatedProblems: string[]
  editorialUrl?: string
  videoUrl?: string
}

export interface Submission {
  id: string
  problemId: string
  code: string
  language: string
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Compilation Error"
  runtime?: number
  memory?: number
  submittedAt: string
  testCasesPassed: number
  totalTestCases: number
  errorMessage?: string
}

export interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedHours: number
  concepts: string[]
  prerequisites: string[]
  completionRate: number
  enrolled: boolean
  progress: number
}

export interface StudySession {
  id: string
  conceptId: string
  startTime: string
  endTime?: string
  duration: number
  activities: Array<{
    type: "reading" | "quiz" | "problem" | "video"
    id: string
    timeSpent: number
    completed: boolean
  }>
  focusScore: number
  notes: string
}

// Store interfaces
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  updateStats: (stats: Partial<User["stats"]>) => void
  addXP: (amount: number) => void
  updateStreak: () => void
  clearError: () => void
}

interface ProgressState {
  progress: Progress[]
  achievements: Achievement[]
  quizResults: QuizResult[]
  submissions: Submission[]
  learningPaths: LearningPath[]
  studySessions: StudySession[]
  currentSession: StudySession | null
  updateProgress: (conceptId: string, updates: Partial<Progress>) => void
  addQuizResult: (result: QuizResult) => void
  addSubmission: (submission: Submission) => void
  unlockAchievement: (achievementId: string) => void
  getConceptProgress: (conceptId: string) => Progress | undefined
  getTotalXP: () => number
  getStreakDays: () => number
  startStudySession: (conceptId: string) => void
  endStudySession: () => void
  updateSessionActivity: (activity: StudySession["activities"][0]) => void
  getRecommendations: () => string[]
  getWeakAreas: () => string[]
  getStudyStats: () => {
    totalTime: number
    averageSession: number
    focusScore: number
    productivity: number
  }
  checkAchievements: () => void
}

interface ProblemsState {
  problems: Problem[]
  filteredProblems: Problem[]
  filters: {
    difficulty: string[]
    category: string[]
    status: string[]
    tags: string[]
    companies: string[]
  }
  searchQuery: string
  sortBy: "title" | "difficulty" | "acceptance" | "submissions" | "likes"
  sortOrder: "asc" | "desc"
  isLoading: boolean
  error: string | null
  setProblems: (problems: Problem[]) => void
  setFilters: (filters: Partial<ProblemsState["filters"]>) => void
  setSearchQuery: (query: string) => void
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void
  applyFilters: () => void
  likeProblem: (problemId: string) => void
  dislikeProblem: (problemId: string) => void
  getRecommendedProblems: () => Problem[]
  getProblemsByDifficulty: (difficulty: string) => Problem[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface UIState {
  sidebarOpen: boolean
  memeMode: boolean
  darkMode: boolean
  notifications: Array<{
    id: string
    type: "success" | "error" | "info" | "warning" | "achievement"
    title: string
    message: string
    timestamp: string
    read: boolean
    actionUrl?: string
    actionText?: string
  }>
  activeModal: string | null
  loading: {
    [key: string]: boolean
  }
  setSidebarOpen: (open: boolean) => void
  setMemeMode: (enabled: boolean) => void
  setDarkMode: (enabled: boolean) => void
  addNotification: (notification: Omit<UIState["notifications"][0], "id" | "timestamp" | "read">) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  setActiveModal: (modal: string | null) => void
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
}

// Mock data generators
const generateMockAchievements = (): Achievement[] => [
  {
    id: "first-problem",
    name: "First Steps",
    description: "Solve your first problem",
    icon: "🎯",
    category: "problem",
    rarity: "common",
    xpReward: 50,
    requirements: [{ type: "problems_solved", value: 1, current: 0 }],
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "🧠",
    category: "quiz",
    rarity: "rare",
    xpReward: 200,
    requirements: [{ type: "perfect_quizzes", value: 5, current: 0 }],
  },
  {
    id: "streak-warrior",
    name: "Streak Warrior",
    description: "Maintain a 30-day learning streak",
    icon: "🔥",
    category: "streak",
    rarity: "epic",
    xpReward: 500,
    requirements: [{ type: "streak_days", value: 30, current: 0 }],
  },
  {
    id: "algorithm-expert",
    name: "Algorithm Expert",
    description: "Master all sorting algorithms",
    icon: "⚡",
    category: "learning",
    rarity: "legendary",
    xpReward: 1000,
    requirements: [{ type: "concepts_mastered", value: 10, current: 0 }],
  },
]

const generateMockProblems = (): Problem[] => [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try using a hash table to store the complement of each number.",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
    ],
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft"],
    acceptance: 49.2,
    submissions: 4500000,
    likes: 15420,
    dislikes: 542,
    discussionCount: 1250,
    relatedProblems: ["2", "3"],
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
    ],
    constraints: ["The number of nodes in each linked list is in the range [1, 100]"],
    hints: [
      "Keep track of the carry using a variable and simulate digits-by-digits sum starting from the head of list",
    ],
    testCases: [{ input: "[2,4,3], [5,6,4]", expectedOutput: "[7,0,8]" }],
    tags: ["Linked List", "Math", "Recursion"],
    companies: ["Amazon", "Microsoft", "Apple"],
    acceptance: 38.1,
    submissions: 3200000,
    likes: 12340,
    dislikes: 2341,
    discussionCount: 890,
    relatedProblems: ["1", "3"],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    hints: ["Use a sliding window approach with two pointers"],
    testCases: [
      { input: '"abcabcbb"', expectedOutput: "3" },
      { input: '"bbbbb"', expectedOutput: "1" },
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Bloomberg", "Adobe"],
    acceptance: 33.8,
    submissions: 4100000,
    likes: 18920,
    dislikes: 834,
    discussionCount: 1456,
    relatedProblems: ["1", "2"],
  },
]

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call with validation
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              if (email === "test@test.com" && password === "password") {
                resolve(true)
              } else {
                reject(new Error("Invalid credentials"))
              }
            }, 1000)
          })

          const mockUser: User = {
            id: Date.now().toString(),
            name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
            email,
            level: Math.floor(Math.random() * 20) + 1,
            xp: Math.floor(Math.random() * 5000),
            streak: Math.floor(Math.random() * 30),
            joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastActive: new Date().toISOString(),
            preferences: {
              theme: "dark",
              notifications: true,
              memeMode: false,
              difficulty: "intermediate",
              learningPath: ["arrays", "linked-lists", "trees"],
            },
            stats: {
              problemsSolved: Math.floor(Math.random() * 100),
              quizzesTaken: Math.floor(Math.random() * 50),
              studyTimeMinutes: Math.floor(Math.random() * 10000),
              conceptsCompleted: Math.floor(Math.random() * 20),
              averageScore: Math.floor(Math.random() * 40) + 60,
              bestStreak: Math.floor(Math.random() * 50),
            },
          }
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : "Login failed" })
          throw error
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call with validation
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              if (name.length < 2) {
                reject(new Error("Name must be at least 2 characters"))
              } else if (!email.includes("@")) {
                reject(new Error("Invalid email format"))
              } else if (password.length < 6) {
                reject(new Error("Password must be at least 6 characters"))
              } else {
                resolve(true)
              }
            }, 1000)
          })

          const mockUser: User = {
            id: Date.now().toString(),
            name,
            email,
            level: 1,
            xp: 0,
            streak: 0,
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            preferences: {
              theme: "dark",
              notifications: true,
              memeMode: false,
              difficulty: "beginner",
              learningPath: [],
            },
            stats: {
              problemsSolved: 0,
              quizzesTaken: 0,
              studyTimeMinutes: 0,
              conceptsCompleted: 0,
              averageScore: 0,
              bestStreak: 0,
            },
          }
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : "Registration failed" })
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates, lastActive: new Date().toISOString() } })
        }
      },

      updateStats: (stats: Partial<User["stats"]>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, stats: { ...user.stats, ...stats } } })
        }
      },

      addXP: (amount: number) => {
        const { user } = get()
        if (user) {
          const newXP = user.xp + amount
          const newLevel = Math.floor(newXP / 1000) + 1
          const leveledUp = newLevel > user.level

          set({
            user: {
              ...user,
              xp: newXP,
              level: newLevel,
              lastActive: new Date().toISOString(),
            },
          })

          // Add level up notification
          if (leveledUp) {
            const uiStore = useUIStore.getState()
            uiStore.addNotification({
              type: "success",
              title: "Level Up!",
              message: `Congratulations! You've reached level ${newLevel}!`,
            })
          }
        }
      },

      updateStreak: () => {
        const { user } = get()
        if (user) {
          const lastActive = new Date(user.lastActive)
          const today = new Date()
          const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

          let newStreak = user.streak
          if (daysDiff === 1) {
            newStreak += 1
          } else if (daysDiff > 1) {
            newStreak = 1
          }

          set({
            user: {
              ...user,
              streak: newStreak,
              stats: {
                ...user.stats,
                bestStreak: Math.max(user.stats.bestStreak, newStreak),
              },
              lastActive: new Date().toISOString(),
            },
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Progress Store
export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: [],
      achievements: generateMockAchievements(),
      quizResults: [],
      submissions: [],
      learningPaths: [],
      studySessions: [],
      currentSession: null,

      updateProgress: (conceptId: string, updates: Partial<Progress>) => {
        const { progress } = get()
        const existingIndex = progress.findIndex((p) => p.conceptId === conceptId)

        if (existingIndex >= 0) {
          const updated = [...progress]
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...updates,
            lastAccessed: new Date().toISOString(),
          }
          set({ progress: updated })
        } else {
          const newProgress: Progress = {
            conceptId,
            conceptName: updates.conceptName || "",
            completed: false,
            progress: 0,
            timeSpent: 0,
            lastAccessed: new Date().toISOString(),
            attempts: 0,
            mastery: "beginner",
            weakAreas: [],
            strongAreas: [],
            ...updates,
          }
          set({ progress: [...progress, newProgress] })
        }

        // Check for achievements
        setTimeout(() => get().checkAchievements(), 100)
      },

      addQuizResult: (result: QuizResult) => {
        const { quizResults } = get()
        set({ quizResults: [...quizResults, result] })

        // Update user stats
        const authStore = useAuthStore.getState()
        if (authStore.user) {
          const newStats = {
            ...authStore.user.stats,
            quizzesTaken: authStore.user.stats.quizzesTaken + 1,
            averageScore: Math.round(
              (authStore.user.stats.averageScore * authStore.user.stats.quizzesTaken +
                (result.score / result.totalQuestions) * 100) /
                (authStore.user.stats.quizzesTaken + 1),
            ),
          }
          authStore.updateStats(newStats)

          // Add XP based on performance
          const xpGained = Math.round((result.score / result.totalQuestions) * 100)
          authStore.addXP(xpGained)
        }

        setTimeout(() => get().checkAchievements(), 100)
      },

      addSubmission: (submission: Submission) => {
        set((state) => ({ submissions: [...state.submissions, submission] }))

        // Update user stats if accepted
        if (submission.status === "Accepted") {
          const authStore = useAuthStore.getState()
          if (authStore.user) {
            const newStats = {
              ...authStore.user.stats,
              problemsSolved: authStore.user.stats.problemsSolved + 1,
            }
            authStore.updateStats(newStats)
            authStore.addXP(50) // Base XP for solving a problem
          }
        }

        setTimeout(() => get().checkAchievements(), 100)
      },

      unlockAchievement: (achievementId: string) => {
        const { achievements } = get()
        const achievement = achievements.find((a) => a.id === achievementId)

        if (!achievement || achievement.unlockedAt) return

        const updated = achievements.map((a) =>
          a.id === achievementId ? { ...a, unlockedAt: new Date().toISOString() } : a,
        )
        set({ achievements: updated })

        // Add XP reward
        const authStore = useAuthStore.getState()
        authStore.addXP(achievement.xpReward)

        // Add notification
        const uiStore = useUIStore.getState()
        uiStore.addNotification({
          type: "achievement",
          title: "Achievement Unlocked!",
          message: `${achievement.name}: ${achievement.description}`,
        })
      },

      getConceptProgress: (conceptId: string) => {
        const { progress } = get()
        return progress.find((p) => p.conceptId === conceptId)
      },

      getTotalXP: () => {
        const { quizResults, submissions } = get()
        const quizXP = quizResults.reduce((total, result) => total + (result.score / result.totalQuestions) * 100, 0)
        const submissionXP = submissions.filter((s) => s.status === "Accepted").length * 50
        return quizXP + submissionXP
      },

      getStreakDays: () => {
        const authStore = useAuthStore.getState()
        return authStore.user?.streak || 0
      },

      startStudySession: (conceptId: string) => {
        const session: StudySession = {
          id: Date.now().toString(),
          conceptId,
          startTime: new Date().toISOString(),
          duration: 0,
          activities: [],
          focusScore: 100,
          notes: "",
        }
        set({ currentSession: session })
      },

      endStudySession: () => {
        const { currentSession, studySessions } = get()
        if (currentSession) {
          const endTime = new Date().toISOString()
          const duration = new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()

          const completedSession = {
            ...currentSession,
            endTime,
            duration: Math.round(duration / 1000 / 60), // minutes
          }

          set({
            studySessions: [...studySessions, completedSession],
            currentSession: null,
          })

          // Update user stats
          const authStore = useAuthStore.getState()
          if (authStore.user) {
            const newStats = {
              ...authStore.user.stats,
              studyTimeMinutes: authStore.user.stats.studyTimeMinutes + completedSession.duration,
            }
            authStore.updateStats(newStats)
          }
        }
      },

      updateSessionActivity: (activity: StudySession["activities"][0]) => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            activities: [...currentSession.activities, activity],
          }
          set({ currentSession: updatedSession })
        }
      },

      getRecommendations: () => {
        const { progress } = get()
        const authStore = useAuthStore.getState()

        if (!authStore.user) return []

        // Simple recommendation logic based on weak areas and difficulty preference
        const weakAreas = progress.flatMap((p) => p.weakAreas)
        // const difficulty = authStore.user.preferences.difficulty

        // Return concept IDs based on analysis
        return ["arrays", "linked-lists", "trees", "algorithms"].filter(
          (concept) => weakAreas.includes(concept) || !progress.find((p) => p.conceptId === concept),
        )
      },

      getWeakAreas: () => {
        const { progress } = get()
        return progress.filter((p) => p.progress < 70 || p.weakAreas.length > 0).flatMap((p) => p.weakAreas)
      },

      getStudyStats: () => {
        const { studySessions } = get()
        const totalTime = studySessions.reduce((acc, session) => acc + session.duration, 0)
        const averageSession = studySessions.length > 0 ? totalTime / studySessions.length : 0
        const focusScore =
          studySessions.length > 0
            ? studySessions.reduce((acc, session) => acc + session.focusScore, 0) / studySessions.length
            : 0

        return {
          totalTime,
          averageSession,
          focusScore,
          productivity: Math.min(100, (focusScore + (averageSession > 30 ? 20 : 0)) * 0.8),
        }
      },

      checkAchievements: () => {
        const { achievements, quizResults } = get()
        const authStore = useAuthStore.getState()

        if (!authStore.user) return

        achievements.forEach((achievement) => {
          if (achievement.unlockedAt) return // Already unlocked

          let shouldUnlock = true

          achievement.requirements.forEach((req) => {
            switch (req.type) {
              case "problems_solved":
                req.current = authStore.user!.stats.problemsSolved
                if (req.current < req.value) shouldUnlock = false
                break
              case "perfect_quizzes":
                req.current = quizResults.filter((q) => q.score === q.totalQuestions).length
                if (req.current < req.value) shouldUnlock = false
                break
              case "streak_days":
                req.current = authStore.user!.streak
                if (req.current < req.value) shouldUnlock = false
                break
              case "concepts_mastered":
                const { progress } = get()
                req.current = progress.filter((p) => p.mastery === "expert").length
                if (req.current < req.value) shouldUnlock = false
                break
            }
          })

          if (shouldUnlock) {
            get().unlockAchievement(achievement.id)
          }
        })
      },
    }),
    {
      name: "progress-storage",
    },
  ),
)

// Problems Store
export const useProblemsStore = create<ProblemsState>((set, get) => ({
  problems: [],
  filteredProblems: [],
  filters: {
    difficulty: [],
    category: [],
    status: [],
    tags: [],
    companies: [],
  },
  searchQuery: "",
  sortBy: "title",
  sortOrder: "asc",
  isLoading: false,
  error: null,

  setProblems: (problems: Problem[]) => {
    set({ problems, filteredProblems: problems, isLoading: false, error: null })
  },

  setFilters: (newFilters: Partial<ProblemsState["filters"]>) => {
    const { filters } = get()
    const updated = { ...filters, ...newFilters }
    set({ filters: updated })
    get().applyFilters()
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
    get().applyFilters()
  },

  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => {
    set({ sortBy: sortBy as ProblemsState["sortBy"], sortOrder })
    get().applyFilters()
  },

  applyFilters: () => {
    const { problems, filters, searchQuery, sortBy, sortOrder } = get()
    let filtered = [...problems]

    try {
      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(
          (problem) =>
            problem.title.toLowerCase().includes(query) ||
            problem.description.toLowerCase().includes(query) ||
            problem.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            problem.companies.some((company) => company.toLowerCase().includes(query)),
        )
      }

      // Apply filters
      if (filters.difficulty.length > 0) {
        filtered = filtered.filter((problem) => filters.difficulty.includes(problem.difficulty))
      }

      if (filters.category.length > 0) {
        filtered = filtered.filter((problem) => filters.category.includes(problem.category))
      }

      if (filters.tags.length > 0) {
        filtered = filtered.filter((problem) => problem.tags.some((tag) => filters.tags.includes(tag)))
      }

      if (filters.companies.length > 0) {
        filtered = filtered.filter((problem) =>
          problem.companies.some((company) => filters.companies.includes(company)),
        )
      }

      // Apply status filter
      if (filters.status.length > 0) {
        // const progressStore = useProgressStore.getState()
        filtered = filtered.filter(() => {
          // const submission = progressStore.submissions.find((s) => s.problemId === problem.id)
          const status = "Todo" // Simplified for demo
          return filters.status.includes(status)
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue: string | number = a[sortBy as keyof Problem] as string | number
        let bValue: string | number = b[sortBy as keyof Problem] as string | number

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })

      set({ filteredProblems: filtered, error: null })
    } catch {
      set({ error: "Failed to apply filters" })
    }
  },

  likeProblem: (problemId: string) => {
    const { problems } = get()
    const updated = problems.map((problem) =>
      problem.id === problemId ? { ...problem, likes: problem.likes + 1 } : problem,
    )
    set({ problems: updated })
    get().applyFilters()
  },

  dislikeProblem: (problemId: string) => {
    const { problems } = get()
    const updated = problems.map((problem) =>
      problem.id === problemId ? { ...problem, dislikes: problem.dislikes + 1 } : problem,
    )
    set({ problems: updated })
    get().applyFilters()
  },

  getRecommendedProblems: () => {
    const { problems } = get()
    const authStore = useAuthStore.getState()
    const progressStore = useProgressStore.getState()

    if (!authStore.user) return problems.slice(0, 5)

    try {
      // Get user's difficulty preference and solved problems
      const userDifficulty = authStore.user.preferences.difficulty
      const solvedProblems = progressStore.submissions.filter((s) => s.status === "Accepted").map((s) => s.problemId)

      // Filter unsolved problems matching user's level
      const difficultyMap = {
        beginner: ["Easy"],
        intermediate: ["Easy", "Medium"],
        advanced: ["Medium", "Hard"],
      }

      return problems
        .filter((p) => !solvedProblems.includes(p.id))
        .filter((p) => difficultyMap[userDifficulty].includes(p.difficulty))
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10)
    } catch {
      return problems.slice(0, 5)
    }
  },

  getProblemsByDifficulty: (difficulty: string) => {
    const { problems } = get()
    return problems.filter((p) => p.difficulty === difficulty)
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },
}))

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      memeMode: false,
      darkMode: true,
      notifications: [],
      activeModal: null,
      loading: {},

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      setMemeMode: (enabled: boolean) => {
        set({ memeMode: enabled })
      },

      setDarkMode: (enabled: boolean) => {
        set({ darkMode: enabled })
      },

      addNotification: (notification) => {
        const { notifications } = get()
        const newNotification = {
          ...notification,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          read: false,
        }
        set({ notifications: [newNotification, ...notifications.slice(0, 49)] }) // Keep max 50 notifications
      },

      markNotificationRead: (id: string) => {
        const { notifications } = get()
        const updated = notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        )
        set({ notifications: updated })
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      setActiveModal: (modal: string | null) => {
        set({ activeModal: modal })
      },

      setLoading: (key: string, loading: boolean) => {
        const { loading: currentLoading } = get()
        set({ loading: { ...currentLoading, [key]: loading } })
      },

      isLoading: (key: string) => {
        const { loading } = get()
        return loading[key] || false
      },
    }),
    {
      name: "ui-storage",
    },
  ),
)

// Initialize problems data
if (typeof window !== "undefined") {
  setTimeout(() => {
    const problemsStore = useProblemsStore.getState()
    if (problemsStore.problems.length === 0) {
      problemsStore.setProblems(generateMockProblems())
    }
  }, 100)
}
