import type { Post, CreatePostData, PostResponse, PostsResponse, ToggleLikeResponse, WhoLikedResponse } from '../types/post';
import { authService } from './authService';

const API_URL = 'http://localhost:3000';

export const postService = {
  async createPost(data: CreatePostData): Promise<PostResponse> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    if (data.content) {
      formData.append('content', data.content);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    formData.append('isPublic', data.isPublic.toString());

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create post');
    }

    return result;
  },

  async getPosts(): Promise<Post[]> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result: PostsResponse = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return result.posts;
  },

  async getPostById(id: number): Promise<Post> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return result.post;
  },

  async deletePost(id: number): Promise<void> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to delete post');
    }
  },

  async toggleLike(postId: number): Promise<ToggleLikeResponse> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/posts/${postId}/toggle-like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to toggle like');
    }

    return result;
  },

  async getWhoLiked(postId: number, limit: number = 20, offset: number = 0): Promise<WhoLikedResponse> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/posts/${postId}/likes?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch likes');
    }

    return result;
  },
};
