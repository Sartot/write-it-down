import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleGenAI, Type } from "@google/genai";
import { v4 } from "uuid";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export async function getAIQuestions(content) {
    const ai = new GoogleGenAI({
        apiKey: "AIzaSyCdAzXQMHFi3nYLpLsNMCK1m85IWwQ1dlM",
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        topic: {
                            type: Type.STRING,
                        },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                    propertyOrdering: ["topic", "questions"],
                },
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

    return response;
}

export async function getAIEvaluation(content) {
    const ai = new GoogleGenAI({
        apiKey: "AIzaSyCdAzXQMHFi3nYLpLsNMCK1m85IWwQ1dlM",
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING,
                        },
                        student_answer: {
                            type: Type.STRING,
                        },
                        evaluation: {
                            type: Type.STRING,
                        },
                        score: {
                            type: Type.NUMBER,
                        },
                        explanation: {
                            type: Type.STRING,
                        },
                        study_tip: {
                            type: Type.STRING,
                        },
                    },
                    propertyOrdering: [
                        "question",
                        "student_answer",
                        "evaluation",
                        "score",
                        "explanation",
                        "study_tip",
                    ],
                },
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

    return response;
}

export async function deleteNote(noteId, onSuccess = null) {
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            if(typeof onSuccess === 'function'){
                onSuccess(noteId);
            }
            return { success: true };
        } else {
            console.error('Failed to delete note');
            return { success: false, error: 'Failed to delete note' };
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        return { success: false, error: 'Error deleting note' };
    }
}

export function updateNote(id, title, content, onSaving = null, onSuccess = null){
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
        if(typeof onSuccess === 'function'){
            onSuccess(id, title, content);
        }
    })
    .catch((error) => {
        console.error("Errore durante l'aggiornamento della nota:", error);
    })
    .finally(() => {
        if(typeof onSaving === 'function'){
            onSaving(false);
        }
    });
}

export function createNote(user_id, title, content, onSuccess = null){
    const newId = v4();
    const request_body = JSON.stringify({
        user_id: user_id,
        id: newId,
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
        console.log("Nota creata con successo:", data);
        if(typeof onSuccess === 'function'){
            onSuccess({
                id: newId,
                user_id: user_id,
                title: title,
                content: content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    })
    .catch((error) => {
        console.error("Errore durante la creazione della nota:", error);
    });
}