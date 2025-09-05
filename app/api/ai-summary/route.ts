import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const apiUrl = process.env.GEMINI_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }

    const prompt = `Please provide a concise, professional summary of the following article in exactly 2 sentences: ${content.substring(0, 2000)}`;

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI Summary API error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}