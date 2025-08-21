'use client'

import { PenLine } from "lucide-react";
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { authClient } from "@/lib/auth-client";
import { useNotes } from "@/contexts/NotesContext";

export default function CreateNoteButton(){
    const router = useRouter();
    const { addNote } = useNotes();

    async function handleNewNote(){
        try {
            var {data: session} = await authClient.getSession();
            var request_body = {
                user_id: session.user.id,
                id: v4(),
                title: "New note",
                content: "<br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
            };

            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request_body),
            });

            if (response.ok) {
                // Add the new note to the context
                addNote({
                    ...request_body,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });

                router.push(`/notes/${request_body.id}`);
            } else {
                console.error('Failed to create note');
            }
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }

    return (
        <Button variant="white" onClick={handleNewNote}>
            <PenLine size={16} />
            <span>New Note</span>
        </Button>
    )
}