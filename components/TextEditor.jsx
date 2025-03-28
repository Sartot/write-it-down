"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from '@tiptap/extension-image'
import { useRef, useState, useEffect } from "react";

import EditorMenu from "@/components/EditorMenu";

export default function TextEditor({ noteId, content }) {
    const updateTimeoutRef = useRef(null);
    const [isSaving, setSaving] = useState(false);

    const editor = useEditor({
        extensions: [
            Image.configure({
                allowBase64: true,
            }),
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                  files.forEach(file => {
                    const fileReader = new FileReader()
        
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                      currentEditor.chain().insertContentAt(pos, {
                        type: 'image',
                        attrs: {
                          src: fileReader.result,
                        },
                      }).focus().run()
                    }
                  })
                },
                onPaste: (currentEditor, files, htmlContent) => {
                  files.forEach(file => {
                    if (htmlContent) {
                      // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
                      // you could extract the pasted file from this url string and upload it to a server for example
                      console.log(htmlContent) // eslint-disable-line no-console
                      return false
                    }
        
                    const fileReader = new FileReader()
        
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                      currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                        type: 'image',
                        attrs: {
                          src: fileReader.result,
                        },
                      }).focus().run()
                    }
                  })
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        immediatelyRender: false,
        content: content, // Imposta il contenuto iniziale
        autofocus: true,
        onUpdate: updateHandler,
    });

    // Effetto per aggiornare il contenuto quando cambia la prop `content`
    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content); // Aggiorna il contenuto dell'editor
        }
    }, [content, editor]);

    // Auto-save after 2s
    function updateHandler() {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
        }

        updateTimeoutRef.current = setTimeout(() => {
            setSaving(true);

            const request_body = JSON.stringify({
                id: noteId,
                content: editor.getHTML(),
            });

            fetch("/api/notes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: request_body,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Nota aggiornata con successo:", data);
            })
            .catch((error) => {
                console.error("Errore durante l'aggiornamento della nota:", error);
            })
            .finally(() => {
                setSaving(false);
            });

            updateTimeoutRef.current = null;
        }, 2000);
    }

    return (
        <div className="h-full px-5 py-4">
            <div className="pb-6 text-slate-600">
                {isSaving ? "Saving..." : "Saved"}
            </div>
            <div className="py-4">
                <EditorMenu editor={editor} />
            </div>
            <div className="">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
