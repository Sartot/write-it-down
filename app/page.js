'use client'

import TextEditor from "@/components/TextEditor";
import { authClient } from "@/lib/auth-client"
import { useState, useEffect } from "react";
import NoteCard from "@/components/ui/note-card";


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
                console.log(data)
                setNotes(data);
                setCurrentNote(data[0]);
            })
        }

        fetchNotes();
    }, [])

    async function fetchNote(noteId) {
        return fetch("/api/notes/" + noteId);
    }

    function switchNote(noteId){
        console.log("clicked " + noteId);
        fetchNote(noteId)
        .then((res) => res.json())
        .then((data) => {
            const note = data.results[0];
            setCurrentNote(note)
        })
    }

    return (
        <main className="flex justify-between items-center bg-neutral-900 h-svh">
            <div className="w-3/12 h-full border-r-2 border-x-neutral-500">
                {notes.map((note, i) => (
                    <NoteCard 
                        key={note.id} 
                        note={note} 
                        // active={ i == 0 ? true : false } 
                        onClick={() => switchNote(note.id)}
                    />
                ))}
            </div>
            <div className="w-8/12 h-full bg-slate-50">
                {notes.length ? (
                    <TextEditor noteId={currentNote.id} content={currentNote.content} />
                ) : (
                    <div>Caricamento...</div>
                )}
            </div>
        </main>
    );
}
