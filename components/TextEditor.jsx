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

    const answersRef = useRef([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [answersData, setAnswersData] = useState([]);

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
                systemInstruction: `
                    You are an AI tutor designed to help students review and test their knowledge based on their study notes.
                    You will receive a set of notes written by a student about a specific topic.
                    Your task is to generate a list of clear and relevant questions that help the student actively recall and understand the content.
                    The questions should:
                    - Be based only on the provided notes.
                    - Use the same language as the notes.
                    - Vary in difficulty (easy to challenging).
                    - Include a mix of factual, conceptual, and critical-thinking questions when possible.
                    Do not include answers unless explicitly requested.
                `,
            },
        });

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

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: JSON.stringify(answersArr),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: {
                                type: Type.STRING
                            },
                            student_answer: {
                                type: Type.STRING
                            },
                            evaluation: {
                                type: Type.STRING,
                            },
                            score: {
                                type: Type.NUMBER
                            },
                            explanation: {
                                type: Type.STRING
                            },
                            study_tip: {
                                type: Type.STRING
                            }
                        },
                        propertyOrdering: ["question", "student_answer", "evaluation", "score", "explanation", "study_tip"],
                    }
                },
                systemInstruction: `
                    You are an AI tutor evaluating a student's answers to study questions based on their personal notes.
                    You will receive a list of question/answer pairs provided by the student.
                    For each pair:

                    - Evaluate the correctness of the answer (correct / partially correct / incorrect).
                    - Assign a score from 0 to 1 (1 = fully correct, 0.5 = partially correct, 0 = incorrect).
                    - Provide a brief explanation or correction, if needed.
                    - Suggest a specific study tip or resource to help the student better understand the topic.

                    Base your evaluation strictly on the content of the questions and answers, without external assumptions. The language of the answers should be preserved.
                    Output the results as a structured list in JSON format.
                `,
            },
        });

        const data = JSON.parse(response.text);
        console.log(data);
        setAnswersData(data);
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
                            <Carousel orientation="vertical" className="my-10">
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
                                                                <div className="flex flex-col gap-5 overflow-y-auto flex-1">
                                                                    <p><strong>Your answer:</strong> {answersData[i].student_answer || "N/A"}</p>
                                                                    <p><strong>Score:</strong> {answersData[i].score}</p>
                                                                    <p><strong>Evaluation:</strong> {answersData[i].evaluation}</p>
                                                                    <p><strong>Explanation:</strong> {answersData[i].explanation}</p>
                                                                    <p><strong>Tips:</strong> {answersData[i].study_tip}</p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col flex-1 min-h-0">
                                                                    <Textarea 
                                                                        ref={el => answersRef.current[i] = el} 
                                                                        className="user-answer resize-none flex-1 min-h-0" 
                                                                        placeholder="Type your answer here."
                                                                    />
                                                                    {btn && (
                                                                        <div className="flex-shrink-0 mt-4">
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
