import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'


let connectionParams =  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
}


export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams)

    let get_exp_query = ''
    get_exp_query = 'SELECT * FROM user'

    let values = []
    const [results] = await connection.execute(get_exp_query, values)

    connection.end()

    return NextResponse.json(results)

  } catch (err) {
    console.log('ERROR: API - ', err.message)

    const response = {
      error: err.message,
      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
  }
}


export async function POST(request){
    try{
        const connection = await mysql.createConnection(connectionParams);

        const req_body = await request.json();
        await connection.execute("INSERT INTO note (user_id, title, content) VALUES (?, ?, ?)", [req_body.user_id, req_body.title, req_body.content]);

        connection.end();
        const response = {
            returnedStatus: 200,
        }
        return NextResponse.json(response);
    }catch(err){
        console.log('ERROR: API - ', err.message)

        const response = {
            error: err.message,
            returnedStatus: 200,
        }

        return NextResponse.json(response, { status: 200 })
    }
}