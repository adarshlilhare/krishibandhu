import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ML_ENGINE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://adityameshram05.pythonanywhere.com' 
    : 'http://localhost:8000';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        // Prepare form data for the ML engine
        const mlFormData = new FormData();
        mlFormData.append('file', imageFile);

        console.log(`Fetching ML engine at: ${ML_ENGINE_URL}/predict/disease`);
        const res = await fetch(`${ML_ENGINE_URL}/predict/disease`, {
            method: 'POST',
            body: mlFormData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('ML Engine Response Error:', res.status, errorText);
            return NextResponse.json({ 
                error: `ML Engine Error (${res.status})`, 
                details: errorText 
            }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json(result);

    } catch (e: any) {
        console.error('Next.js Route Exception:', e.message);
        return NextResponse.json({ 
            error: "Failed to connect to ML Engine", 
            details: e.message 
        }, { status: 500 });
    }
}

