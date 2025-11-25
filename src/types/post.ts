export interface Post {
  id: number;
  user_id: number;
  content?: string;
  image_url?: string;
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  is_liked_by_user?: boolean;
}

export interface CreatePostData {
  content?: string;
  image?: File;
  isPublic: boolean;
}

export interface PostResponse {
  message: string;
  post: Post;
}

export interface PostsResponse {
  posts: Post[];
}

export interface ToggleLikeResponse {
  message: string;
  liked: boolean;
  likesCount: number;
}

export interface LikeUser {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
}

export interface WhoLikedResponse {
  likes: LikeUser[];
  total: number;
  limit: number;
  offset: number;
}
