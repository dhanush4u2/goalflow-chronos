import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
  category: "health" | "productivity" | "learning" | "fitness" | "other";
}

interface HabitFormProps {
  habit?: Habit;
  onSave: (habit: Omit<Habit, 'id'>) => void;
  onCancel: () => void;
}

const iconOptions = [
  "💧", "🏃‍♂️", "📚", "🧘‍♀️", "💪", "🎯", "✅", "📝", "🎨", "🍎", "💻", "🎵"
];

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "");
  const [icon, setIcon] = useState(habit?.icon || "✅");
  const [category, setCategory] = useState<Habit["category"]>(habit?.category || "other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    const habitData: Omit<Habit, 'id'> = {
      name: name.trim(),
      icon,
      category,
      streak: habit?.streak || 0,
      completed: habit?.completed || false,
    };

    onSave(habitData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{habit ? "Edit Habit" : "Create New Habit"}</CardTitle>
        <CardDescription>
          {habit ? "Update your habit details" : "Set up a new daily habit to track"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((iconOption) => (
                  <SelectItem key={iconOption} value={iconOption}>
                    <span className="text-lg">{iconOption}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: Habit["category"]) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-gradient-primary hover:shadow-glow">
              {habit ? "Update Habit" : "Create Habit"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}