import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";
import { auth } from "@/lib/auth"
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache';

const getCachedNotes = unstable_cache(
    async (userId) => {
        return fetch(process.env.URL+'/api/notes?user_id='+userId, {
            method: "GET",
        }).then(res => res.json());
    },
    ['notes-data'],
    { revalidate: 60 } // Riconvalida ogni minuto
);

export default async function DashboardLayout({children, params}){
    const { id } = await params;

    async function fetchNotes(){
        const { session } = await auth.api.getSession({
            headers: await headers(), // pass the headers
        }); 

        return getCachedNotes(session.userId);
    }

    const notes = await fetchNotes();

    return (
        <div className="flex justify-between items-stretch bg-sidebar min-h-svh">
            <SidebarProvider notes={notes}>
                <AppSidebar notes={notes} selectedId={id}/>
                <div className="w-full flex flex-col">
                    <SidebarTrigger />
                    {children}
                </div>
            </SidebarProvider>
        </div>
    )
}