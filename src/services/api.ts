import { AuthResponse, Comment, PaginatedComments, PaginatedLikes, PaginatedPosts, PaginatedUsers, Post, User } from "../types";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json() as Promise<T>;
}

// Authentication services
export const authService = {
    signIn: async (name: string, email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        return handleResponse<AuthResponse>(response);
    },

    logIn: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/log-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse<AuthResponse>(response);
    },
};

// Users services
export const userService = {
    getMe: async (token: string): Promise<User> => {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<User>(response);
    },

    getUsers: async (token: string, page = 1, limit = 10): Promise<PaginatedUsers> => {
        const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<PaginatedUsers>(response);
    },
};

// Posts services
export const postService = {
    getPosts: async (token: string, page = 1, limit = 10): Promise<PaginatedPosts> => {
        const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<PaginatedPosts>(response);
    },

    getMyPosts: async (token: string, page = 1, limit = 10): Promise<PaginatedPosts> => {
        const response = await fetch(`${API_URL}/posts/me?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<PaginatedPosts>(response);
    },

    createPost: async (token: string, title: string, content: string): Promise<Post> => {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });
        return handleResponse<Post>(response);
    },

    deletePost: async (token: string, postId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<void>(response);
    },
};

// Likes services
export const likeService = {
    getLikesOnPost: async (token: string, postId: string, page = 1, limit = 10): Promise<PaginatedLikes> => {
        const response = await fetch(`${API_URL}/likes/on/${postId}?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<PaginatedLikes>(response);
    },

    likePost: async (token: string, postId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/likes/on/${postId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<void>(response);
    },

    unlikePost: async (token: string, postId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/likes/on/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<void>(response);
    },
};

// Comments services
export const commentService = {
    getCommentsOnPost: async (token: string, postId: string, page = 1, limit = 10): Promise<PaginatedComments> => {
        const response = await fetch(`${API_URL}/comments/on/${postId}?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<PaginatedComments>(response);
    },

    createComment: async (token: string, postId: string, text: string): Promise<Comment> => {
        const response = await fetch(`${API_URL}/comments/on/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });
        return handleResponse<Comment>(response);
    },

    updateComment: async (token: string, commentId: string, text: string): Promise<Comment> => {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });
        return handleResponse<Comment>(response);
    },

    deleteComment: async (token: string, commentId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse<void>(response);
    },
};