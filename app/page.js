'use client'

import TextEditor from "@/components/TextEditor";
import { authClient } from "@/lib/auth-client"
import { useState, useEffect } from "react";
import NoteCard from "@/components/ui/note-card";
import { PenLine } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";


export default function Home() { 
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);

    useEffect(() => {
        async function fetchNotes(){
            const { data: session } = await authClient.getSession() 
            console.log(session);
            fetch('/api/notes?user_id='+session.user.id, {
                method: "GET",
            })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                setNotes(data);
                setCurrentNote(data[0]);
            })
        }

        fetchNotes();
    }, [])

    return (
        <main className="">
            <div className="flex justify-between items-stretch bg-sidebar min-h-svh dark">
                <SidebarProvider>
                    <AppSidebar notes={notes} setCurrentNote={setCurrentNote}/>
                    <div>
                        <SidebarTrigger />
                        <div className="h-inherit text-white">
                            {notes.length ? (
                                <TextEditor noteId={currentNote.id} content={currentNote.content} />
                            ) : (
                                <div>Caricamento...</div>
                            )}
                        </div>
                    </div>
                </SidebarProvider>
            </div>
        </main>
    );
}
