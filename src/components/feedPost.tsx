 
import React, { useState } from 'react';
import CommentBox from './commentBox';

interface Comment {
  id: string;
  author: string;
  profilePic: string;
  text: string;
  time: string;
  likes: number;
}

interface FeedPostProps {
  author: string;
  profilePic: string;
  time: string;
  content: string;
  image: string;
  reactions: { type: string; count: number }[];
  comments: Comment[];
}


const FeedPost: React.FC<FeedPostProps> = ({
  author,
  profilePic,
  time,
  content,
  image,
  comments,
}) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-6">
      {/* Post header */}
      <div className="flex items-center gap-3 mb-2">
        <img src={profilePic} alt={author} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-[16px] text-black">{author}</div>
          <div className="text-gray-400 text-xs">{time} · Public</div>
        </div>
        <span className="ml-auto text-gray-400 cursor-pointer">•••</span>
      </div>
      {/* Post content */}
      <div className="mb-2 text-gray-800">{content}</div>
      <img src={image} alt="Post" className="rounded-lg w-full mb-2 " />
      {/* Reactions and actions */}
      <div className="flex items-center gap-2 mb-2">
        {/* Example: avatars and reaction count */}
        <div className="flex -space-x-2">
          {/* ...map avatars here... */}
          <span className="bg-blue-600 text-white rounded-full px-2 text-xs">9+</span>
        </div>
        <span className="ml-auto text-gray-500 text-sm">{comments.length} Comment</span>
        <span className="text-gray-500 text-sm">{122} Share</span>
      </div>
      {/* Reaction buttons */}
      <div className="flex gap-2 mb-2">
        <button className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold">😆 Haha</button>
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
          <div className="flex items-center gap-2 mb-2">
            <img src={profilePic} alt="You" className="w-8 h-8 rounded-full object-cover" />
            <input
              type="text"
              placeholder="Write a comment"
              className="flex-1 bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-600"
            />
          </div>
          {/* Render comments */}
          {comments.map((comment) => (
            <CommentBox key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPost;