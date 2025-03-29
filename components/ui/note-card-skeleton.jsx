import { Skeleton } from "./skeleton"

export default function NoteCardSkeleton(){
    return (
        <div 
            className={`text-white px-4 py-6 space-y-2`}
        >
            <Skeleton className="h-4 w-5/12" />
            <Skeleton className="h-4 w-full" />
        </div>
    )
}