type AdmissionData = {
  universityName: string
  program: string
  gpa: string
  untScore: string
  ielts: string
  sat: string
  budget: string
  universityRequirements: string[]
  universityDeadlines: string[]
  programTuitionFee?: string
}

export const predictAdmissionChance = async (
  data: AdmissionData,
): Promise<{ chance: number; explanation: string }> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
    )
  }

  if (!apiKey.startsWith('AIza')) {
    throw new Error(
      'Invalid Gemini API key format. API keys should start with "AIza".',
    )
  }

  const prompt = `You are an expert university admissions counselor. Analyze the following student profile and university information to predict the admission chance as a percentage (0-100).

University: ${data.universityName}
Program: ${data.program}
University Requirements: ${data.universityRequirements.join(', ')}
Deadlines: ${data.universityDeadlines.join(', ')}
Program Tuition: ${data.programTuitionFee || 'Not specified'}

Student Profile:
- GPA: ${data.gpa}
- UNT Score: ${data.untScore}
- IELTS: ${data.ielts}
- SAT: ${data.sat}
- Budget: ${data.budget}

Provide your analysis in the following JSON format:
{
  "chance": <number between 0-100>,
  "explanation": "<detailed explanation of why this percentage, considering all factors including academic performance, test scores, financial capacity, and how they align with university requirements>"
}

Only return valid JSON, no additional text.`

  const endpoints = [
    {
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      name: 'gemini-1.5-flash-latest (v1)',
    },
    {
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      name: 'gemini-1.5-pro-latest (v1)',
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      name: 'gemini-1.5-flash (v1beta)',
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      name: 'gemini-1.5-pro (v1beta)',
    },
  ]
  let lastError: Error | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      })

      if (!response.ok) {
        const errorData = await response.text()
        lastError = new Error(
          `Gemini API error (${endpoint.name}): ${response.status} - ${errorData}`,
        )
        continue
      }

      const result = await response.json()

      if (
        !result.candidates ||
        !result.candidates[0] ||
        !result.candidates[0].content ||
        !result.candidates[0].content.parts ||
        !result.candidates[0].content.parts[0]
      ) {
        lastError = new Error('Invalid response format from Gemini API')
        continue
      }

      const text = result.candidates[0].content.parts[0].text.trim()

      let jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        lastError = new Error('No JSON found in response')
        continue
      }

      const parsed = JSON.parse(jsonMatch[0])

      if (typeof parsed.chance !== 'number' || !parsed.explanation) {
        lastError = new Error('Invalid response format')
        continue
      }

      return {
        chance: Math.max(0, Math.min(100, parsed.chance)),
        explanation: parsed.explanation,
      }
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error('Failed to get admission prediction')
      continue
    }
  }

  const errorMessage =
    lastError?.message ||
    'All Gemini API endpoints failed. Please check:\n' +
      '1. Your API key is correct and starts with "AIza"\n' +
      '2. Gemini API is enabled in your Google Cloud project\n' +
      '3. Your API key has the necessary permissions\n' +
      '4. You are using a valid Gemini API key (not a different Google API key)'

  throw new Error(errorMessage)
}

