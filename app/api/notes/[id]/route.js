import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'

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