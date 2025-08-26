import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request) {
    try {
        const { content } = await request.json();
        
        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_KEY
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

        return NextResponse.json({ 
            text: response.text 
        });

    } catch (error) {
        console.error('Error generating AI questions:', error);
        return NextResponse.json(
            { error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}
