import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types";
import { userService } from "../../services/api";
import { UserCard } from "./UserCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const UserList: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchUsers = async (pageNumber: number = 1) => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await userService.getUsers(token, pageNumber);

            if (pageNumber === 1) {
                setUsers(response.data);
            } else {
                setUsers((prevUsers) => [...prevUsers, ...response.data]);
            }

            setHasMore(response.meta.currentPage < response.meta.totalPages);
        } catch (err) {
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers(1);
        }
    }, [token]);

    const handleLoadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(nextPage);
        }
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                    onClick={() => fetchUsers(1)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading && users.length === 0 ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="p-4">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24 mt-1" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : users.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No users found</h3>
                        <p className="text-gray-500">There are no users to display.</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))
                )}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        disabled={loading}
                        className="border-blue-200 hover:bg-blue-50 text-blue-700"
                    >
                        {loading ? "Loading..." : "Load More Users"}
                    </Button>
                </div>
            )}
        </div>
    );
};
