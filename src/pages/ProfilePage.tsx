// src/pages/ProfilePage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon } from "lucide-react";
import { formatDistance } from "date-fns/formatDistance";
import { Navigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your personal information</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pt-6">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                                        {user?.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold">{user?.name}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                            </CardContent>
                            <CardFooter className="flex justify-center border-t pt-4">
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={logout}
                                >
                                    Sign Out
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card className="mb-6">
                            <CardHeader className="pb-2">
                                <CardTitle>Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{user?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Member Since</p>
                                            <p className="font-medium">
                                                {formatDistance(new Date(user?.createdAt || Date.now()), new Date(), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    asChild
                                >
                                    <a href="/my-posts">View My Posts</a>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Account Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Posts</p>
                                            <p className="text-2xl font-bold">-</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Comments</p>
                                            <p className="text-2xl font-bold">-</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Likes Given</p>
                                            <p className="text-2xl font-bold">-</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Likes Received</p>
                                            <p className="text-2xl font-bold">-</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};