import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";
import { auth } from "@/lib/auth"
import { headers } from 'next/headers'

export default async function DashboardLayout({children, params}){
    const { id } = await params;

    async function fetchNotes(){
        const { session } = await auth.api.getSession({
            headers: headers(), // pass the headers
        }); 

        fetch(process.env.URL+'/api/notes?user_id='+session.userId, {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
    }

    const notes = await fetchNotes();
    console.log("notes: " + notes);

    return (
        <main className="">
            <div className="flex justify-between items-stretch bg-sidebar min-h-svh dark">
                <SidebarProvider>
                    <AppSidebar notes={notes}/>
                    <div>
                        <SidebarTrigger />
                        {children}
                    </div>
                </SidebarProvider>
            </div>
        </main>
    )
}