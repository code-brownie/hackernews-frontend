import React from "react";
import { User } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistance } from "date-fns/formatDistance";

interface UserCardProps {
    user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                            {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500">
                            Joined {formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};