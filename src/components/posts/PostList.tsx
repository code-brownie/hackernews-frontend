import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Post, PaginatedPosts } from "../../types";
import { postService } from "../../services/api";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PostListProps {
    userPosts?: boolean;
}

export const PostList: React.FC<PostListProps> = ({ userPosts = false }) => {
    const { token } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageNumber: number) => {
        if (!token) return;

        try {
            setLoading(true);
            const paginatedPosts: PaginatedPosts = userPosts
                ? await postService.getMyPosts(token, pageNumber)
                : await postService.getPosts(token, pageNumber);

            if (pageNumber === 1) {
                setPosts(paginatedPosts.data);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...paginatedPosts.data]);
            }

            setHasMore(paginatedPosts.meta.currentPage < paginatedPosts.meta.totalPages);
        } catch (err) {
            setError("Failed to load posts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPosts(1);
        }
    }, [token, userPosts]);

    const handleLoadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    const handleDeletePost = (postId: string) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const handleRefresh = () => {
        setPage(1);
        fetchPosts(1);
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div>
            {loading && posts.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24 mt-1" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-24 w-full mb-4" />
                        <div className="flex space-x-4">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                    <p className="text-gray-500 mb-6">
                        {userPosts
                            ? "You haven't created any posts yet."
                            : "There are no posts to display."}
                    </p>
                    {userPosts && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <a href="/create-post">Create Your First Post</a>
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDeletePost}
                            onLikeChange={handleRefresh}
                        />
                    ))}
                    {hasMore && (
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={handleLoadMore}
                                variant="outline"
                                disabled={loading}
                                className="border-blue-200 hover:bg-blue-50 text-blue-700"
                            >
                                {loading ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};