import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export async function getAIQuestions(content) {
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

export async function getAIEvaluation(content){
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
}