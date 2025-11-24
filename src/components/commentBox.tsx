import React from 'react';

interface Comment {
	id: string;
	author: string;
	profilePic: string;
	text: string;
	time: string;
	likes: number;
}

const CommentBox: React.FC<{ comment: Comment }> = ({ comment }) => (
	<div className="flex gap-2 items-start mb-2">
		<img src={comment.profilePic} alt={comment.author} className="w-8 h-8 rounded-full object-cover" />
		<div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
			<div className="font-semibold text-sm text-black">{comment.author}</div>
			<div className="text-gray-700 text-sm">{comment.text}</div>
			<div className="flex gap-3 text-xs text-gray-400 mt-1">
				<span>Like</span>
				<span>Reply</span>
				<span>Share</span>
				<span>{comment.time}</span>
				<span>👍 {comment.likes}</span>
			</div>
		</div>
	</div>
);

export default CommentBox;
