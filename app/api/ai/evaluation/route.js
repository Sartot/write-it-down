import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request) {
    try {
        const { answers } = await request.json();
        
        if (!answers) {
            return NextResponse.json(
                { error: "Answers are required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: JSON.stringify(answers),
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

        return NextResponse.json({ 
            text: response.text 
        });

    } catch (error) {
        console.error('Error evaluating AI answers:', error);
        return NextResponse.json(
            { error: "Failed to evaluate answers" },
            { status: 500 }
        );
    }
}
