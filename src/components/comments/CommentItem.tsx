import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Comment } from "../../types";
import { commentService } from "../../services/api";
import { formatDistance } from "date-fns/formatDistance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, Trash2Icon, X as XIcon, Check as CheckIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface CommentItemProps {
    comment: Comment;
    onCommentChange: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onCommentChange }) => {
    const { user, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditComment = async () => {
        if (!token || !editText.trim() || editText === comment.text) {
            setIsEditing(false);
            return;
        }

        setIsSubmitting(true);
        try {
            await commentService.updateComment(token, comment.id, editText);
            onCommentChange();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async () => {
        if (!token) return;

        setIsSubmitting(true);
        try {
            await commentService.deleteComment(token, comment.id);
            onCommentChange();
        } catch (error) {
            console.error("Error deleting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAuthor = user && comment.userId === user.id;

    return (
        <div className="flex space-x-3 py-3 border-t first:border-t-0">
            <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                    {comment.user?.name.substring(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">
                        {comment.user?.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                    </span>
                </div>

                {isEditing ? (
                    <div className="mt-1">
                        <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[60px]"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setEditText(comment.text);
                                    setIsEditing(false);
                                }}
                                disabled={isSubmitting}
                                className="h-8 px-2"
                            >
                                <XIcon size={16} />
                                <span className="ml-1">Cancel</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleEditComment}
                                disabled={isSubmitting || !editText.trim() || editText === comment.text}
                                className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <CheckIcon size={16} />
                                <span className="ml-1">Save</span>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm mt-1">{comment.text}</p>
                )}
            </div>

            {isAuthor && !isEditing && (
                <div className="flex space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-blue-500"
                        onClick={() => setIsEditing(true)}
                    >
                        <PencilIcon size={14} />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 hover:text-red-500"
                            >
                                <Trash2Icon size={14} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this comment? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteComment}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
};