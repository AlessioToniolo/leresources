import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { userInput, businesses } = req.body;
    
    if (!process.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key is not set');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for seniors in Atlanta, providing information about local businesses and assistance with daily tasks. Be concise, clear, and friendly in your responses. Use the following business information when relevant: ${JSON.stringify(businesses)}`
          },
          { role: 'user', content: userInput }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    if (!response.data.content || response.data.content.length === 0) {
      throw new Error('Unexpected response from Anthropic API');
    }

    res.json({ text: response.data.content[0].text });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      res.status(500).json({ error: `Error from Anthropic API: ${error.message}` });
    } else {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});