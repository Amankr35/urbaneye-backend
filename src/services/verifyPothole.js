import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function verifyPothole(imageUrl) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Fetch image and convert to base64
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    const prompt = `Analyze this image. Respond ONLY with a JSON object, no extra text:
{
  "is_pothole": true or false,
  "confidence": 0-100,
  "severity": "minor" or "moderate" or "severe" or null,
  "reason": "one sentence"
}

Severity guide:
- minor: small surface crack or shallow depression under 5cm
- moderate: visible hole 5-15cm deep affecting one lane
- severe: large hole over 15cm deep, safety hazard
- null if not a pothole

Reject blurry photos, indoor floors, footpaths, and non-road surfaces.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      }
    ]);

    const text = result.response.text().trim();

    // Clean up response in case Gemini adds markdown
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (err) {
    console.error('Gemini error:', err);
    return {
      is_pothole: false,
      confidence: 0,
      severity: null,
      reason: 'Verification failed, please try again'
    };
  }
}