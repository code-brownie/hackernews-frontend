import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/api";
import { Post } from "../types";
import { Layout } from "../components/layout/Layout";
import { PostCard } from "../components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Navigate } from "react-router-dom";

export const MyPostsPage: React.FC = () => {
    const { token, isAuthenticated, user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await postService.getMyPosts(token, currentPage, 10);
                setPosts(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (err) {
                console.error("Error fetching my posts:", err);
                setError("Failed to load your posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [token, currentPage, refreshTrigger]);

    const handleDeletePost = async (postId: string) => {
        if (!token) return;

        try {
            await postService.deletePost(token, postId);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } catch (err) {
            console.error("Error deleting post:", err);
            setError("Failed to delete post. Please try again.");
        }
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Posts</h1>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                        <a href="/posts">Back to News Feed</a>
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2Icon className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : posts.length === 0 ? (
                    <Card className="mb-6">
                        <CardContent className="py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-700">You haven't created any posts yet</h3>
                                <p className="text-gray-500 mt-2">
                                    Share your thoughts or news with the community by creating a post.
                                </p>
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
                                    <a href="/posts">Create Your First Post</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="mb-4">
                            <h2 className="text-lg text-gray-600">
                                Showing {posts.length} post{posts.length !== 1 ? 's' : ''} by {user?.name}
                            </h2>
                        </div>

                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                                onLikeChange={handleRefresh}
                            />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center px-4">
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};