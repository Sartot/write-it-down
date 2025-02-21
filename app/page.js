import TextEditor from "@/components/TextEditor";

export default function Home() {
    return (
        <main className="flex justify-between items-center bg-neutral-900 h-svh">
            <div className="w-3/12 h-full bg-slate-300">

            </div>
            <div className="w-8/12 h-full bg-slate-50">
                <TextEditor />
            </div>
        </main>
    );
}
