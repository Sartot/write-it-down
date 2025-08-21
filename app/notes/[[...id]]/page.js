"use client"

import React, { useEffect } from "react";
import TextEditor from "@/components/TextEditor";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from 'next/navigation'

export default function NotePage({ params }) {
    const { id } = React.use(params);
    const sidebarContext = useSidebar();
    const notes = sidebarContext.notes;
    const router = useRouter();
    
    useEffect(() => {
        if (typeof id === "undefined" && notes instanceof Array && notes.length) {
            router.push("/notes/" + notes[0].id)
        }
    }, [id, router, notes]);
    
    // Se l'id è undefined, mostriamo un componente vuoto in attesa del redirect
    if (typeof id === "undefined") {
        return null;
    }
    
    const note = notes.find((value) => value.id == id);

    return (
        note ? (
            <div className="flex-grow text-white relative">
                <TextEditor note={note} />
            </div>
        ) : (
            null
        )
    );
}
