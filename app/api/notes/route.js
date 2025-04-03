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
    get_exp_query = 'SELECT * FROM note where user_id = ?'

    let user = request.nextUrl.searchParams.get("user_id");
    // console.log(user);
    let values = [user]
    const [results] = await connection.execute(get_exp_query, values)
    // console.log(results);
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
            returnedStatus: 201,
        }
        return NextResponse.json(response);
    }catch(err){
        console.log('ERROR: API - ', err.message)

        const response = {
            error: err.message,
            returnedStatus: 500,
        }

        return NextResponse.json(response, { status: 200 })
    }
}


export async function PUT(request){
    try{
        const connection = await mysql.createConnection(connectionParams)
        const req_body = await request.json();
        const id = req_body.id;
        const title = req_body.title;
        const content = req_body.content;
        const updatedAt = require('moment')().format('YYYY-MM-DD HH:mm:ss');

        const result = await connection.execute("UPDATE note SET content = ?, updatedAt = ? where id = ?", [content, updatedAt, id]);
        return NextResponse.json({ result }, { status: 200 });
    }catch(err){
        return NextResponse.json({ err }, { status: 500 });
    }
}