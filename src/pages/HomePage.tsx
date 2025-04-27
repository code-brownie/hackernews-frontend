import React from "react";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/layout/Layout";
import { PostList } from "../components/posts/PostList";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">News Feed</h1>
                    {isAuthenticated && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link to="/create-post">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Post
                            </Link>
                        </Button>
                    )}
                </div>

                {isAuthenticated ? (
                    <PostList />
                ) : (
                    <div className="text-center py-12 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h2 className="text-2xl font-bold mb-2">Welcome to HackerNews</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Join our community to share news, thoughts, and interact with other users.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Button asChild variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};