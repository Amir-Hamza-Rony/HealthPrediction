import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import { getFallbackPrediction } from '../utils/fallbackPredictions.js'

const router = Router()

const cache = new Map()
const CACHE_TTL = 10 * 60 * 1000

function getCacheKey(symptoms, age, gender) {
  return JSON.stringify({ symptoms: [...symptoms].sort(), age, gender })
}

router.post('/predict', async (request, response) => {
  try {
    const { symptoms, age, gender } = request.body

    if (!symptoms || symptoms.length === 0) {
      return response.status(400).json({ message: 'No symptoms provided' })
    }

    const cacheKey = getCacheKey(symptoms, age, gender)
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Returning cached prediction')
      return response.json({ result: cached.data, cached: true })
    }

    const apiKey = process.env.GEMINI_API_KEY

    let result = null

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' },
          },
        })

        const symptomList = symptoms.join(', ')
        const prompt = `You are a medical AI assistant. Based on the following information, provide a health analysis.

Patient Info:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms: ${symptomList}

Analyze the symptoms and provide your response in valid JSON format (no markdown, no code fences) with exactly these fields:
{
  "disease": "name of the most likely condition or disease in Bengali",
  "description": "brief description of the condition in Bengali",
  "confidence": 85,
  "severity": "হালকা or মধ্যম or গুরুতর",
  "recommendations": ["recommendation 1 in Bengali", "recommendation 2 in Bengali"],
  "warning": "any urgent warning in Bengali"
}`

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        })

        const text = aiResponse.text

        if (text) {
          const cleanJson = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          result = JSON.parse(cleanJson)
        }
      } catch (err) {
        console.error('Gemini API failed, using fallback:', err.message)
      }
    }

    if (!result) {
      console.log('Using fallback prediction')
      result = getFallbackPrediction(symptoms)
    }

    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return response.json({ result })
  } catch (error) {
    console.error('AI prediction error:', error)
    return response.status(500).json({ message: error.message || 'AI prediction failed' })
  }
})

export default router
