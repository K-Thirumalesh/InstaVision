import fetch from 'node-fetch';  // Importing the fetch library

const url = 'https://ai-image-generator3.p.rapidapi.com/generate';

const options = {
  method: 'POST',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,  // Use an environment variable for the API key
    'x-rapidapi-host': 'ai-image-generator3.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: '',  // We'll pass the prompt dynamically
    page: 1
  })
};

export const generatePost = async (prompt) => {
  try {
    // Update the body with the dynamic prompt
    options.body = JSON.stringify({
      prompt: `Generate a social media post about: ${prompt}`,  // Inject the prompt dynamically
      page: 1
    });

    const response = await fetch(url, options);  // Making the POST request
    const result = await response.json();  // Parse the response as JSON

    // Check if the response contains the content
    if (result && result.content) {
      return { content: result.content.trim() };  // Return the generated content
    } else {
      throw new Error('Failed to generate content');
    }
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post');
  }
};
