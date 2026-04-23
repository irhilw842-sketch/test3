import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: { sizeLimit: '10mb' },
    },
};

export default async function handler(req, res) {
    // Only allow POST requests from the frontend
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { image, location } = req.body;

        if (!image || !location) {
            return res.status(400).json({ error: 'Missing image or location payload.' });
        }

        // 1. Convert base64 to a real image file buffer
        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // 2. Create a unique filename for test1
        const filename = `test1-photo-${Date.now()}.png`;

        // 3. Upload to Vercel Blob
        const blob = await put(filename, imageBuffer, {
            access: 'private', // Keep this as private!
            contentType: 'image/png'
        });

        // 4. Print the data to Vercel Logs for you to see
        console.log("========== TEST1 NEW CLIENT ==========");
        console.log("Latitude:", location.latitude);
        console.log("Longitude:", location.longitude);
        console.log("Photo Link:", blob.url);
        console.log("======================================");

        // 5. Tell the frontend everything worked perfectly
        return res.status(200).json({ 
            success: true,
            imageUrl: blob.url 
        });

    } catch (error) {
        // If it fails, log the specific error to the Vercel dashboard
        console.error("Vercel Backend Error:", error);
        return res.status(500).json({ error: 'Failed to upload file to Vercel Blob.' });
    }
}