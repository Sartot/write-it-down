import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/env";
import { NotesProvider } from "@/contexts/NotesContext";

export default async function DashboardLayout({children, params}){
    const { id } = await params;

    async function fetchNotes(){
        const { session } = await auth.api.getSession({
            headers: await headers(), // pass the headers
        }); 

        // Determina l'URL base dinamicamente
        const baseUrl = getBaseUrl();

        return fetch(baseUrl + '/api/notes?user_id='+session.userId, {
            method: "GET",
            cache: 'no-store' // Disable caching
        }).then(res => res.json());
    }

    const notes = await fetchNotes();
    notes.sort((a, b) => {
        var aDate = new Date(a.updatedAt);
        var bDate = new Date(b.updatedAt);

        return aDate > bDate;
    });

    return (
        <NotesProvider initialNotes={notes}>
            <div className="flex justify-between items-stretch bg-sidebar min-h-svh">
                <SidebarProvider notes={notes}>
                    <AppSidebar selectedId={id}/>
                    <div className="w-full flex flex-col">
                        <SidebarTrigger />
                        {children}
                    </div>
                </SidebarProvider>
            </div>
        </NotesProvider>
    )
}