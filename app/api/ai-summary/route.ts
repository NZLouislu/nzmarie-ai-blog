import { NextRequest, NextResponse } from "next/server";

// Function to delay execution
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to call Gemini API with retry logic
async function callGeminiAPI(
  apiUrl: string,
  apiKey: string,
  prompt: string,
  retries = 3
) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (response.ok) {
        return response;
      }

      // If we get a 429 error, wait before retrying
      if (response.status === 429 && i < retries) {
        // Exponential backoff: wait 1s, 2s, 4s, etc.
        const waitTime = Math.pow(2, i) * 1000;
        console.log(
          `Received 429 error, waiting ${waitTime}ms before retry ${
            i + 1
          }/${retries}`
        );
        await delay(waitTime);
        continue;
      }

      // For other errors, throw immediately
      throw new Error(`Gemini API error: ${response.status}`);
    } catch (error) {
      if (i === retries) {
        throw error;
      }
      // Wait before retrying
      const waitTime = Math.pow(2, i) * 1000;
      console.log(
        `API call failed, waiting ${waitTime}ms before retry ${
          i + 1
        }/${retries}`
      );
      await delay(waitTime);
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(request: NextRequest) {
  try {
    const { content, postId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const apiUrl = process.env.GEMINI_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 }
      );
    }

    const prompt = `Please provide a concise, professional summary of the following article in exactly 2 sentences: ${content.substring(
      0,
      2000
    )}`;

    const response = await callGeminiAPI(apiUrl, apiKey, prompt);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate summary";

    // Track AI summary usage if postId is provided
    if (postId) {
      try {
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = `http://${host}`;
        const statsUrl = `${baseUrl}/api/stats`;

        await fetch(statsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            action: "ai_summary",
            language: "en", // 添加默认语言
          }),
        });
      } catch (statsError) {
        console.error("Failed to track AI summary usage:", statsError);
      }
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again later." },
      { status: 500 }
    );
  }
}
