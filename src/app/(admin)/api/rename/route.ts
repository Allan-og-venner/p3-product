"use server"
import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs-extra';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();

    const filePath : string = body.path;
    const newPath : string = body.newPath;

    if (typeof filePath !== 'string') {
        return NextResponse.json({ error: 'Invalid path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        let newFile = path.join(process.cwd(), newPath);

        fs.copySync(file, newFile)
        fs.rmSync(file, { recursive: true });

        return NextResponse.json({status: 200});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}