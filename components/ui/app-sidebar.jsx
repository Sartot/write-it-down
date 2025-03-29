import { 
    Sidebar, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarGroupAction,
    SidebarSeparator
} from "./sidebar";
import { Button } from "./button";
import { PenLine } from "lucide-react";
import NoteCard from "./note-card";

export default function AppSidebar({ notes, setCurrentNote }){
    async function fetchNote(noteId) {
        return fetch("/api/notes/" + noteId);
    }

    function switchNote(noteId){
        console.log("clicked " + noteId);
        fetchNote(noteId)
        .then((res) => res.json())
        .then((data) => {
            const note = data.results[0];
            setCurrentNote(note)
        })
    }

    return (
        <Sidebar>
            <SidebarHeader>
            <SidebarGroup>
                <SidebarGroupLabel>Crea nota</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarGroupAction>
                            <PenLine />
                        </SidebarGroupAction>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Modifica nota</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {notes.map((note) => (
                                <SidebarMenuItem key={note.id}>
                                    <NoteCard note={note} onClick={() => switchNote(note.id)}/>
                                    <SidebarSeparator />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}