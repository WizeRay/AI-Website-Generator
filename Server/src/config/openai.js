import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  
});

export default openai;