export default function NoteCard({ note, active }){
    var content = note.content.replace(/<[^>]+>/g, '');
    const maxChars = 20;
    if(content.length > maxChars){
        content = content.slice(0, maxChars) + "...";
    }

    return (
        <div 
            className={`text-white px-4 py-6 border-y-neutral-600 hover:bg-neutral-800 cursor-pointer ${active ? "bg-neutral-800" : ""}`}
        >
            <p className="text-lg font-semibold">{ note.title }</p>
            <div>{ content }</div>
        </div>
    )
}