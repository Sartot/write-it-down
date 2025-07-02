'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() { 
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
            <div className="text-center space-y-8 px-4">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
                        Write It Down
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                        Capture your thoughts, organize your ideas, and study smarter with AI-powered assistance
                    </p>
                </div>
                
                <div className="pt-8">
                    <Link href="/notes">
                        <Button 
                            size="lg" 
                            className="bg-white hover:bg-gray-100 text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
