import { NextResponse, NextRequest } from 'next/server'
import { query } from '../../../../lib/db'
import { revalidateTag } from 'next/cache'

export async function GET(request, {params}){
    const { id } = await params;

    const result = await query("SELECT * FROM note WHERE id = $1", [id])

    return NextResponse.json({results: result.rows}, {status: 200})
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        // Delete the note from the database
        const result = await query("DELETE FROM note WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        // Invalidate the notes cache
        revalidateTag('notes-data');

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}