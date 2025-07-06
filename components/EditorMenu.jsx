import { Button } from "@/components/ui/button";
import { Undo, Redo, Bold, Italic, Underline, AlignLeft, AlignRight, AlignCenter, Subscript, Superscript, Trash2 } from "lucide-react";
import { redirect } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function EditorMenu({ editor, onDeleteNote }) {

    function handleDelete(){
        onDeleteNote().then((result) => {
            console.log(result);
            if(result.success){
                redirect('/notes');
            }
        });
    }

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
                className={editor.isActive({ textAlign: 'left' }) ? 'dark:bg-zinc-800' : ''}
            >
                <AlignLeft />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                variant="outline"
                size="icon"
                className={editor.isActive({ textAlign: 'center' }) ? 'dark:bg-zinc-800' : ''}
            >
                <AlignCenter />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                variant="outline"
                size="icon"
                className={editor.isActive({ textAlign: 'right' }) ? 'dark:bg-zinc-800' : ''}
            >
                <AlignRight />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant="outline"
                size="icon"
                className={editor.isActive('bold') ? 'dark:bg-zinc-800' : ''}
            >
                <Bold strokeWidth={4}/>
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant="outline"
                size="icon"
                className={editor.isActive('italic') ? 'dark:bg-zinc-800' : ''}
            >
                <Italic />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                variant="outline"
                size="icon"
                className={editor.isActive('underline') ? 'dark:bg-zinc-800' : ''}
            >
                <Underline />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                variant="outline"
                size="icon"
                className={editor.isActive('subscript') ? 'dark:bg-zinc-800' : ''}
            >
                <Subscript />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                variant="outline"
                size="icon"
                className={editor.isActive('superscript') ? 'dark:bg-zinc-800' : ''}
            >
                <Superscript />
            </Button>


            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        // onClick={handleDelete}
                        variant="outline"
                        size="icon"
                        className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}