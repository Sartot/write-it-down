'use client'

import TextEditor from "@/components/TextEditor";
import { authClient } from "@/lib/auth-client"
import { useState, useEffect } from "react";


export default function Home() { 
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        async function fetchNotes(){
            const { data: session } = await authClient.getSession() 
            console.log(session);
            fetch('/api/notes?user_id='+session.user.id, {
                method: "GET",
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setNotes(data);
            })
        }

        fetchNotes();
    }, [])
    return (
        <main className="flex justify-between items-center bg-neutral-900 h-svh">
            <div className="w-3/12 h-full bg-slate-300">
                {notes.map((note) => (
                    <div key={note.id}>{note.title}</div>
                ))}
            </div>
            <div className="w-8/12 h-full bg-slate-50">
                <TextEditor />
            </div>
        </main>
    );
}
