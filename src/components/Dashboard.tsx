import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Zap,
  Plus,
  Award,
  Clock
} from "lucide-react";
import { GoalCard, type Goal } from "./GoalCard";

// Mock data - in real app this would come from state management/API
const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Learn React Advanced Patterns",
    description: "Master hooks, context, and performance optimization techniques",
    category: "monthly",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    points: 150,
    skills: ["React", "JavaScript", "Frontend"],
    progress: 65,
    daysLeft: 12
  },
  {
    id: "2", 
    title: "Daily Code Practice",
    description: "Solve at least 2 DSA problems daily",
    category: "daily",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    points: 300,
    skills: ["DSA", "Problem Solving"],
    progress: 80,
    daysLeft: 0
  },
  {
    id: "3",
    title: "Build MVP for Startup Idea",
    description: "Create a functional prototype for the new project",
    category: "custom",
    status: "completed",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    points: 500,
    skills: ["Entrepreneurship", "Product Development", "MVP"],
    progress: 100
  }
];

const mockStats = {
  totalPoints: 1250,
  activeGoals: 5,
  completedGoals: 12,
  currentStreak: 8,
  skillsLearned: 15,
  level: 3,
  nextLevelPoints: 500
};

export function Dashboard() {
  const handleStatusChange = (goalId: string, status: Goal["status"]) => {
    console.log(`Goal ${goalId} status changed to ${status}`);
    // In real app, this would update the goal status
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Goal Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your progress, build skills, and achieve your dreams
          </p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPoints}</div>
            <p className="text-xs text-white/80">
              Level {mockStats.level} • {mockStats.nextLevelPoints} to next
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.completedGoals} completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Learned</CardTitle>
            <BookOpen className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mockStats.skillsLearned}</div>
            <p className="text-xs text-muted-foreground">
              across all categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Level Progress
          </CardTitle>
          <CardDescription>
            Level {mockStats.level} • {mockStats.nextLevelPoints} points until Level {mockStats.level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={75} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{mockStats.totalPoints} points</span>
            <span>{mockStats.totalPoints + mockStats.nextLevelPoints} points</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Create Goal</CardTitle>
            <CardDescription>Set a new personal or professional goal</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle>View Timeline</CardTitle>
            <CardDescription>See your goal history and upcoming targets</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-white" />
            </div>
            <CardTitle>Skills Portfolio</CardTitle>
            <CardDescription>Review your skill development progress</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Goals */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Goals</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Today's Habits
          </CardTitle>
          <CardDescription>
            Keep your daily streak going!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Drink 8 glasses of water</span>
              <Badge variant="success">6/8</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>30 minutes exercise</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Read for 20 minutes</span>
              <Badge variant="success">Done</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}