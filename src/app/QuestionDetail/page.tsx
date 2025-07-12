import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Flag,
  Clock,
  Eye,
  CheckCircle,
  ArrowLeft,
  Send,
  Sparkles,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock question data
const mockQuestion = {
  id: "1",
  title: "How to implement authentication in React with JWT tokens?",
  content: `I'm building a React application and need to implement user authentication using JWT tokens. I want to store the token securely and handle automatic logout when the token expires.

Here's what I've tried so far:

\`\`\`javascript
// Login function
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

However, I'm concerned about:
1. **Security**: Is localStorage safe for storing JWT tokens?
2. **Token expiration**: How do I handle automatic logout?
3. **API calls**: How do I include the token in all API requests?

What's the best approach for implementing this securely?`,
  tags: ["React", "JWT", "Authentication", "Security"],
  author: {
    name: "Sarah Chen",
    avatar: "",
    reputation: 1250,
    joinDate: "Joined 2 years ago"
  },
  stats: {
    votes: 15,
    views: 234
  },
  createdAt: "2 hours ago",
  isBookmarked: false,
  userVote: "up" as const
};

const mockAnswers = [
  {
    id: "1",
    content: `Great question! Here's a comprehensive approach to implement JWT authentication securely in React:

## 1. Secure Token Storage

Instead of localStorage, consider using **httpOnly cookies** for better security:

\`\`\`javascript
// Server-side: Set httpOnly cookie
res.cookie('token', jwt.sign(payload, secret), {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
\`\`\`

## 2. Automatic Token Refresh

Implement a refresh token mechanism:

\`\`\`javascript
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await refreshToken();
            return axios.request(error.config);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
};
\`\`\`

## 3. Protected Routes

Use React Router for route protection:

\`\`\`jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};
\`\`\`

This approach provides better security and user experience compared to localStorage-based solutions.`,
    author: {
      name: "Alex Rodriguez",
      avatar: "",
      reputation: 3450
    },
    stats: {
      votes: 12,
      userVote: "up" as const
    },
    createdAt: "1 hour ago",
    isAccepted: true
  },
  {
    id: "2", 
    content: `I'd like to add to Alex's excellent answer with some additional security considerations:

## Security Best Practices

1. **Token Expiration**: Keep JWT tokens short-lived (15-30 minutes)
2. **Refresh Tokens**: Store refresh tokens securely and rotate them
3. **HTTPS Only**: Never send tokens over HTTP
4. **XSS Protection**: Sanitize all user inputs

## Alternative: React Query + Auth Context

Here's a modern approach using React Query:

\`\`\`jsx
const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      // Token is set as httpOnly cookie by server
    }
  });
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false
  });
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login: loginMutation }}>
      {children}
    </AuthContext.Provider>
  );
};
\`\`\`

This pattern works great with modern React patterns and provides excellent TypeScript support.`,
    author: {
      name: "Emma Wilson",
      avatar: "",
      reputation: 2890
    },
    stats: {
      votes: 8,
      userVote: null as 'up' | 'down' | null
    },
    createdAt: "45 minutes ago",
    isAccepted: false
  }
];

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(mockQuestion.userVote);
  const [voteCount, setVoteCount] = useState(mockQuestion.stats.votes);
  const [bookmarked, setBookmarked] = useState(mockQuestion.isBookmarked);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    if (userVote === voteType) {
      setUserVote(null);
      setVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
    } else {
      const change = userVote === null 
        ? (voteType === 'up' ? 1 : -1)
        : (voteType === 'up' ? 2 : -2);
      setUserVote(voteType);
      setVoteCount(prev => prev + change);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked ? "Question removed from your bookmarks." : "Question saved to your bookmarks.",
    });
  };

  const handleAnswerVote = (answerId: string, voteType: 'up' | 'down') => {
    // Handle answer voting logic
    toast({
      title: "Vote recorded",
      description: `You ${voteType}voted this answer.`,
    });
  };

  const generateAIAnswer = async () => {
    setIsGeneratingAnswer(true);
    
    // Simulate AI answer generation
    setTimeout(() => {
      setNewAnswer(`Based on your question about JWT authentication in React, here's a comprehensive solution:

## Recommended Approach

1. **Use httpOnly cookies** instead of localStorage for better security
2. **Implement token refresh** mechanism for seamless user experience
3. **Create an authentication context** to manage auth state globally

Here's a basic implementation:

\`\`\`javascript
// useAuth hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    setUser(response.data.user);
    // Token is set as httpOnly cookie automatically
  };
  
  return { user, login, logout };
};
\`\`\`

This approach provides better security than localStorage while maintaining good UX.`);
      setIsGeneratingAnswer(false);
      
      toast({
        title: "AI Answer Generated!",
        description: "You can now edit and customize the generated answer.",
      });
    }, 3000);
  };

  const submitAnswer = async () => {
    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please write an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setNewAnswer("");
      toast({
        title: "Answer Posted!",
        description: "Your answer has been posted successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Question */}
            <div className="bg-card border border-card-border rounded-lg p-6 mb-6">
              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "vote-button w-10 h-10",
                      userVote === 'up' && "active-up"
                    )}
                    onClick={() => handleVote('up')}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                  
                  <span className={cn(
                    "font-bold text-lg",
                    voteCount > 0 && "text-upvote",
                    voteCount < 0 && "text-downvote"
                  )}>
                    {voteCount > 0 ? `+${voteCount}` : voteCount}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "vote-button w-10 h-10",
                      userVote === 'down' && "active-down"
                    )}
                    onClick={() => handleVote('down')}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-10 h-10 mt-2",
                      bookmarked && "text-primary"
                    )}
                    onClick={handleBookmark}
                  >
                    <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold mb-4">{mockQuestion.title}</h1>
                  
                  <div className="prose prose-sm max-w-none mb-6">
                    <div className="whitespace-pre-wrap text-foreground">
                      {mockQuestion.content}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mockQuestion.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Question Stats & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{mockQuestion.stats.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{mockQuestion.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-end mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Asked by</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-right">
                          <div className="font-medium">{mockQuestion.author.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {mockQuestion.author.reputation} reputation • {mockQuestion.author.joinDate}
                          </div>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={mockQuestion.author.avatar} />
                          <AvatarFallback className="bg-primary/10">
                            {mockQuestion.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
              </h2>
              
              <div className="space-y-6">
                {mockAnswers.map((answer) => (
                  <div key={answer.id} className="bg-card border border-card-border rounded-lg p-6">
                    <div className="flex gap-6">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "vote-button",
                            answer.stats.userVote === 'up' && "active-up"
                          )}
                          onClick={() => handleAnswerVote(answer.id, 'up')}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        
                        <span className={cn(
                          "font-semibold",
                          answer.stats.votes > 0 && "text-upvote"
                        )}>
                          {answer.stats.votes > 0 ? `+${answer.stats.votes}` : answer.stats.votes}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "vote-button",
                            answer.stats.userVote === 'down' && "active-down"
                          )}
                          onClick={() => handleAnswerVote(answer.id, 'down')}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>

                        {answer.isAccepted && (
                          <CheckCircle className="h-6 w-6 text-accepted mt-2" />
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1 min-w-0">
                        {answer.isAccepted && (
                          <div className="flex items-center gap-2 mb-4 text-accepted">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Accepted Answer</span>
                          </div>
                        )}
                        
                        <div className="prose prose-sm max-w-none mb-6">
                          <div className="whitespace-pre-wrap text-foreground">
                            {answer.content}
                          </div>
                        </div>

                        {/* Answer Actions & Author */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Comment
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">{answer.createdAt}</div>
                              <div className="font-medium">{answer.author.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {answer.author.reputation} reputation
                              </div>
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={answer.author.avatar} />
                              <AvatarFallback className="bg-primary/10">
                                {answer.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <div className="bg-card border border-card-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              
              <div className="mb-4">
                <Button
                  onClick={generateAIAnswer}
                  disabled={isGeneratingAnswer}
                  className="ai-button mb-4"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingAnswer ? "Generating..." : "Generate Answer with AI"}
                </Button>
              </div>
              
              <Textarea
                placeholder="Write your answer here... Use markdown for formatting."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Use markdown for formatting. Be respectful and constructive.
                </div>
                
                <Button
                  onClick={submitAnswer}
                  disabled={isSubmitting || !newAnswer.trim()}
                  className="ai-button"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Posting..." : "Post Answer"}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Related Questions */}
              <div className="bg-card border border-card-border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Related Questions
                </h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <a href="#" className="text-primary hover:underline">
                      React Authentication Best Practices
                    </a>
                    <div className="text-muted-foreground text-xs mt-1">8 answers</div>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-primary hover:underline">
                      JWT Token Storage Security
                    </a>
                    <div className="text-muted-foreground text-xs mt-1">12 answers</div>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-primary hover:underline">
                      Handling Token Expiration
                    </a>
                    <div className="text-muted-foreground text-xs mt-1">5 answers</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-card border border-card-border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Question Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span className="font-medium">{mockQuestion.stats.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Votes</span>
                    <span className="font-medium">{voteCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Answers</span>
                    <span className="font-medium">{mockAnswers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-medium">{mockQuestion.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}