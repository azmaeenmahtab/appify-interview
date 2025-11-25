import { authService } from './authService';
import type { 
  CreateCommentData, 
  CommentResponse, 
  CommentsResponse,
  ToggleCommentLikeResponse,
  WhoLikedCommentResponse
} from '../types/comment';

const API_URL = 'http://localhost:3000';

const commentService = {
  // Add comment to a post
  addComment: async (postId: number, data: CreateCommentData): Promise<CommentResponse> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }

    return response.json();
  },

  // Add reply to a comment
  addReply: async (commentId: number, data: CreateCommentData): Promise<CommentResponse> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_URL}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add reply');
    }

    return response.json();
  },

  // Get comments for a post
  getComments: async (
    postId: number, 
    limit: number = 5, 
    offset: number = 0
  ): Promise<CommentsResponse> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_URL}/posts/${postId}/comments?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch comments');
    }

    return response.json();
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<{ message: string }> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete comment');
    }

    return response.json();
  },

  // Toggle like on a comment
  toggleCommentLike: async (commentId: number): Promise<ToggleCommentLikeResponse> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_URL}/comments/${commentId}/toggle-like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle like');
    }

    return response.json();
  },

  // Get who liked a comment
  getWhoLiked: async (
    commentId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<WhoLikedCommentResponse> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_URL}/comments/${commentId}/likes?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch likes');
    }

    return response.json();
  }
};

export default commentService;
