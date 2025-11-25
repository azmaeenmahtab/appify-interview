 
import React, { useState, useEffect } from 'react';
import CommentBox from './commentBox';
import LikesModal from './LikesModal';
import { postService } from '../services/postService';
import commentService from '../services/commentService';
import type { Comment } from '../types/comment';

interface FeedPostProps {
  postId: number;
  author: string;
  profilePic: string;
  time: string;
  content: string;
  image: string;
  likesCount: number;
  isLikedByUser: boolean;
  commentsCount: number;
  isPublic?: boolean;
  onLikeUpdate?: () => void;
  currentUserId?: number;
}


const FeedPost: React.FC<FeedPostProps> = ({
  postId,
  author,
  profilePic,
  time,
  content,
  image,
  likesCount: initialLikesCount,
  isLikedByUser: initialIsLiked,
  commentsCount: initialCommentsCount,
  isPublic = true,
  onLikeUpdate,
  currentUserId,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);
  
  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentOffset, setCommentOffset] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showLikesModal, setShowLikesModal] = useState(false);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const loadComments = async () => {
    if (loadingComments) return;
    
    setLoadingComments(true);
    try {
      const result = await commentService.getComments(postId, 5, commentOffset);
      setComments(prev => [...prev, ...result.comments]);
      setCommentOffset(prev => prev + result.comments.length);
      setHasMoreComments(result.comments.length === 5);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      if (replyingTo) {
        await commentService.addReply(replyingTo, { content: commentText });
      } else {
        await commentService.addComment(postId, { content: commentText });
      }
      
      // Refresh comments
      setComments([]);
      setCommentOffset(0);
      await loadComments();
      setCommentsCount(prev => prev + 1);
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);
      
      // Refresh comments
      setComments([]);
      setCommentOffset(0);
      await loadComments();
      setCommentsCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleCommentLikeToggle = (commentId: number, liked: boolean, likesCount: number) => {
    // Update the specific comment in the state
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, is_liked_by_user: liked, likes_count: likesCount };
        }
        if (comment.replies) {
          return { ...comment, replies: updateCommentLikes(comment.replies) };
        }
        return comment;
      });
    };
    
    setComments(updateCommentLikes(comments));
  };

  const handleLikeToggle = async () => {
    if (isLiking) return; // Prevent rapid clicks

    // Optimistic update
    const previousState = { isLiked, likesCount };
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLiking(true);

    try {
      const result = await postService.toggleLike(postId);
      
      // Update with server response (in case of discrepancy)
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);

      // Notify parent to refresh if needed
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-6">
      {/* Post header */}
      <div className="flex items-center gap-3 mb-2">
        <img src={profilePic} alt={author} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-[16px] text-black">{author}</div>
          <div className="text-gray-400 text-xs">{time} · {isPublic ? 'Public' : 'Private'}</div>
        </div>
        <span className="ml-auto text-gray-400 cursor-pointer">•••</span>
      </div>
      {/* Post content */}
      <div className="mb-2 text-gray-800">{content}</div>
      {image && <img src={image} alt="Post" className="rounded-lg w-full mb-2" />}
      {/* Reactions and actions */}
      <div className="flex items-center gap-2 mb-2 border-t border-b border-gray-200 py-2">
        <button 
          onClick={() => setShowLikesModal(true)}
          className="flex items-center gap-1 hover:underline cursor-pointer"
          disabled={likesCount === 0}
        >
          <span className={`text-sm ${isLiked ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            {isLiked ? '👍' : '👍'} {likesCount}
          </span>
        </button>
        <span className="ml-auto text-gray-500 text-sm cursor-pointer hover:underline">{commentsCount} Comment{commentsCount !== 1 ? 's' : ''}</span>
        <span className="text-gray-500 text-sm cursor-pointer hover:underline">Share</span>
      </div>
      {/* Reaction buttons */}
      <div className="flex gap-2 mb-2">
        <button 
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            isLiked 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👍 {isLiked ? 'Liked' : 'Like'}
        </button>
        <button
          className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
          onClick={() => setShowComments((prev) => !prev)}
        >
          Comment
        </button>
        <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold">Share</button>
      </div>
      {/* Comment section */}
      {showComments && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-600"
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmittingComment || !commentText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
          
          {replyingTo && (
            <div className="mb-2 ml-10 text-xs text-gray-500">
              Replying to comment 
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-2 text-blue-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
          
          {/* Render comments */}
          {loadingComments && comments.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Loading comments...</div>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentBox 
                  key={comment.id} 
                  comment={comment}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                  onLikeToggle={handleCommentLikeToggle}
                  currentUserId={currentUserId}
                />
              ))}
              
              {hasMoreComments && (
                <button
                  onClick={loadComments}
                  disabled={loadingComments}
                  className="w-full py-2 mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium disabled:text-gray-400"
                >
                  {loadingComments ? 'Loading...' : 'Load more comments'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Likes Modal */}
      <LikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        title="People who liked this post"
        fetchLikes={async (limit, offset) => {
          const result = await postService.getWhoLiked(postId, limit, offset);
          return result;
        }}
      />
    </div>
  );
};

export default FeedPost;