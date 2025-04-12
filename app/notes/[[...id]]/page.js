"use client"

import React from "react";
import TextEditor from "@/components/TextEditor";
import { useSidebar } from "@/components/ui/sidebar";


export default function NotePage({ params }) {
    const { id } = React.use(params);
    // const [note, setNote] = useState(null);

    const sidebarContext = useSidebar();
    const notes = sidebarContext.notes;
    
    const note = notes.find((value) => {
        return value.id == id
    })


    return (
        <div className="h-inherit text-white">
            <TextEditor note={note} />
        </div>
    );
}
