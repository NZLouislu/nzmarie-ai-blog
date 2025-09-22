"use client";

import { useState } from "react";
import { Heart, Share2, Eye } from "lucide-react";

interface BlogPostActionsProps {
  post: {
    id: string;
    title: string;
  };
  stats: {
    views: number;
    likes: number;
    aiQuestions: number;
    aiSummaries: number;
  };
}

export function BlogPostActions({ post, stats }: BlogPostActionsProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Implement like functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{stats.views} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{stats.likes} likes</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
            liked
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          Like
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
