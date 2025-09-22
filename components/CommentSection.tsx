"use client";

import { useState } from "react";

import Image from 'next/image';

import { useCommentsStore } from "@/lib/stores/commentsStore";
import { MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  postId: string;
  authorName: string | null;
  authorEmail: string | null;
  content: string;
  is_anonymous: boolean;
  createdAt: string;
  avatar?: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { comments, addComment } = useCommentsStore();
  const postComments = comments[postId] || initialComments;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment = {
      id: Date.now().toString(),
      postId,
      authorName: authorName,
      authorEmail: null,
      content: newComment,
      is_anonymous: false,
      createdAt: new Date().toISOString(),
    };

    addComment(postId, comment);
    setNewComment("");
    setAuthorName("");
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({postComments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {postComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              {comment.avatar ? (
                <Image
                  src={comment.avatar}
                  alt={comment.authorName || 'Anonymous'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {comment.authorName?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{comment.authorName || 'Anonymous'}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write your comment..."
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
