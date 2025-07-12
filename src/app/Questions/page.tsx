import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Plus, MessageCircle, ThumbsUp, Eye, Clock, TrendingUp, Users, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { QuestionCard } from "@/components/questions/QuestionCard";

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockQuestions = [
    {
      id: 1,
      title: "How to implement JWT authentication in React with TypeScript?",
      excerpt: "I'm trying to set up JWT authentication in my React TypeScript project, but I'm having issues with token storage and validation...",
      tags: ["react", "typescript", "jwt", "authentication"],
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
        reputation: 2845
      },
      votes: 24,
      answers: 7,
      views: 1234,
      timeAgo: "2 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 2,
      title: "Best practices for handling state management in large Next.js applications",
      excerpt: "As my Next.js application grows, I'm finding state management becoming increasingly complex. What are the recommended patterns...",
      tags: ["nextjs", "state-management", "zustand", "react-query"],
      author: {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        reputation: 4231
      },
      votes: 18,
      answers: 12,
      views: 892,
      timeAgo: "4 hours ago",
      hasAcceptedAnswer: false
    },
    {
      id: 3,
      title: "TypeScript generic constraints with conditional types",
      excerpt: "I'm working with complex TypeScript generics and need to understand how to properly use conditional types with constraints...",
      tags: ["typescript", "generics", "conditional-types"],
      author: {
        name: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        reputation: 1876
      },
      votes: 31,
      answers: 5,
      views: 567,
      timeAgo: "6 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 4,
      title: "Optimizing React performance with useMemo and useCallback",
      excerpt: "My React application is experiencing performance issues. I've heard about useMemo and useCallback but I'm not sure when and how to use them effectively...",
      tags: ["react", "performance", "hooks", "optimization"],
      author: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        reputation: 3456
      },
      votes: 15,
      answers: 9,
      views: 2134,
      timeAgo: "8 hours ago",
      hasAcceptedAnswer: false
    },
    {
      id: 5,
      title: "Docker containerization for Node.js microservices architecture",
      excerpt: "I'm setting up a microservices architecture with Node.js and need guidance on the best practices for Docker containerization...",
      tags: ["docker", "nodejs", "microservices", "containerization"],
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        reputation: 5123
      },
      votes: 22,
      answers: 6,
      views: 1567,
      timeAgo: "1 day ago",
      hasAcceptedAnswer: true
    }
  ];

  const trendingTags = [
    { name: "react", count: 12543 },
    { name: "typescript", count: 8765 },
    { name: "nextjs", count: 6432 },
    { name: "nodejs", count: 9876 },
    { name: "javascript", count: 15432 },
    { name: "python", count: 11234 },
    { name: "docker", count: 4321 },
    { name: "aws", count: 3456 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          
          <main className="flex-1 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">All Questions</h1>
                <p className="text-muted-foreground">
                  {mockQuestions.length.toLocaleString()} questions
                </p>
              </div>
              
              <Link to="/ask">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ask Question
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">Newest</Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Unanswered
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Most Voted
              </Button>
            </div>

            <Separator />

            {/* Questions List */}
            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <QuestionCard 
                  key={question.id}
                  id={question.id.toString()}
                  title={question.title}
                  content={question.excerpt}
                  tags={question.tags}
                  author={question.author}
                  stats={{
                    votes: question.votes,
                    answers: question.answers,
                    views: question.views
                  }}
                  createdAt={question.timeAgo}
                  hasAcceptedAnswer={question.hasAcceptedAnswer}
                  isBookmarked={false}
                  userVote={null}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Questions
              </Button>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-80 space-y-6">
            {/* Trending Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Tags</CardTitle>
                <CardDescription>Popular topics this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <Badge key={tag.name} variant="secondary" className="text-xs">
                      {tag.name}
                      <span className="ml-1 text-muted-foreground">
                        {tag.count > 1000 ? `${Math.floor(tag.count / 1000)}k` : tag.count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Questions today</span>
                  </div>
                  <span className="font-semibold">234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Answers posted</span>
                  </div>
                  <span className="font-semibold">1,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Active users</span>
                  </div>
                  <span className="font-semibold">12,345</span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Question */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Featured Question</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">How to build scalable React applications?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A comprehensive guide to structuring and scaling React applications for production...
                </p>
                <Button size="sm" variant="outline">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Questions;