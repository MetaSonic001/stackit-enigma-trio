import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  ChevronUp, 
  ChevronDown, 
  Bookmark, 
  Clock, 
  User,
  CheckCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  stats: {
    votes: number;
    answers: number;
    views: number;
  };
  createdAt: string;
  hasAcceptedAnswer?: boolean;
  isBookmarked?: boolean;
  userVote?: 'up' | 'down' | null;
}

export function QuestionCard({
  id,
  title,
  content,
  tags,
  author,
  stats,
  createdAt,
  hasAcceptedAnswer = false,
  isBookmarked = false,
  userVote = null
}: QuestionCardProps) {
  const navigate = useNavigate();
  const [currentVote, setCurrentVote] = useState(userVote);
  const [voteCount, setVoteCount] = useState(stats.votes);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleVote = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    if (currentVote === voteType) {
      // Remove vote
      setCurrentVote(null);
      setVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
    } else {
      // Change or set vote
      const change = currentVote === null 
        ? (voteType === 'up' ? 1 : -1)
        : (voteType === 'up' ? 2 : -2);
      setCurrentVote(voteType);
      setVoteCount(prev => prev + change);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    setBookmarked(!bookmarked);
  };

  const handleCardClick = () => {
    navigate(`/question/${id}`);
  };

  return (
    <div 
      className="group bg-card border border-card-border rounded-lg p-6 card-hover cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "vote-button",
              currentVote === 'up' && "active-up"
            )}
            onClick={(e) => handleVote('up', e)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <span className={cn(
            "font-semibold text-sm",
            voteCount > 0 && "text-upvote",
            voteCount < 0 && "text-downvote"
          )}>
            {voteCount > 0 ? `+${voteCount}` : voteCount}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "vote-button",
              currentVote === 'down' && "active-down"
            )}
            onClick={(e) => handleVote('down', e)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasAcceptedAnswer && (
                <CheckCircle className="h-4 w-4 text-accepted" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  bookmarked && "text-primary"
                )}
                onClick={handleBookmark}
              >
                <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
              </Button>
            </div>
          </div>

          {/* Content Preview */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats and Author */}
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{stats.answers} answers</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{stats.views} views</span>
              </div>
            </div>

            {/* Author and Time */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{createdAt}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <div className="text-sm font-medium">{author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {author.reputation} rep
                    </div>
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