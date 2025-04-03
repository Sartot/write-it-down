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
import { PenLine } from "lucide-react";
import NoteCard from "./note-card";
import NoteCardSkeleton from "./note-card-skeleton";


export default function AppSidebar({ notes }){
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
                            {
                                notes && notes.length ? (
                                    notes.map((note) => (
                                        <SidebarMenuItem key={note.id}>
                                            <NoteCard note={note} onClick={() => console.log("click")}/>
                                            <SidebarSeparator />
                                        </SidebarMenuItem>
                                    ))
                                ) : (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <SidebarMenuItem key={index}>
                                          <NoteCardSkeleton />
                                          <SidebarSeparator />
                                        </SidebarMenuItem>
                                    ))
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}