export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  parent_comment_id?: number | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  is_liked_by_user?: boolean;
  replies?: Comment[];
}

export interface CreateCommentData {
  content: string;
}

export interface CommentResponse {
  message: string;
  comment: Comment;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  limit: number;
  offset: number;
}

export interface ToggleCommentLikeResponse {
  message: string;
  liked: boolean;
  likesCount: number;
}

export interface CommentLikeUser {
  id: number;
  user_id: number;
  comment_id: number;
  created_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
}

export interface WhoLikedCommentResponse {
  likes: CommentLikeUser[];
  total: number;
  limit: number;
  offset: number;
}
