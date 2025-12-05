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
  const groqKey = import.meta.env.VITE_GROQ_API_KEY
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!groqKey && !openaiKey) {
    throw new Error(
      'API key not configured. Please add VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY to your .env file.',
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

  // Try Groq first (free, fast)
  if (groqKey) {
    const groqModels = [
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ]
    let groqError: Error | null = null

    for (const model of groqModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
          }),
        })

        if (!response.ok) {
          const errorData = await response.text()
          groqError = new Error(`Groq API error (${model}): ${response.status} - ${errorData}`)
          continue
        }

        const result = await response.json()
        const content = result.choices[0]?.message?.content

        if (!content) {
          groqError = new Error('No content in Groq response')
          continue
        }

        const parsed = JSON.parse(content)

        if (typeof parsed.chance !== 'number' || !parsed.explanation) {
          groqError = new Error('Invalid response format from Groq')
          continue
        }

        return {
          chance: Math.max(0, Math.min(100, parsed.chance)),
          explanation: parsed.explanation,
        }
      } catch (error) {
        groqError =
          error instanceof Error
            ? error
            : new Error('Failed to get admission prediction from Groq')
        continue
      }
    }

    if (groqError && !openaiKey) {
      throw groqError
    }
  }

  // Fallback to OpenAI
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      const content = result.choices[0]?.message?.content

      if (!content) {
        throw new Error('No content in OpenAI response')
      }

      const parsed = JSON.parse(content)

      if (typeof parsed.chance !== 'number' || !parsed.explanation) {
        throw new Error('Invalid response format from OpenAI')
      }

      return {
        chance: Math.max(0, Math.min(100, parsed.chance)),
        explanation: parsed.explanation,
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error instanceof Error
        ? error
        : new Error('Failed to get admission prediction from OpenAI')
    }
  }

  throw new Error(
    'No working AI API found. Please configure VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY',
  )
}

