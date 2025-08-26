import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { GoalForm } from "./GoalForm";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  // Calculate stats from actual goals
  const stats = {
    totalPoints: goals.reduce((sum, goal) => sum + (goal.status === "completed" ? goal.points : 0), 0),
    activeGoals: goals.filter(g => g.status === "active").length,
    completedGoals: goals.filter(g => g.status === "completed").length,
    currentStreak: 3, // TODO: Calculate actual streak
    skillsLearned: [...new Set(goals.flatMap(g => g.skills))].length,
    level: Math.floor(goals.reduce((sum, goal) => sum + (goal.status === "completed" ? goal.points : 0), 0) / 500),
    nextLevelPoints: 500 - (goals.reduce((sum, goal) => sum + (goal.status === "completed" ? goal.points : 0), 0) % 500)
  };

  const handleStatusChange = (goalId: string, status: Goal["status"]) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, status, progress: status === "completed" ? 100 : goal.progress }
        : goal
    ));
    
    toast({
      title: `Goal ${status}!`,
      description: `Your goal has been marked as ${status}.`,
    });
  };

  const handleSaveGoal = (goalData: Omit<Goal, 'id'>) => {
    if (editingGoal) {
      setGoals(prev => prev.map(goal =>
        goal.id === editingGoal.id
          ? { ...goal, ...goalData }
          : goal
      ));
      toast({
        title: "Goal updated!",
        description: "Your goal has been successfully updated.",
      });
    } else {
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
      };
      setGoals(prev => [...prev, newGoal]);
      toast({
        title: "Goal created!",
        description: "Your new goal has been added successfully.",
      });
    }
    
    setShowGoalForm(false);
    setEditingGoal(undefined);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "Your goal has been removed.",
    });
  };

  const handleNewGoal = () => {
    setEditingGoal(undefined);
    setShowGoalForm(true);
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
        <Button onClick={handleNewGoal} className="bg-gradient-primary hover:shadow-glow">
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
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-white/80">
              Level {stats.level} • {stats.nextLevelPoints} to next
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedGoals} completed total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.currentStreak}</div>
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
            <div className="text-2xl font-bold text-success">{stats.skillsLearned}</div>
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
            Level {stats.level} • {stats.nextLevelPoints} points until Level {stats.level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(500 - stats.nextLevelPoints) / 500 * 100} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{stats.totalPoints} points</span>
            <span>{stats.totalPoints + stats.nextLevelPoints} points</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={handleNewGoal}>
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

      {/* Goals */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {goals.length === 0 ? "Your Goals" : "Your Goals"}
          </h2>
          <Button variant="outline" onClick={handleNewGoal}>
            Add Goal
          </Button>
        </div>
        
        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No goals yet</CardTitle>
              <CardDescription className="mb-4">
                Start your journey by creating your first goal!
              </CardDescription>
              <Button onClick={handleNewGoal} className="bg-gradient-primary hover:shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onStatusChange={handleStatusChange}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}
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

      {/* Goal Form Dialog */}
      <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          </DialogHeader>
          <GoalForm
            goal={editingGoal}
            onSave={handleSaveGoal}
            onCancel={() => setShowGoalForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}