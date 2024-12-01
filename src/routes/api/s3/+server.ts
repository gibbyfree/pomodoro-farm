import type { RequestHandler } from '@sveltejs/kit';
import { saveToS3 } from '$lib/storage.server';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const key = formData.get('key') as string + '.png';

        if (!file || !key) {
            return new Response(JSON.stringify({ error: 'Missing file or key' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('POST', { file, key });

        const response = await saveToS3(buffer, key);
        return new Response(JSON.stringify({ response }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to save to S3" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};