import { NextResponse, NextRequest } from 'next/server'
import { query } from '../../../lib/db'
import { revalidateTag } from 'next/cache'


export async function GET(request) {
  try {
    let get_exp_query = 'SELECT * FROM note WHERE user_id = $1'
    let user = request.nextUrl.searchParams.get("user_id");
    
    const result = await query(get_exp_query, [user])
    
    revalidateTag('notes-data');

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
        const req_body = await request.json();
        await query("INSERT INTO note (user_id, id, title, content) VALUES ($1, $2, $3, $4)", [req_body.user_id, req_body.id, req_body.title, req_body.content]);

        const response = {
            returnedStatus: 201,
        }

        revalidateTag('notes-data');
        
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
        const req_body = await request.json();
        const id = req_body.id;
        const title = req_body?.title;
        const content = req_body?.content;
        const updatedAt = require('moment')().format('YYYY-MM-DD HH:mm:ss');

        var fields = [];
        var values = [];
        let paramIndex = 1;
        
        if(title){
            fields.push(`title = $${paramIndex++}`);
            values.push(title);
        }
        if(content){
            fields.push(`content = $${paramIndex++}`);
            values.push(content);
        }

        values.push(updatedAt);
        values.push(id);

        const result = await query(`UPDATE note SET ${fields.join(", ")}, updatedAt = $${paramIndex++} WHERE id = $${paramIndex}`, values);
        
        revalidateTag('notes-data');
        
        return NextResponse.json({ result }, { status: 200 });
    }catch(err){
        console.log(err);
        return NextResponse.json({ err }, { status: 500 });
    }
}