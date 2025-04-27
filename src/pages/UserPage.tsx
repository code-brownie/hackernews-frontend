import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api";
import { User } from "../types";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

export const UsersPage: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await userService.getUsers(token, currentPage, 10);
                setUsers(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, currentPage]);

    const filteredUsers = searchTerm
        ? users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : users;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Users</h1>
                </div>

                {!isAuthenticated ? (
                    <Card className="mb-6">
                        <CardContent className="py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-700">Please log in to view users</h3>
                                <p className="text-gray-500 mt-2">
                                    You need to be logged in to see the list of users.
                                </p>
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
                                    <a href="/login">Login</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="search"
                                placeholder="Search users by name or email..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                        ) : filteredUsers.length === 0 ? (
                            <Card className="mb-6">
                                <CardContent className="py-12">
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-gray-700">
                                            {searchTerm ? "No users match your search" : "No users found"}
                                        </h3>
                                        <p className="text-gray-500 mt-2">
                                            {searchTerm ? "Try a different search term" : "The user list appears to be empty."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredUsers.map((user) => (
                                        <Card key={user.id} className="overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-blue-100 text-blue-800">
                                                            {user.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

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
                    </>
                )}
            </div>
        </Layout>
    );
};