'use client'

import { PenLine } from "lucide-react";
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { authClient } from "@/lib/auth-client";

export default function CreateNoteButton(){
    const router = useRouter();

    async function handleNewNote(){
        try {
            var {data: session} = await authClient.getSession();
            var request_body = {
                user_id: session.user.id,
                id: v4(),
                title: "New note",
                content: ""
            };

            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request_body),
            });

            if (response.ok) {
                router.push(`/notes/${request_body.id}`);
            } else {
                console.error('Failed to create note');
            }
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }

    return (
        <Button onClick={handleNewNote}>
            <PenLine size={16} />
            <span>New Note</span>
        </Button>
    )
}