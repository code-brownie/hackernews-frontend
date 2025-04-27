import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Post } from "../../types";
import { likeService, commentService } from "../../services/api";
import { formatDistance } from "date-fns/formatDistance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HeartIcon, MessageCircleIcon, Trash2Icon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CommentList } from "../comments/CommentList";


interface PostCardProps {
    post: Post;
    onDelete?: (postId: string) => void;
    onLikeChange?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLikeChange }) => {
    const { user, token } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLike = async () => {
        if (!token) return;

        try {
            if (isLiked) {
                await likeService.unlikePost(token, post.id);
            } else {
                await likeService.likePost(token, post.id);
            }
            setIsLiked(!isLiked);
            if (onLikeChange) onLikeChange();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleDeletePost = async () => {
        if (!token || !onDelete) return;

        try {
            await likeService.unlikePost(token, post.id);
            onDelete(post.id);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !comment.trim()) return;

        setIsSubmitting(true);
        try {
            await commentService.createComment(token, post.id, comment);
            setComment("");
            setShowComments(true);
            if (onLikeChange) onLikeChange();
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                                {post.author?.name.substring(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{post.author?.name || "Unknown User"}</div>
                            <div className="text-sm text-gray-500">
                                {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
                            </div>
                        </div>
                    </div>
                    {user && post.authorId === user.id && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                                    <Trash2Icon size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your post.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <div className="prose max-w-none">
                    <p>{post.content}</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col border-t pt-4">
                <div className="flex justify-between items-center w-full mb-4">
                    <div className="flex space-x-4">
                        <Button
                            variant="ghost"
                            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                            onClick={handleLike}>
                            <HeartIcon size={18} />
                            <span>{post.likesCount || 0}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-1 text-gray-500"
                            onClick={() => setShowComments(!showComments)}>
                            <MessageCircleIcon size={18} />
                            <span>{post.commentsCount || 0}</span>
                        </Button>
                    </div>
                </div>

                {
                    showComments && (
                        <div className="w-full">
                            <CommentList postId={post.id} onCommentChange={onLikeChange} />
                        </div>
                    )
                }

                {
                    token && (
                        <form onSubmit={handleSubmitComment} className="w-full mt-4">
                            <div className="flex space-x-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                        {user?.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        placeholder="Write a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="min-h-[60px] w-full"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={isSubmitting || !comment.trim()}
                                        >
                                            {isSubmitting ? "Posting..." : "Post Comment"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )
                }
            </CardFooter >
        </Card >
    );
};

