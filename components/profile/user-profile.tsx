"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore, useProgressStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Settings, Trophy, Target, Clock, Brain, Zap, TrendingUp, Award } from "lucide-react"

export function UserProfile() {
  const { user, updateProfile, logout } = useAuthStore()
  const { achievements, getStudyStats, progress } = useProgressStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const studyStats = getStudyStats()
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt)
  const totalAchievements = achievements.length

  if (!user) return null

  const handleSave = () => {
    updateProfile(editForm)
    setIsEditing(false)
  }

  const handlePreferenceChange = (key: string, value: string | boolean | number) => {
    updateProfile({
      preferences: {
        ...user.preferences,
        [key]: value,
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-slate-400">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                      Level {user.level}
                    </Badge>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">{user.xp} XP</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{user.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <Button onClick={logout} variant="outline" className="border-slate-600 bg-transparent">
                  Sign Out
                </Button>
              </div>

              {/* XP Progress to next level */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{user.xp % 1000}/1000 XP</span>
                </div>
                <Progress value={(user.xp % 1000) / 10} className="h-2" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Problems Solved</p>
                    <p className="text-2xl font-bold text-white">{user.stats.problemsSolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-slate-400">Quizzes Taken</p>
                    <p className="text-2xl font-bold text-white">{user.stats.quizzesTaken}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-400">Study Time</p>
                    <p className="text-2xl font-bold text-white">{Math.round(user.stats.studyTimeMinutes / 60)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Avg Score</p>
                    <p className="text-2xl font-bold text-white">{user.stats.averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.slice(0, 5).map((item) => (
                  <div
                    key={item.conceptId}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{item.conceptName}</p>
                      <p className="text-sm text-slate-400">
                        Last accessed: {new Date(item.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{item.progress}% complete</p>
                      <Badge variant={item.completed ? "default" : "secondary"} className="text-xs">
                        {item.mastery}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>
                  Achievements ({unlockedAchievements.length}/{totalAchievements})
                </span>
              </CardTitle>
              <CardDescription>Your learning milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlockedAt
                        ? "bg-slate-700/50 border-slate-600"
                        : "bg-slate-800/30 border-slate-700 opacity-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{achievement.name}</h3>
                        <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              achievement.rarity === "legendary"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : achievement.rarity === "epic"
                                  ? "bg-purple-600/20 text-purple-400"
                                  : achievement.rarity === "rare"
                                    ? "bg-blue-600/20 text-blue-400"
                                    : "bg-slate-600/20 text-slate-400"
                            }`}
                          >
                            {achievement.rarity}
                          </Badge>
                          <span className="text-xs text-slate-400">+{achievement.xpReward} XP</span>
                        </div>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-green-400 mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress</CardTitle>
              <CardDescription>Track your progress across different concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.map((item) => (
                  <div key={item.conceptId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{item.conceptName}</h3>
                      <span className="text-sm text-slate-400">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Mastery: {item.mastery}</span>
                      <span>Time spent: {Math.round(item.timeSpent / 60)}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Name</label>
                    <p className="text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Notifications</h3>
                  <p className="text-sm text-slate-400">Receive learning reminders and updates</p>
                </div>
                <Switch
                  checked={user.preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Meme Mode</h3>
                  <p className="text-sm text-slate-400">Add humor to explanations and examples</p>
                </div>
                <Switch
                  checked={user.preferences.memeMode}
                  onCheckedChange={(checked) => handlePreferenceChange("memeMode", checked)}
                />
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">Difficulty Preference</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <Button
                      key={level}
                      variant={user.preferences.difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange("difficulty", level)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
