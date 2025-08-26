import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export async function getAIQuestions(content) {
    try {
        const response = await fetch('/api/ai/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling AI questions API:', error);
        throw error;
    }
}

export async function getAIEvaluation(answers) {
    try {
        const response = await fetch('/api/ai/evaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }),
        });

        if (!response.ok) {
            throw new Error('Failed to evaluate answers');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling AI evaluation API:', error);
        throw error;
    }
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