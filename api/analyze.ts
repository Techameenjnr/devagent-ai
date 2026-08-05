export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const { code, problem, language } = req.body || {};

    if (!code || !problem) {
      return res.status(400).json({
        error: 'Code and problem are required',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing from Vercel environment variables',
      });
    }

    const prompt = `
You are DevAgent, an AI software engineering debugging agent.

Analyze this ${language} code.

DEVELOPER PROBLEM:
${problem}

CODE:
${code}

Give a clear debugging report containing:

1. Problem
2. Root Cause
3. Recommended Fix
4. Corrected Code
5. Tests
6. What the Developer Learned

Be specific to the code provided.
Do not give a generic answer.
`;

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
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
      }
    );

    const rawText = await geminiResponse.text();

    console.log('Gemini status:', geminiResponse.status);
    console.log('Gemini response:', rawText);

    if (!geminiResponse.ok) {
      return res.status(502).json({
        error: 'Gemini API request failed',
        details: rawText,
      });
    }

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(502).json({
        error: 'Gemini returned an invalid response',
        details: rawText,
      });
    }

    const analysis =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysis) {
      return res.status(502).json({
        error: 'Gemini returned no analysis',
        details: data,
      });
    }

    
    return res.status(200).json({
      analysis,
    });
  } catch (error) {
    console.error('DevAgent API error:', error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unexpected server error',
    });
  }
}