import { NextResponse, NextRequest } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(request) {
  try {
    let get_exp_query = 'SELECT * FROM "user"'
    const result = await query(get_exp_query, [])

    return NextResponse.json(result.rows)

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