import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/api";
import { Post } from "../types";
import { Layout } from "../components/layout/Layout";
import { PostCard } from "../components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PostsPage: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await postService.getPosts(token, currentPage, 10);
                setPosts(response.data);
                console.log("The posts", response.data);
                setTotalPages(response.meta.totalPages);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token, currentPage, refreshTrigger]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !newPostTitle.trim() || !newPostContent.trim()) return;

        setIsSubmitting(true);
        try {
            await postService.createPost(token, newPostTitle, newPostContent);
            setNewPostTitle("");
            setNewPostContent("");
            setIsDialogOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">News Feed</h1>
                    {isAuthenticated && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Create Post
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Create a New Post</DialogTitle>
                                    <DialogDescription>
                                        Share your thoughts, news, or stories with the community.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreatePost}>
                                    <div className="space-y-4 py-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="Enter post title"
                                                value={newPostTitle}
                                                onChange={(e) => setNewPostTitle(e.target.value)}
                                                className="w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="content">Content</Label>
                                            <Textarea
                                                id="content"
                                                placeholder="Write your post content here..."
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                                className="min-h-[200px] w-full"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                "Publish Post"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
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
                ) : posts?.length === 0 ? (
                    <Card className="mb-6">
                        <CardContent className="py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-700">No posts found</h3>
                                <p className="text-gray-500 mt-2">
                                    {isAuthenticated
                                        ? "Be the first to create a post!"
                                        : "Please log in to see posts and create your own."}
                                </p>
                                {!isAuthenticated && (
                                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
                                        <a href="/login">Login</a>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {posts && posts.map((post) => (
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