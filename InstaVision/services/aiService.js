import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generatePost = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Generate a social media post about: ${prompt}`,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.8,
    });

    return { content: response.choices[0].text.trim() };
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post');
  }
};

