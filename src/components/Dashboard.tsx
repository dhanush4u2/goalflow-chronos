import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Clock,
  MoreVertical,
  Check,
  X
} from "lucide-react";
import { GoalCard, type Goal } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { HabitForm, type Habit } from "./HabitForm";
import { SkillWishlist, type Skill } from "./SkillWishlist";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

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

  // Habit management functions
  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completed;
        const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        return { ...habit, completed: newCompleted, streak: newStreak };
      }
      return habit;
    }));
    
    toast({
      title: "Habit updated!",
      description: "Great job staying consistent!",
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    toast({
      title: "Habit deleted",
      description: "Your habit has been removed.",
    });
  };

  const handleNewHabit = () => {
    setEditingHabit(undefined);
    setShowHabitForm(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  const handleSaveHabit = (habitData: Omit<Habit, 'id'>) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prev => prev.map(habit => 
        habit.id === editingHabit.id 
          ? { ...habitData, id: editingHabit.id }
          : habit
      ));
      toast({
        title: "Habit updated!",
        description: "Your habit has been successfully updated.",
      });
    } else {
      // Create new habit
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
      };
      setHabits(prev => [...prev, newHabit]);
      toast({
        title: "Habit created!",
        description: "Your new habit has been added successfully.",
      });
    }
    
    setShowHabitForm(false);
    setEditingHabit(undefined);
  };

  const handleRenewHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: false, streak: 0 }
        : habit
    ));
    
    toast({
      title: "Habit renewed!",
      description: "Your habit has been reset for a fresh start.",
    });
  };

  // Skill conversion function
  const handleConvertSkillToGoal = (skill: Skill, goalData: { description: string; duration: "weekly" | "monthly" }) => {
    const endDate = new Date();
    if (goalData.duration === "weekly") {
      endDate.setDate(endDate.getDate() + 7);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: skill.name,
      description: goalData.description,
      category: goalData.duration === "weekly" ? "weekly" : "monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "active",
      progress: 0,
      points: goalData.duration === "weekly" ? 50 : 200,
      skills: [skill.name]
    };

    setGoals(prev => [...prev, newGoal]);
    
    toast({
      title: "Goal created from skill!",
      description: `${skill.name} has been converted to a ${goalData.duration} goal.`,
    });
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

      {/* Skill Wishlist */}
      <SkillWishlist onConvertToGoal={handleConvertSkillToGoal} />

      {/* Today's Habits */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Today's Habits
          </h2>
          <Button variant="outline" onClick={handleNewHabit}>
            Add Habit
          </Button>
        </div>
        
        {habits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No habits yet</CardTitle>
              <CardDescription className="mb-4">
                Build positive daily habits to achieve your goals!
              </CardDescription>
              <Button onClick={handleNewHabit} className="bg-gradient-primary hover:shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardDescription>
                Keep your daily streak going!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-muted rounded-lg group">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {habit.streak} day streak
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={habit.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleHabit(habit.id)}
                        className={habit.completed ? "bg-gradient-success" : ""}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenewHabit(habit.id)}>
                            Renew/Reset
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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

      {/* Habit Form Dialog */}
      <Dialog open={showHabitForm} onOpenChange={setShowHabitForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          </DialogHeader>
          <HabitForm
            habit={editingHabit}
            onSave={handleSaveHabit}
            onCancel={() => setShowHabitForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}