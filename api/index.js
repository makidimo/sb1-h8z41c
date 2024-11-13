import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { story, assessment } = req.body;

    if (!story?.trim()) {
      return res.status(400).json({ error: 'Please complete your career story first.' });
    }

    if (!assessment?.time || !assessment?.budget || !assessment?.timeline) {
      return res.status(400).json({ error: 'Please complete all assessment sections.' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert career evolution advisor specializing in AI and technology careers. Analyze the user's situation and provide detailed, structured guidance that is specific, actionable, and carefully tailored to their time and budget constraints. Focus on practical, achievable steps and realistic market opportunities."
        },
        {
          role: "user",
          content: `Analyze this professional's career situation and provide structured guidance:
    
          Story: "${story.trim()}"
          
          Available learning time: ${assessment.time}
          Learning budget: ${assessment.budget}
          Desired timeline: ${assessment.timeline}
          
          Please provide detailed career guidance including:
          1. Career direction title and description
          2. Key skills to develop with proficiency levels
          3. Market statistics (demand, salary range, growth rate)
          4. Specific learning resources within their time/budget constraints
          5. Key milestones for their journey
          
          Format the response as a structured JSON object matching the CareerResponse type.
          Ensure all recommendations are specific, actionable, and within the user's constraints.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process request'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});