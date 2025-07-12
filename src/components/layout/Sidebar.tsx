import { useState } from "react";
import { 
  Home, 
  TrendingUp, 
  MessageCircleQuestion, 
  Star, 
  Clock, 
  Users, 
  Tag,
  ChevronRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", active: true, count: null },
  { icon: TrendingUp, label: "Trending", active: false, count: 12 },
  { icon: MessageCircleQuestion, label: "Unanswered", active: false, count: 45 },
  { icon: Star, label: "Most Voted", active: false, count: null },
  { icon: Clock, label: "Recent", active: false, count: 8 },
  { icon: Users, label: "Following", active: false, count: 3 },
];

const popularTags = [
  { name: "React", count: 1234, color: "bg-blue-500" },
  { name: "JavaScript", count: 2341, color: "bg-yellow-500" },
  { name: "TypeScript", count: 876, color: "bg-blue-600" },
  { name: "Node.js", count: 654, color: "bg-green-500" },
  { name: "Python", count: 543, color: "bg-blue-400" },
  { name: "Next.js", count: 432, color: "bg-gray-800" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [selectedFilter, setSelectedFilter] = useState("latest");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 transform border-r border-border bg-background transition-transform duration-200 ease-in-out md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Filter Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Filter Questions</span>
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="most-voted">Most Voted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between h-10",
                    item.active && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.count}
                    </Badge>
                  )}
                  {item.active && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              ))}
            </div>

            {/* Popular Tags */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Popular Tags
              </h3>
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                      <span className="text-sm font-medium">{tag.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tag.count}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-3 text-primary">
                View all tags
              </Button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-4 border-t border-border">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">New to StackIt?</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Join our community and start sharing knowledge!
              </p>
              <Button size="sm" className="w-full ai-button">
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}