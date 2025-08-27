import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Plus, 
  ArrowRight, 
  MoreVertical,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  priority: "low" | "medium" | "high";
  estimatedDuration: string;
}

export interface SkillWishlistProps {
  onConvertToGoal: (skill: Skill, goalData: { description: string; duration: "weekly" | "monthly" }) => void;
}

export function SkillWishlist({ onConvertToGoal }: SkillWishlistProps) {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [convertingSkill, setConvertingSkill] = useState<Skill | undefined>();
  
  // Form states
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillPriority, setSkillPriority] = useState<"low" | "medium" | "high">("medium");
  const [skillDuration, setSkillDuration] = useState("");
  
  // Convert form states
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDuration, setGoalDuration] = useState<"weekly" | "monthly">("monthly");

  const resetForm = () => {
    setSkillName("");
    setSkillCategory("");
    setSkillDescription("");
    setSkillPriority("medium");
    setSkillDuration("");
  };

  const handleSaveSkill = () => {
    if (!skillName.trim() || !skillCategory.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the skill name and category.",
        variant: "destructive"
      });
      return;
    }

    if (editingSkill) {
      setSkills(prev => prev.map(skill =>
        skill.id === editingSkill.id
          ? { 
              ...skill, 
              name: skillName,
              category: skillCategory,
              description: skillDescription,
              priority: skillPriority,
              estimatedDuration: skillDuration
            }
          : skill
      ));
      toast({
        title: "Skill updated!",
        description: "Your skill has been successfully updated.",
      });
    } else {
      const newSkill: Skill = {
        id: crypto.randomUUID(),
        name: skillName,
        category: skillCategory,
        description: skillDescription,
        priority: skillPriority,
        estimatedDuration: skillDuration
      };
      setSkills(prev => [...prev, newSkill]);
      toast({
        title: "Skill added!",
        description: "Your skill has been added to the wishlist.",
      });
    }
    
    setShowSkillForm(false);
    setEditingSkill(undefined);
    resetForm();
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillCategory(skill.category);
    setSkillDescription(skill.description || "");
    setSkillPriority(skill.priority);
    setSkillDuration(skill.estimatedDuration);
    setShowSkillForm(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
    toast({
      title: "Skill removed",
      description: "The skill has been removed from your wishlist.",
    });
  };

  const handleConvertSkill = (skill: Skill) => {
    setConvertingSkill(skill);
    setGoalDescription(`Learn ${skill.name} - ${skill.description}`);
    setShowConvertDialog(true);
  };

  const handleConfirmConvert = () => {
    if (!convertingSkill || !goalDescription.trim()) return;

    onConvertToGoal(convertingSkill, {
      description: goalDescription,
      duration: goalDuration
    });

    // Remove skill from wishlist
    setSkills(prev => prev.filter(skill => skill.id !== convertingSkill.id));
    
    toast({
      title: "Skill converted to goal!",
      description: "Your skill has been added to your active goals.",
    });
    
    setShowConvertDialog(false);
    setConvertingSkill(undefined);
    setGoalDescription("");
    setGoalDuration("monthly");
  };

  const getPriorityColor = (priority: Skill["priority"]) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50 border-red-200";
      case "medium": return "text-yellow-500 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-500 bg-green-50 border-green-200";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Skill Wishlist
        </h2>
        <Button 
          variant="outline" 
          onClick={() => {
            setEditingSkill(undefined);
            resetForm();
            setShowSkillForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No skills in wishlist</CardTitle>
            <CardDescription className="mb-4">
              Create a stack of skills you'd like to learn and turn them into goals!
            </CardDescription>
            <Button 
              onClick={() => setShowSkillForm(true)}
              className="bg-gradient-primary hover:shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill.id} className="group hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {skill.category}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSkill(skill)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleConvertSkill(skill)}
                        className="text-primary"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Convert to Goal
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {skill.description || "No description provided"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(skill.priority)}
                  >
                    {skill.priority} priority
                  </Badge>
                  {skill.estimatedDuration && (
                    <span className="text-xs text-muted-foreground">
                      ~{skill.estimatedDuration}
                    </span>
                  )}
                </div>
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  onClick={() => handleConvertSkill(skill)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Move to Timeline
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Skill Form Dialog */}
      <Dialog open={showSkillForm} onOpenChange={setShowSkillForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g., React, Machine Learning, Guitar"
              />
            </div>
            <div>
              <Label htmlFor="skillCategory">Category</Label>
              <Input
                id="skillCategory"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                placeholder="e.g., Programming, Music, Language"
              />
            </div>
            <div>
              <Label htmlFor="skillDescription">Description (Optional)</Label>
              <Textarea
                id="skillDescription"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="Brief description of what you want to learn"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="skillPriority">Priority</Label>
              <Select value={skillPriority} onValueChange={(value: "low" | "medium" | "high") => setSkillPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="skillDuration">Estimated Duration</Label>
              <Input
                id="skillDuration"
                value={skillDuration}
                onChange={(e) => setSkillDuration(e.target.value)}
                placeholder="e.g., 3 months, 6 weeks"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveSkill} className="flex-1">
                {editingSkill ? "Update" : "Add"} Skill
              </Button>
              <Button variant="outline" onClick={() => setShowSkillForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert to Goal Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Skill to Goal</DialogTitle>
            <CardDescription>
              Convert "{convertingSkill?.name}" into an active goal
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalDescription">Goal Description</Label>
              <Textarea
                id="goalDescription"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="Describe what you want to achieve"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="goalDuration">Goal Duration</Label>
              <Select value={goalDuration} onValueChange={(value: "weekly" | "monthly") => setGoalDuration(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly Goal</SelectItem>
                  <SelectItem value="monthly">Monthly Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleConfirmConvert} className="flex-1">
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowConvertDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}