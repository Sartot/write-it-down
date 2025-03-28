export default function NoteCard({ note, active, onClick }){
    var content = note.content.replace(/<[^>]+>/g, '');
    const maxChars = 20;
    if(content.length > maxChars){
        content = content.slice(0, maxChars) + "...";
    }

    return (
        <div 
            className={`text-white px-4 py-6 border-t-2 border-b-2 ${active ? "bg-neutral-700" : ""}`}
            onClick={onClick}
        >
            <p className="text-lg font-semibold">{ note.title }</p>
            <div>{ content }</div>
        </div>
    )
}