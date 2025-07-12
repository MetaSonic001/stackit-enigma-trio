import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Users, Brain, Shield, Star, MessageCircle, ThumbsUp, Bot, Search, Tags, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [x
    {
      icon: Brain,
      title: "AI-Powered Assistance",
      description: "Get smart tag suggestions, AI-generated answers, and intelligent question improvements."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with developers worldwide. Earn reputation, badges, and build your professional network."
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Advanced search, filters, and AI-powered related question suggestions help you find answers fast."
    },
    {
      icon: Shield,
      title: "Quality Content",
      description: "AI moderation ensures high-quality discussions while keeping spam and toxicity at bay."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Modern tech stack delivers blazing-fast performance on any device, anywhere."
    },
    {
      icon: Bot,
      title: "AI Moderation",
      description: "Automated content quality checks and smart spam detection for a clean community."
    }
  ];

  const stats = [
    { number: "10M+", label: "Questions Answered" },
    { number: "500K+", label: "Active Developers" },
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Programming Languages" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">StackIt</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">Community</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/questions">
              <Button variant="ghost">Browse Questions</Button>
            </Link>
            <Link to="/questions">
              <Button>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="container relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Q&A Platform
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Where Developers
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Ask, Learn, </span>
              and Grow Together
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join the most intelligent developer community. Get instant answers, AI assistance, 
              and connect with experts from around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/questions">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Start Asking Questions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ask">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  <Bot className="mr-2 h-5 w-5" />
                  Try AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful Features for Modern Developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to ask great questions, provide amazing answers, and build your reputation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Join the Community?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Start asking questions, sharing knowledge, and building your reputation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/questions">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  Browse Questions
                </Button>
              </Link>
              <Link to="/ask">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Ask Your First Question
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">StackIt</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The intelligent Q&A platform for developers worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/questions" className="hover:text-foreground">Browse Questions</Link></li>
                <li><Link to="/ask" className="hover:text-foreground">Ask Question</Link></li>
                <li><a href="#" className="hover:text-foreground">Tags</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Users</a></li>
                <li><a href="#" className="hover:text-foreground">Badges</a></li>
                <li><a href="#" className="hover:text-foreground">Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 StackIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;