import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";
import { auth } from "@/lib/auth"
import { headers } from 'next/headers'

export default async function DashboardLayout({children, params}){
    const { id } = await params;

    async function fetchNotes(){
        const { session } = await auth.api.getSession({
            headers: await headers(), // pass the headers
        }); 

        return fetch(process.env.URL+'/api/notes?user_id='+session.userId, {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
    }

    const notes = await fetchNotes();

    return (
        <div className="flex justify-between items-stretch bg-sidebar min-h-svh">
            <SidebarProvider>
                <AppSidebar notes={notes} selectedId={id}/>
                <div className="w-full">
                    <SidebarTrigger />
                    {children}
                </div>
            </SidebarProvider>
        </div>
    )
}