import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { postService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CreatePostForm: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSubmitting(true);
        try {
            await postService.createPost(token, title, content);
            navigate(title ? "/my-posts" : "/");
        } catch (err) {
            setError("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter your post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your post content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px]"
                            required
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting ? "Creating..." : "Publish Post"}
                </Button>
            </CardFooter>
        </Card>
    );
};