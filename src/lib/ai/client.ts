import { GoogleGenerativeAI } from '@google/generative-ai';

// Singleton pattern for Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Get or create Gemini client instance
 * @returns GoogleGenerativeAI client
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set. Please add it to your .env.local file:\n' +
        'GEMINI_API_KEY=your-api-key-here\n\n' +
        'Get your free API key from: https://makersuite.google.com/app/apikey'
      );
    }

    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

/**
 * Test Gemini connection
 * @returns true if connection successful
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    
    const result = await model.generateContent('Hello, test connection');
    const response = await result.response;
    const text = response.text();
    
    return !!text;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}

/**
 * Get AI completion for a prompt
 * @param prompt User prompt
 * @param options Configuration options
 * @returns AI response
 */
export async function getAICompletion(
  prompt: string,
  options: {
    model?: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash';
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = 'gemini-3-flash-preview', // Use Gemini 3 Flash for better performance
    systemInstruction,
  } = options;

  const client = getGeminiClient();
  
  // System instruction supported in all Gemini 2.x and 3.x models
  const modelConfig: { model: string; systemInstruction?: string } = { model };
  if (systemInstruction && (model.includes('gemini-2') || model.includes('gemini-3'))) {
    modelConfig.systemInstruction = systemInstruction;
  }
  
  const generativeModel = client.getGenerativeModel(modelConfig);

  // All modern models support system instruction natively
  const fullPrompt = prompt;

  try {
    const result = await generativeModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    const err = error as { status?: number; message?: string };
    if (err.status === 429 || err.message?.includes('429')) {
      throw new Error('AI Usage Limit Exceeded. Please try again later.');
    }
    console.error('AI Generation Error:', error);
    throw error;
  }
}

/**
 * Get streaming AI completion
 * @param prompt User prompt
 * @param options Configuration options
 * @returns Stream of AI response
 */
export async function* getAICompletionStream(
  prompt: string,
  options: {
    model?: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash' | 'gemini-2.5-pro';
    systemInstruction?: string;
    temperature?: number;
  } = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = 'gemini-3-flash-preview',
    systemInstruction,
  } = options;

  const client = getGeminiClient();
  
  const modelConfig: { model: string; systemInstruction?: string } = { model };
  if (systemInstruction && (model.includes('gemini-2') || model.includes('gemini-3'))) {
    modelConfig.systemInstruction = systemInstruction;
  }
  
  const generativeModel = client.getGenerativeModel(modelConfig);

  const fullPrompt = prompt;

  try {
    const result = await generativeModel.generateContentStream(fullPrompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    const err = error as { status?: number; message?: string };
    if (err.status === 429 || err.message?.includes('429')) {
      throw new Error('AI Usage Limit Exceeded. Please try again later.');
    }
    console.error('AI Stream Error:', error);
    throw error;
  }
}

/**
 * Calculate cost for API call
 * @param model Model used
 * @param tokens Number of tokens (characters for estimation)
 * @returns Cost in USD
 */
export function calculateAICost(
  model: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash',
  tokens: number
): number {
  // Gemini pricing (as of 2026)
  const pricing = {
    'gemini-3-pro-preview': 0, // FREE during preview
    'gemini-3-flash-preview': 0, // FREE during preview
    'gemini-2.5-pro': 0.00125 / 1000, // $0.00125 per 1K characters (input)
    'gemini-2.5-flash': 0, // FREE up to rate limit
    'gemini-1.5-flash': 0, // FREE
  };

  return tokens * (pricing[model] || 0);
}

/**
 * Get Gemini API rate limits info
 */
export function getGeminiLimits() {
  return {
    'gemini-3-pro-preview': {
      rpm: 60, // requests per minute (preview limits)
      tpm: 1000000, // tokens per minute
      rpd: 1500, // requests per day
    },
    'gemini-3-flash-preview': {
      rpm: 60,
      tpm: 1000000,
      rpd: 1500,
    },
    'gemini-2.5-pro': {
      rpm: 15,
      tpm: 1000000,
      rpd: 1500,
    },
    'gemini-2.5-flash': {
      rpm: 15,
      tpm: 1000000,
      rpd: 1500,
    },
  };
}
