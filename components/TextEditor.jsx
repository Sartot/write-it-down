"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import History from "@tiptap/extension-history";
import TextAlign from '@tiptap/extension-text-align'


import EditorMenu from "@/components/EditorMenu";

export default function TextEditor() {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            heading: {
                levels: [1, 2, 3]
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        })
        ],
        content: '<p>Hello World! 🌎️</p>',
        immediatelyRender: false,
        autofocus: true,
    })

    return (
        <div className="h-full">
            <div className="py-4 px-5">
                <EditorMenu editor={editor} />
            </div>
            <div className="px-5">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
