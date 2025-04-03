"use client"
import { useEffect, useState } from "react";
import React from "react";
import TextEditor from "@/components/TextEditor";


export default function NotePage({ params }) {
    const { id } = React.use(params);
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/notes/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setNote(data.results[0]);
                })
                .catch((err) => {
                    console.error("Error fetching note:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    return (
        <div className="h-inherit text-white">
            {note ? (
                <TextEditor noteId={note.id} content={note.content} />
            ) : (
                <div>Caricamento...</div>
            )}
        </div>
    );
}
