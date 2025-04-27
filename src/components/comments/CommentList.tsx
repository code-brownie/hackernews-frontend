import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Comment } from "../../types";
import { commentService } from "../../services/api";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentListProps {
    postId: string;
    onCommentChange?: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({ postId, onCommentChange }) => {
    const { token } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = async (pageNumber: number) => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await commentService.getCommentsOnPost(token, postId, pageNumber);

            if (pageNumber === 1) {
                setComments(response.data);
            } else {
                setComments((prevComments) => [...prevComments, ...response.data]);
            }

            setHasMore(response.meta.currentPage < response.meta.totalPages);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchComments(1);
        }
    }, [token, postId]);

    const handleLoadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchComments(nextPage);
        }
    };

    const handleCommentChange = () => {
        // Reset and fetch again
        setPage(1);
        fetchComments(1);

        if (onCommentChange) {
            onCommentChange();
        }
    };

    return (
        <div className="mt-2">
            <h4 className="font-medium text-sm mb-2">Comments</h4>

            {loading && comments.length === 0 ? (
                Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex space-x-3 py-3 border-t first:border-t-0">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-2 w-16" />
                            </div>
                            <Skeleton className="h-12 w-full mt-2" />
                        </div>
                    </div>
                ))
            ) : comments.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">No comments yet.</p>
            ) : (
                <div>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onCommentChange={handleCommentChange}
                        />
                    ))}

                    {hasMore && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                            {loading ? "Loading..." : "Load More Comments"}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};