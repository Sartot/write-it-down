"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from '@tiptap/extension-image'
import { useRef, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import EditorMenu from "@/components/EditorMenu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Textarea } from "@/components/ui/textarea"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { v4 } from "uuid";
import { getAIQuestions, getAIEvaluation } from "@/lib/utils";

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

    const router = useRouter();

    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState([]);

    const answersRef = useRef([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [answersData, setAnswersData] = useState([]);

    const [api, setApi] = useState();

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
            Underline,
            Subscript,
            Superscript,
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

        const response = await getAIQuestions(editor.getHTML());

        const data = JSON.parse(response.text);
        console.log(data);
        setTopic(data[0].topic);
        setQuestions(data[0].questions);
    }


    async function checkAnswersAI(){
        setLoadingAnswers(true);

        var answersArr = questions.map((question, index) => ({
            question: question,
            student_answer: answersRef.current[index]?.value || ""
        }));

        const response = await getAIEvaluation(JSON.stringify(answersArr));
        const data = JSON.parse(response.text);
        setAnswersData(data);
        api.scrollTo(0);
    }

    async function deleteNote(){
        if (!note?.id) return;

        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(response);

            if (response.ok) {
                // Redirect to notes page after successful deletion
                router.push("/notes");
            }
            //  else {
            //     console.error('Failed to delete note');
            //     alert('Failed to delete note. Please try again.');
            // }
        } catch (error) {
            console.log(error);
            alert('Error deleting note. Please try again.');
        }
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
            {editor ? (
                <>
                    <div className="py-4">
                        <EditorMenu editor={editor} onDeleteNote={note?.id ? deleteNote : null} />
                    </div>
                    <div className="">
                        <EditorContent editor={editor} />
                    </div>
                </>
            ) : (
                <></>
            )}

            <Button
                className="absolute bottom-8 right-8"
                onClick={askAI}
            >
                Study with AI
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {topic
                                ? topic
                                : <Skeleton className="w-[200px] h-[20px] rounded-full"></Skeleton>
                            }
                        </DialogTitle>
                        <DialogDescription>
                            {answersData && answersData.length 
                                ? "Check your results" 
                                : "Answer the following questions"
                            }
                        </DialogDescription>
                    </DialogHeader>
                    {
                        questions.length ? 
                        (
                            <Carousel orientation="vertical" className="my-10" setApi={setApi}>
                                <CarouselPrevious/>
                                <CarouselContent className="h-[400px]">
                                    {questions.map((question, i) => {
                                        var btn = null;
                                        if(i == questions.length-1){
                                            btn = (
                                                <Button className={`mt-4`} onClick={checkAnswersAI} disabled={loadingAnswers}>
                                                    {loadingAnswers ? "Loading..." : "Submit"}
                                                </Button>
                                            )
                                        }

                                        return (
                                            <CarouselItem key={i} className="h-[400px]">
                                                <Card className="h-full flex flex-col">
                                                    <CardHeader className="flex-shrink-0">
                                                        <CardTitle>{i+1}. {question}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex-1 flex flex-col min-h-0">
                                                        {
                                                            answersData && answersData.length 
                                                            ? (
                                                                <ScrollArea>
                                                                    <div className="flex flex-col gap-y-5">
                                                                        <p><strong>Your answer:</strong> {answersData[i].student_answer || "N/A"}</p>
                                                                        <p><strong>Score:</strong> {answersData[i].score}</p>
                                                                        <p><strong>Evaluation:</strong> {answersData[i].evaluation}</p>
                                                                        <p><strong>Explanation:</strong> {answersData[i].explanation}</p>
                                                                        <p><strong>Tips:</strong> {answersData[i].study_tip}</p>
                                                                    </div>
                                                                    <ScrollBar />
                                                                </ScrollArea>
                                                            ) : (
                                                                <div className="flex flex-col flex-1 min-h-0">
                                                                    <Textarea 
                                                                        ref={el => answersRef.current[i] = el} 
                                                                        className="user-answer resize-none flex-1 min-h-0" 
                                                                        placeholder="Type your answer here."
                                                                    />
                                                                    {btn && (
                                                                        <div className="mt-4">
                                                                            {btn}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        }
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>
                                <CarouselNext/>
                            </Carousel>
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
