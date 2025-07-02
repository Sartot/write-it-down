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
    SidebarSeparator
} from "./sidebar";

import NoteCard from "./note-card";
import NoteCardSkeleton from "./note-card-skeleton";
import Link from 'next/link'
import CreateNoteButton from '@/components/ui/create-note'
import { PenLine } from "lucide-react";

export default function AppSidebar({ className, notes, selectedId }){
    
    return (
        <Sidebar className={className}>
            <SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>Crea nota</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <div className="flex items-center gap-2 w-full p-2">
                                    <CreateNoteButton />
                                </div>
                            </SidebarMenuItem>
                        </SidebarMenu>
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
                                            <Link href={`/notes/${note.id}`}>
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