"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProblemsStore, useProgressStore, useAuthStore } from "@/lib/store"
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ThumbsUp,
  ThumbsDown,
  Users,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export function ProblemList() {
  const {
    filteredProblems,
    filters,
    searchQuery,
    sortBy,
    sortOrder,
    isLoading,
    error,
    setSearchQuery,
    setFilters,
    setSorting,
    likeProblem,
    dislikeProblem,
  } = useProblemsStore()

  const { submissions } = useProgressStore()
  const { isAuthenticated } = useAuthStore()
  const [showFilters, setShowFilters] = useState(false)

  const difficultyColors = {
    Easy: "bg-green-600/20 text-green-400 border-green-600/30",
    Medium: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    Hard: "bg-red-600/20 text-red-400 border-red-600/30",
  }

  const getStatusIcon = (problemId: string) => {
    const submission = submissions.find((s) => s.problemId === problemId)
    if (submission?.status === "Accepted") {
      return <CheckCircle className="h-4 w-4 text-green-400" />
    } else if (submission) {
      return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
    return <Circle className="h-4 w-4 text-slate-400" />
  }

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const currentFilter = filters[filterType as keyof typeof filters] || []
    const newFilter = checked ? [...currentFilter, value] : currentFilter.filter((item) => item !== value)

    setFilters({ [filterType]: newFilter })
  }

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      category: [],
      status: [],
      tags: [],
      companies: [],
    })
    setSearchQuery("")
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 mb-2">Error loading problems</div>
          <p className="text-slate-400">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Problems</h1>
          <p className="text-slate-400">{filteredProblems.length} problems available</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="border-slate-600">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Sort */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={(value) => setSorting(value, sortOrder)}>
                <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="acceptance">Acceptance</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSorting(sortBy, sortOrder === "asc" ? "desc" : "asc")}
                className="border-slate-600"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Difficulty Filter */}
              <div>
                <h3 className="font-medium text-white mb-2">Difficulty</h3>
                <div className="space-y-2">
                  {["Easy", "Medium", "Hard"].map((difficulty) => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${difficulty}`}
                        checked={filters.difficulty.includes(difficulty)}
                        onCheckedChange={(checked) => handleFilterChange("difficulty", difficulty, checked as boolean)}
                      />
                      <label htmlFor={`difficulty-${difficulty}`} className="text-sm text-slate-300 cursor-pointer">
                        {difficulty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-medium text-white mb-2">Category</h3>
                <div className="space-y-2">
                  {["Array", "String", "Linked List", "Tree", "Graph", "Dynamic Programming"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category.includes(category)}
                        onCheckedChange={(checked) => handleFilterChange("category", category, checked as boolean)}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-slate-300 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="font-medium text-white mb-2">Status</h3>
                <div className="space-y-2">
                  {["Solved", "Attempted", "Todo"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => handleFilterChange("status", status, checked as boolean)}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm text-slate-300 cursor-pointer">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problems List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {isAuthenticated && getStatusIcon(problem.id)}
                      <Link
                        href={`/problems/${problem.id}`}
                        className="font-medium text-white hover:text-blue-400 transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <Badge className={`text-xs ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</Badge>
                    </div>

                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{problem.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-slate-700/50">
                          {tag}
                        </Badge>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="text-xs text-slate-400">+{problem.tags.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{problem.acceptance}% acceptance</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{problem.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-3 w-3" />
                        <span>{problem.dislikes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeProblem(problem.id)}
                        className="h-8 w-8 p-0 hover:bg-green-600/20"
                      >
                        <ThumbsUp className="h-3 w-3 text-green-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dislikeProblem(problem.id)}
                        className="h-8 w-8 p-0 hover:bg-red-600/20"
                      >
                        <ThumbsDown className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>

                    <Link href={`/problems/${problem.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Solve
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProblems.length === 0 && !isLoading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="text-slate-400 mb-2">No problems found</div>
            <p className="text-slate-500">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
