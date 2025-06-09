import { Button, buttonVariants } from "@/components/ui/button";
import { Undo, Redo, Bold, AlignLeft, AlignRight, AlignCenter } from "lucide-react";

export default function EditorMenu({ editor }) {
    return (
        <div className="w-full flex gap-x-3">
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                variant="outline"
                size="icon"
            >
                <Undo />
            </Button>

            <Button
                onClick={() => editor.chain().focus().redo().run()}
                variant="outline"
                size="icon"
            >
                <Redo />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                variant="outline"
                size="icon"
            >
                <AlignLeft />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                variant="outline"
                size="icon"
            >
                <AlignCenter />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                variant="outline"
                size="icon"
            >
                <AlignRight />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant="outline"
                size="icon"
            >
                <Bold strokeWidth={4}/>
            </Button>

            
        </div>
    )
}