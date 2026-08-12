import { NextApiRequest, NextApiResponse } from 'next';

// ============================================================
// Qwen Client — Alibaba Cloud DashScope
// Role: Asian consumer behavior and regional market analysis
// ============================================================

interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenResponse {
  output: {
    text: string;
    finish_reason: string;
  };
  request_id: string;
}

export async function queryQwen(
  messages: QwenMessage[],
  model: string = 'qwen-max'
): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error('QWEN_API_KEY not configured in environment variables');
  }

  const response = await fetch(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: { messages },
        parameters: {
          result_format: 'text',
          temperature: 0.7,
          max_tokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qwen API error (${response.status}): ${errorText}`);
  }

  const data: QwenResponse = await response.json();
  return data.output.text;
}

// ============================================================
// Predefined research prompts for Asian beauty market
// ============================================================

export async function analyzeAsianBeautyTrend(topic: string): Promise<string> {
  const messages: QwenMessage[] = [
    {
      role: 'system',
      content: `You are an Asian beauty market analyst specializing in Gen Z consumer behavior.
Focus on: Chinese, Japanese, Korean, and Southeast Asian markets.
Provide analysis in structured format: trend summary, consumer motivation, cultural context, product opportunities.`,
    },
    {
      role: 'user',
      content: `Analyze the current trend: "${topic}". 
Include: market size, growth rate, key demographics, cultural roots, and which products are driving this trend in Asia.`,
    },
  ];

  return queryQwen(messages);
}

export async function analyzeConsumerFeedback(
  productCategory: string,
  feedbackText: string
): Promise<string> {
  const messages: QwenMessage[] = [
    {
      role: 'system',
      content: `You are a consumer insights analyst. Analyze Asian beauty product feedback.
Identify: sentiment, key themes, improvement opportunities, and cultural preferences.
Output in English with original language terms preserved where culturally significant.`,
    },
    {
      role: 'user',
      content: `Product category: ${productCategory}\n\nConsumer feedback:\n${feedbackText}\n\nProvide structured analysis.`,
    },
  ];

  return queryQwen(messages);
}
