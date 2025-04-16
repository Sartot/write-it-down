"use client"

import React, { useEffect } from "react";
import TextEditor from "@/components/TextEditor";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from 'next/navigation'

export default function NotePage({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const sidebarContext = useSidebar();
    const notes = sidebarContext.notes;
    
    useEffect(() => {
        if (typeof id === "undefined") {
            router.push("/notes/" + notes[0].id);
        }
    }, [id, router, notes]);
    
    // Se l'id è undefined, mostriamo un componente vuoto in attesa del redirect
    if (typeof id === "undefined") {
        return null;
    }
    
    const note = notes.find((value) => value.id == id);

    return (
        <div className="h-inherit text-white">
            <TextEditor note={note} />
        </div>
    );
}
