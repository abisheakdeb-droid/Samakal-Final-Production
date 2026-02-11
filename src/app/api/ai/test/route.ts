import { NextRequest, NextResponse } from 'next/server';
import { testGeminiConnection, getAICompletion } from '@/lib/ai/client';

/**
 * Test Gemini API connection
 * GET /api/ai/test
 */
export async function GET(_request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GEMINI_API_KEY not configured',
          message: 'Please set GEMINI_API_KEY in your .env.local file',
          setup: 'Get your free API key from: https://makersuite.google.com/app/apikey'
        },
        { status: 500 }
      );
    }

    // Test connection
    const isConnected = await testGeminiConnection();

    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Connection test failed',
          message: 'Could not connect to Gemini API. Check your API key.'
        },
        { status: 500 }
      );
    }

    // Test Bengali support with Gemini 3 Flash
    const response = await getAICompletion(
      'এই বার্তাটি বাংলায় নিশ্চিত করুন: "Gemini 3 Flash AI সংযোগ সফল হয়েছে"',
      {
        model: 'gemini-3-flash-preview',
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Gemini 3 Flash AI connection successful',
      provider: 'Google Gemini 3',
      model: 'gemini-3-flash-preview',
      bengaliTest: response,
      timestamp: new Date().toISOString(),
      limits: {
        free: true,
        rpm: 60,
        tpm: 1500000,
      }
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        error: errorMsg,
        message: 'An error occurred while testing the connection'
      },
      { status: 500 }
    );
  }
}

/**
 * Test AI writing assistant features
 * POST /api/ai/test
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feature, input } = body;

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature parameter is required' },
        { status: 400 }
      );
    }

    let result;

    switch (feature) {
      case 'headline':
        const { generateHeadlines } = await import('@/lib/ai/writing-assistant');
        result = await generateHeadlines(input);
        break;

      case 'completion':
        result = await getAICompletion(input);
        break;

      case 'translate':
        const { translateText } = await import('@/lib/ai/writing-assistant');
        result = await translateText(input, 'en');
        break;

      default:
        return NextResponse.json(
          { error: `Unknown feature: ${feature}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      feature,
      result,
      provider: 'Google Gemini',
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        error: errorMsg 
      },
      { status: 500 }
    );
  }
}
