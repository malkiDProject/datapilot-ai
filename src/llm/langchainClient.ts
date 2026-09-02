import { ChatOpenAI } from '@langchain/openai';

export function getLLM(): ChatOpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return new ChatOpenAI({
    apiKey,
    temperature: 0,
    model: 'gpt-5.4-mini',
  });
}

export default getLLM;
