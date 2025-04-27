import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} HackerNews. All rights reserved.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
                            Terms
                        </a>
                        <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
                            Privacy
                        </a>
                        <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};