import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { revalidateTag } from 'next/cache'

let connectionParams =  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
}

export async function GET(request, {params}){
    const { id } = await params;

    const connection = await mysql.createConnection(connectionParams)
    const [results] = await connection.execute("SELECT * FROM note where id = ?", [id])

    return NextResponse.json({results}, {status: 200})
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const connection = await mysql.createConnection(connectionParams);
        
        // Delete the note from the database
        const [result] = await connection.execute("DELETE FROM note WHERE id = ?", [id]);
        
        await connection.end();

        if (result.affectedRows === 0) {
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