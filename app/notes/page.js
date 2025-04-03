'use client'

import TextEditor from "@/components/TextEditor";
import { authClient } from "@/lib/auth-client"
import { useState, useEffect } from "react";


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
        <div className="h-inherit text-white">
            {notes.length ? (
                <TextEditor noteId={currentNote.id} content={currentNote.content} />
            ) : (
                <div>Caricamento...</div>
            )}
        </div>
    );
}
