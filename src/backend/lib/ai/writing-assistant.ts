"use server";

import { getAICompletion } from './client';

/**
 * Generate headline suggestions from article content
 * @param content Article content (first few paragraphs)
 * @returns Array of headline suggestions
 */
export async function generateHeadlines(content: string): Promise<string[]> {
  const prompt = `
প্রদত্ত নিবন্ধের বিষয়বস্তু থেকে ৫টি আকর্ষণীয় শিরোনাম তৈরি করুন:

${content.substring(0, 500)}

নির্দেশনা:
- শিরোনামগুলি সংক্ষিপ্ত এবং স্পষ্ট হতে হবে
- সংবাদের মূল বিষয় প্রতিফলিত হতে হবে
- বাংলায় লিখুন
- প্রতিটি শিরোনাম একটি নতুন লাইনে দিন
  `;

  const response = await getAICompletion(prompt, {
    model: 'gemini-3-flash-preview',
    temperature: 0.8,
    maxTokens: 300,
  });

  // Parse response into array
  return response
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 5);
}

/**
 * Generate meta description for SEO
 * @param title Article title
 * @param content Article content
 * @returns Meta description
 */
export async function generateMetaDescription(
  title: string,
  content: string
): Promise<string> {
  const prompt = `
শিরোনাম: ${title}

নিবন্ধ: ${content.substring(0, 500)}

এই নিবন্ধের জন্য একটি SEO-friendly মেটা বর্ণনা (150-160 অক্ষর) তৈরি করুন।
শুধুমাত্র বর্ণনা দিন, কোনো অতিরিক্ত ব্যাখ্যা ছাড়া।
  `;

  return await getAICompletion(prompt, {
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 100,
  });
}

/**
 * Complete a sentence or paragraph
 * @param context Previous context
 * @param currentText Current incomplete text
 * @returns Completion suggestion
 */
export async function completeText(
  context: string,
  currentText: string
): Promise<string> {
  const prompt = `
প্রসঙ্গ: ${context}

বর্তমান অসম্পূর্ণ বাক্য: ${currentText}

এই বাক্যটি সম্পূর্ণ করুন। শুধুমাত্র বাক্যের বাকি অংশ দিন।
  `;

  return await getAICompletion(prompt, {
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 100,
  });
}

/**
 * Adjust tone of text
 * @param text Original text
 * @param targetTone Target tone (formal, conversational, etc.)
 * @returns Adjusted text
 */
export async function adjustTone(
  text: string,
  targetTone: 'formal' | 'conversational' | 'urgent' | 'neutral'
): Promise<string> {
  const toneDescriptions = {
    formal: 'আনুষ্ঠানিক এবং পেশাদার',
    conversational: 'কথোপকথন এবং সহজবোধ্য',
    urgent: 'জরুরি এবং গুরুত্বপূর্ণ',
    neutral: 'নিরপেক্ষ এবং তথ্যমূলক',
  };

  const prompt = `
নিম্নলিখিত টেক্সটটি "${toneDescriptions[targetTone]}" টোনে পুনর্লিখন করুন:

${text}

শুধুমাত্র পুনর্লিখিত টেক্সট দিন।
  `;

  return await getAICompletion(prompt, {
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 500,
  });
}

/**
 * Calculate readability score (Flesch Reading Ease for Bangla)
 * @param text Text to analyze
 * @returns Readability analysis
 */
export async function analyzeReadability(text: string): Promise<{
  score: number;
  grade: string;
  suggestions: string[];
}> {
  const prompt = `
নিম্নলিখিত বাংলা টেক্সটের পাঠযোগ্যতা বিশ্লেষণ করুন:

${text}

JSON ফরম্যাটে উত্তর দিন:
{
  "score": 0-100 (100 = সবচেয়ে সহজ),
  "grade": "সহজ" | "মাঝারি" | "কঠিন",
  "suggestions": ["উন্নতির পরামর্শ 1", "পরামর্শ 2"]
}
  `;

  const response = await getAICompletion(prompt, {
    model: 'gemini-3-flash-preview',
    temperature: 0.3,
    maxTokens: 300,
  });

  try {
    return JSON.parse(response);
  } catch {
    return {
      score: 50,
      grade: 'মাঝারি',
      suggestions: ['বিশ্লেষণ করা যায়নি'],
    };
  }
}

/**
 * Translate text (Bangla to English or vice versa)
 * @param text Text to translate
 * @param targetLanguage Target language
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLanguage: 'en' | 'bn'
): Promise<string> {
  const prompts = {
    en: `নিম্নলিখিত বাংলা টেক্সট ইংরেজিতে অনুবাদ করুন:\n\n${text}`,
    bn: `Translate the following English text to Bengali:\n\n${text}`,
  };

  return await getAICompletion(prompts[targetLanguage], {
    model: 'gemini-3-flash-preview',
    temperature: 0.3,
    maxTokens: 1000,
  });
}
