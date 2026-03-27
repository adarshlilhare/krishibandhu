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
        let res = await fetch(`${ML_ENGINE_URL}/predict/disease`, {
            method: 'POST',
            body: mlFormData,
        });

        // Fallback for some common PythonAnywhere / FastAPI path configurations
        if (res.status === 404) {
            console.log(`Primary endpoint 404, trying fallback at ${ML_ENGINE_URL}/api/predict/disease`);
            const resFallback = await fetch(`${ML_ENGINE_URL}/api/predict/disease`, {
                method: 'POST',
                body: mlFormData,
            });
            if (resFallback.ok || resFallback.status !== 404) {
                res = resFallback;
            }
        }

        if (!res.ok) {
            const errorText = await res.text();
            const isHtml = errorText.trim().startsWith('<!doctype html>') || errorText.trim().startsWith('<html');
            const cleanError = isHtml ? `Service at ${ML_ENGINE_URL} returned a 404 HTML page. The endpoint path may be incorrect or the server is not running the FastAPI app.` : errorText;
            
            console.error('ML Engine Response Error:', res.status, errorText);
            return NextResponse.json({ 
                error: `ML Engine Error (${res.status})`, 
                details: cleanError,
                url: res.url
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

