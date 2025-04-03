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
import Link from 'next/link'


export default function AppSidebar({ notes, selectedId }){
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
                                            <Link
                                                href={`/notes/${note.id}`}
                                            >
                                                <NoteCard note={note} active={note.id == selectedId}/>
                                            </Link>
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