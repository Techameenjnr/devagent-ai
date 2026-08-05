export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }
  
    try {
      const { code, problem, language } = req.body;
  
      if (!code || !problem) {
        return res.status(400).json({
          error: "Code and problem are required",
        });
      }
  
      const apiKey = process.env.GEMINI_API_KEY;
  
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured",
        });
      }
  
      const prompt = `
  You are DevAgent, an AI software engineering debugging agent.
  
  Analyze the developer's code and reported problem.
  
  Language:
  ${language}
  
  Developer's problem:
  ${problem}
  
  Code:
  ${code}
  
  Return a professional debugging report with these sections:
  
  PROBLEM
  ROOT CAUSE
  RECOMMENDED FIX
  CORRECTED CODE
  TESTS
  EXPLANATION
  
  Be technically accurate.
  Do not invent information.
  If the code is incomplete, clearly say what is missing.
  Explain the reasoning in a way a beginner developer can understand.
  `;
  
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
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
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Gemini error:", data);
  
        return res.status(response.status).json({
          error: "Gemini request failed",
          details: data,
        });
      }
  
      const analysis =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      if (!analysis) {
        return res.status(500).json({
          error: "Gemini returned no analysis",
        });
      }
  
      return res.status(200).json({
        analysis,
      });
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }