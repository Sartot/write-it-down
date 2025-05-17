"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from '@tiptap/extension-image'
import { useRef, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import EditorMenu from "@/components/EditorMenu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { v4 } from "uuid";

import { GoogleGenAI, Type } from "@google/genai";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function TextEditor({ note, isLoading }) {
    const updateTimeoutRef = useRef(null);
    const [isSaving, setSaving] = useState(false);
    const titleRef = useRef(note.title);
    const [open, setOpen] = useState(false);

    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState([]);

    const ai = new GoogleGenAI({ apiKey: "AIzaSyCdAzXQMHFi3nYLpLsNMCK1m85IWwQ1dlM" });

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
        content: note?.content, // Imposta il contenuto iniziale
        autofocus: true,
        onUpdate: updateHandler,
    });

    // Effetto per aggiornare il contenuto quando cambia la prop `content`
    useEffect(() => {
        if (!isLoading && editor && note?.content) {
            editor.commands.setContent(note?.content); // Aggiorna il contenuto dell'editor
        }

        titleRef.current.value = (note?.title ? note.title : "");
    }, [note]);

    // Auto-save after 2s
    function updateHandler() {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
        }

        updateTimeoutRef.current = setTimeout(async () => {
            setSaving(true);

            if(note){
                updateNote(note.id, titleRef.current.value, editor.getHTML());
            }else{
                var {data: session} = await authClient.getSession();
                createNote(session.user.id, titleRef.current.value, editor.getHTML());
            }

            updateTimeoutRef.current = null;
        }, 2000);
    }

    function createNote(user_id, title, content){
        const request_body = JSON.stringify({
            user_id: user_id,
            id: v4(),
            title: title,
            content: content,
        });

        fetch("/api/notes", {
            method: "POST",
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
    }

    function updateNote(id, title, content){
        const request_body = JSON.stringify({
            id: id,
            title: title,
            content: content,
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
    }


    async function askAI(){
        setOpen(true);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: editor.getHTML(),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: {
                                type: Type.STRING
                            },
                            questions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            },
                        },
                        propertyOrdering: ["topic", "questions"],
                    }
                },
                systemInstruction: `You are an assistant that helps student study a subject based on their notes. 
                You will receive the notes related to a topic, your goal is to generate questions about it to help them study in the
                notes language.`,
            },
        });

        const data = JSON.parse(response.text);
        console.log(data);
        setTopic(data[0].topic);
        setQuestions(data[0].questions);
    }

    return (
        <div className="h-full px-5 py-4">
            <Input 
                ref={titleRef}
                placeholder="Title"
                type="text"
                className="max-w-60 md:text-xl border-0 border-b-2 rounded-none outline-none focus-visible:ring-0"
                onChange={updateHandler}
            />
            <div className="py-6 text-slate-600">
                {isSaving ? "Saving..." : "Saved"}
            </div>
            <div className="py-4">
                <EditorMenu editor={editor} />
            </div>
            <div className="">
                <EditorContent editor={editor} />
            </div>

            <Button
                className="absolute bottom-8 right-8"
                onClick={askAI}
            >
                Ask AI
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{topic ? topic : (
                            <Skeleton className="w-[200px] h-[20px] rounded-full"></Skeleton>
                        )}</DialogTitle>
                        <DialogDescription>Answer the following questions</DialogDescription>
                    </DialogHeader>
                    {
                        questions.length ? 
                        (
                            <ol className="list-decimal">
                                {questions.map((question, i) => {
                                    return (
                                        <li key={i} className="ml-4 mb-6">{question}</li>
                                    )
                                })}
                            </ol>
                        ) : 
                        (
                            <div>
                                <Skeleton className="w-[100px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[200px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[200px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[100px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[100px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[200px] h-[20px] rounded-full mb-5"></Skeleton>
                                <Skeleton className="w-[100px] h-[20px] rounded-full mb-5"></Skeleton>
                            </div>
                        )
                    }
                </DialogContent>
            </Dialog>

        </div>
    );
}
