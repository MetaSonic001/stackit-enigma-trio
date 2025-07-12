import { useState } from "react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Smile,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Send,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const formatButtons = [
  { icon: Bold, label: "Bold", shortcut: "Ctrl+B" },
  { icon: Italic, label: "Italic", shortcut: "Ctrl+I" },
  { icon: Strikethrough, label: "Strikethrough", shortcut: "Ctrl+Shift+X" },
  { icon: List, label: "Bullet List" },
  { icon: ListOrdered, label: "Numbered List" },
  { icon: Link, label: "Insert Link", shortcut: "Ctrl+K" },
  { icon: Image, label: "Insert Image" },
  { icon: Smile, label: "Insert Emoji" },
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
];

const suggestedTags = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", 
  "HTML", "CSS", "MongoDB", "Express", "Next.js"
];

export default function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleCustomTagAdd = () => {
    if (customTag && !selectedTags.includes(customTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, customTag]);
      setCustomTag("");
    }
  };

  const generateAITags = async () => {
    if (!title && !description) {
      toast({
        title: "Add content first",
        description: "Please add a title and description before generating AI tags.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingTags(true);
    
    // Simulate AI tag generation
    setTimeout(() => {
      const aiSuggestedTags = ["React", "JavaScript", "Authentication", "Security"];
      const newTags = aiSuggestedTags.filter(tag => !selectedTags.includes(tag));
      setSelectedTags([...selectedTags, ...newTags.slice(0, 5 - selectedTags.length)]);
      setIsGeneratingTags(false);
      
      toast({
        title: "AI Tags Generated!",
        description: "Smart tags have been added based on your question content.",
      });
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Question Posted!",
        description: "Your question has been posted successfully.",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Ask a Question</h1>
            <p className="text-muted-foreground mt-1">
              Get help from our community of developers
            </p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-6">
          {/* Title */}
          <div className="mb-6">
            <Label htmlFor="title" className="text-base font-semibold mb-2 block">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="What's your programming question? Be specific."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Be specific and imagine you're asking a question to another person
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <Label htmlFor="description" className="text-base font-semibold mb-2 block">
              Description <span className="text-destructive">*</span>
            </Label>
            
            {/* Toolbar */}
            <div className="border border-border rounded-t-lg bg-muted/30 px-3 py-2">
              <TooltipProvider>
                <div className="flex items-center gap-1 flex-wrap">
                  {formatButtons.map((button, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background"
                        >
                          <button.icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div>{button.label}</div>
                          {button.shortcut && (
                            <div className="text-xs text-muted-foreground">
                              {button.shortcut}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
            
            <Textarea
              id="description"
              placeholder="Describe your problem in detail. Include what you've tried and what you expect to happen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[200px] rounded-t-none border-t-0 resize-none text-base"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Include all the information someone would need to answer your question
            </p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-2 block">
              Tags <span className="text-destructive">*</span>
            </Label>
            
            {/* AI Tag Generation */}
            <div className="mb-4">
              <Button
                onClick={generateAITags}
                disabled={isGeneratingTags}
                className="ai-button"
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingTags ? "Generating..." : "Suggest Tags with AI"}
              </Button>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Tag */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomTagAdd()}
                className="flex-1"
              />
              <Button 
                onClick={handleCustomTagAdd}
                disabled={!customTag || selectedTags.length >= 5}
              >
                Add
              </Button>
            </div>

            {/* Suggested Tags */}
            <div>
              <p className="text-sm font-medium mb-2">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleTagAdd(tag)}
                    disabled={selectedTags.includes(tag) || selectedTags.length >= 5}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              Add up to 5 tags to describe what your question is about
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              By posting your question, you agree to our terms of service and community guidelines.
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !description.trim() || selectedTags.length === 0}
                className="ai-button"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}