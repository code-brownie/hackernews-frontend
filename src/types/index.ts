export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    author?: User;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Like {
    id: string;
    postId: string;
    userId: string;
    user?: User;
    createdAt: string;
}

export interface Comment {
    id: string;
    text: string;
    postId: string;
    userId: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export type PaginatedUsers = PaginatedResponse<User>;
export type PaginatedPosts = PaginatedResponse<Post>;
export type PaginatedLikes = PaginatedResponse<Like>;
export type PaginatedComments = PaginatedResponse<Comment>;