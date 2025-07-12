import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, ThumbsUp, Star, Award, Calendar, MapPin, Link as LinkIcon, Edit } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { QuestionCard } from "@/components/questions/QuestionCard";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const userProfile = {
    name: "Sarah Chen",
    username: "sarahchen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    bio: "Full-stack developer passionate about React, TypeScript, and building scalable web applications. Always learning and sharing knowledge with the community.",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    joinDate: "March 2022",
    reputation: 2845,
    badges: {
      gold: 2,
      silver: 15,
      bronze: 34
    },
    stats: {
      questions: 28,
      answers: 156,
      views: 45000,
      upvotes: 892
    }
  };

  const mockQuestions = [
    {
      id: 1,
      title: "How to implement JWT authentication in React with TypeScript?",
      excerpt: "I'm trying to set up JWT authentication in my React TypeScript project...",
      tags: ["react", "typescript", "jwt"],
      author: userProfile,
      votes: 24,
      answers: 7,
      views: 1234,
      timeAgo: "2 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 2,
      title: "Best practices for React component composition",
      excerpt: "What are the recommended patterns for composing React components...",
      tags: ["react", "patterns", "composition"],
      author: userProfile,
      votes: 18,
      answers: 12,
      views: 892,
      timeAgo: "1 day ago",
      hasAcceptedAnswer: false
    }
  ];

  const achievements = [
    { name: "Great Question", description: "Question score of 25 or more", count: 3, color: "gold" },
    { name: "Popular Question", description: "Question with 1,000 or more views", count: 8, color: "silver" },
    { name: "Nice Answer", description: "Answer score of 10 or more", count: 25, color: "bronze" },
    { name: "Helpful", description: "First upvote on your answer", count: 45, color: "bronze" },
    { name: "Teacher", description: "Answer score of 1 or more", count: 120, color: "bronze" },
    { name: "Commentator", description: "Left 10 comments", count: 1, color: "bronze" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 mx-auto md:mx-0">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-2xl">{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">{userProfile.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userProfile.location}
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href={userProfile.website} className="text-primary hover:underline">
                    {userProfile.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {userProfile.joinDate}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProfile.reputation.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Reputation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.stats.questions}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.stats.answers}</div>
                  <div className="text-sm text-muted-foreground">Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.stats.views.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Profile Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span>Questions asked</span>
                      </div>
                      <span className="font-semibold">{userProfile.stats.questions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-green-500" />
                        <span>Answers provided</span>
                      </div>
                      <span className="font-semibold">{userProfile.stats.answers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-orange-500" />
                        <span>Upvotes received</span>
                      </div>
                      <span className="font-semibold">{userProfile.stats.upvotes}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                        <div className="text-2xl font-bold">{userProfile.badges.gold}</div>
                        <div className="text-sm text-muted-foreground">Gold</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-400 mx-auto mb-2"></div>
                        <div className="text-2xl font-bold">{userProfile.badges.silver}</div>
                        <div className="text-sm text-muted-foreground">Silver</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full bg-amber-600 mx-auto mb-2"></div>
                        <div className="text-2xl font-bold">{userProfile.badges.bronze}</div>
                        <div className="text-sm text-muted-foreground">Bronze</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockQuestions.slice(0, 2).map((question) => (
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="answers" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Answers will be displayed here once the answer system is implemented.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-6 h-6 rounded-full ${
                          achievement.color === 'gold' ? 'bg-yellow-500' :
                          achievement.color === 'silver' ? 'bg-gray-400' :
                          'bg-amber-600'
                        }`}></div>
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{achievement.count}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;