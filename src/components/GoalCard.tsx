import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Target, Trophy, Flame, CheckCircle2, XCircle, PlayCircle, MoreHorizontal, Edit, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "monthly" | "custom";
  status: "active" | "completed" | "failed" | "pending";
  startDate: string;
  endDate: string;
  points: number;
  skills: string[];
  progress: number;
  daysLeft?: number;
}

interface GoalCardProps {
  goal: Goal;
  onStatusChange?: (goalId: string, status: Goal["status"]) => void;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  className?: string;
}

export function GoalCard({ goal, onStatusChange, onEdit, onDelete, className }: GoalCardProps) {
  const getStatusIcon = () => {
    switch (goal.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "active":
        return <PlayCircle className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (goal.status) {
      case "completed":
        return <Badge variant="success" className="shadow-success">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "active":
        return <Badge variant="default">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{goal.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(goal)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Goal
                  </DropdownMenuItem>
                )}
                {goal.status !== "active" && onStatusChange && (
                  <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Goal
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(goal.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Goal
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          {goal.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {goal.status === "active" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        )}

        {/* Goal Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-accent font-medium">{goal.points} pts</span>
          </div>
        </div>

        {/* Days Left */}
        {goal.daysLeft !== undefined && goal.status === "active" && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-warning font-medium">
              {goal.daysLeft > 0 ? `${goal.daysLeft} days left` : "Due today!"}
            </span>
          </div>
        )}

        {/* Skills */}
        {goal.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goal.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {goal.status === "active" && onStatusChange && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(goal.id, "completed")}
              className="bg-gradient-success hover:shadow-success"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(goal.id, "failed")}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Mark Failed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}