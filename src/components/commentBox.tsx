import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import LikesModal from './LikesModal';
import type { Comment } from '../types/comment';
import commentService from '../services/commentService';

interface CommentBoxProps {
	comment: Comment;
	onReply: (commentId: number) => void;
	onDelete?: (commentId: number) => void;
	onLikeToggle?: (commentId: number, liked: boolean, likesCount: number) => void;
	currentUserId?: number;
	depth?: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ 
	comment, 
	onReply,
	onDelete,
	onLikeToggle,
	currentUserId,
	depth = 0
}) => {
	const [isLiked, setIsLiked] = useState(comment.is_liked_by_user || false);
	const [likesCount, setLikesCount] = useState(comment.likes_count || 0);
	const [isLiking, setIsLiking] = useState(false);
	const [showReplies, setShowReplies] = useState(true);
	const [showLikesModal, setShowLikesModal] = useState(false);

	const handleLikeToggle = async () => {
		if (isLiking) return;

		// Optimistic update
		const previousLiked = isLiked;
		const previousCount = likesCount;
		
		setIsLiked(!isLiked);
		setLikesCount(!isLiked ? likesCount + 1 : likesCount - 1);
		setIsLiking(true);

		try {
			const result = await commentService.toggleCommentLike(comment.id);
			
			// Update with server response
			setIsLiked(result.liked);
			setLikesCount(result.likesCount);
			
			// Notify parent component
			if (onLikeToggle) {
				onLikeToggle(comment.id, result.liked, result.likesCount);
			}
		} catch (error) {
			console.error('Failed to toggle like:', error);
			// Revert on error
			setIsLiked(previousLiked);
			setLikesCount(previousCount);
		} finally {
			setIsLiking(false);
		}
	};

	const handleDelete = () => {
		if (onDelete && window.confirm('Are you sure you want to delete this comment?')) {
			onDelete(comment.id);
		}
	};

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diff < 60) return 'Just now';
		if (diff < 3600) return `${Math.floor(diff / 60)}m`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
		if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
		return date.toLocaleDateString();
	};

	const isOwner = currentUserId === comment.user_id;

	return (
		<div className={`mb-2 ${depth > 0 ? 'ml-8' : ''}`}>
			<div className="flex gap-2 items-start">
				<div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
					{comment.user_first_name[0]}{comment.user_last_name[0]}
				</div>
				<div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
					<div className="font-semibold text-sm text-black">
						{comment.user_first_name} {comment.user_last_name}
					</div>
					<div className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</div>
					<div className="flex gap-3 text-xs text-gray-500 mt-1 items-center">
						<button
							onClick={handleLikeToggle}
							disabled={isLiking}
							className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
								isLiked ? 'text-red-500' : ''
							}`}
						>
							{isLiked ? <FaHeart /> : <FaRegHeart />}
							<span className="font-medium">Like</span>
						</button>
						
						<button
							onClick={() => onReply(comment.id)}
							className="hover:text-blue-500 transition-colors"
						>
							Reply
						</button>
						
						{isOwner && (
							<button
								onClick={handleDelete}
								className="hover:text-red-500 transition-colors"
							>
								Delete
							</button>
						)}
						
						<span className="text-gray-400">{formatTime(comment.created_at)}</span>
						
						{likesCount > 0 && (
							<button
								onClick={() => setShowLikesModal(true)}
								className={`flex items-center gap-1 hover:underline ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
							>
								<FaHeart className="text-xs" />
								{likesCount}
							</button>
						)}
					</div>
				</div>
			</div>

			{comment.replies && comment.replies.length > 0 && (
				<div className="mt-2">
					{depth < 5 && (
						<button
							onClick={() => setShowReplies(!showReplies)}
							className="text-xs text-blue-500 hover:underline ml-10 mb-1"
						>
							{showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
						</button>
					)}
					
					{showReplies && (
						<div>
							{comment.replies.map((reply) => (
								<CommentBox
									key={reply.id}
									comment={reply}
									onReply={onReply}
									onDelete={onDelete}
									onLikeToggle={onLikeToggle}
									currentUserId={currentUserId}
									depth={depth + 1}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{/* Likes Modal */}
			<LikesModal
				isOpen={showLikesModal}
				onClose={() => setShowLikesModal(false)}
				title="People who liked this comment"
				fetchLikes={async (limit, offset) => {
					const result = await commentService.getWhoLiked(comment.id, limit, offset);
					return result;
				}}
			/>
		</div>
	);
};

export default CommentBox;
