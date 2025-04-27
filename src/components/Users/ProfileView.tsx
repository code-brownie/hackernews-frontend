import React from "react";
import { useAuth } from "../../context/AuthContext";
import { formatDistance } from "date-fns/formatDistance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { PostList } from "../posts/PostList";

export const ProfileView: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Profile</CardTitle>
                    <CardDescription>View and manage your profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Avatar className="w-24 h-24 text-2xl">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 text-center sm:text-left">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">
                                Joined {formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-xl font-bold mb-4">My Posts</h2>
                <PostList userPosts={true} />
            </div>
        </div>
    );
};