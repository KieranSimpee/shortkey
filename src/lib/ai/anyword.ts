// ============================================================
// Anyword Predictive Engagement Client
// Role: Predict customer engagement with copy and visuals
// ============================================================

interface AnywordPrediction {
  prediction_id: string;
  score: number;
  text: string;
  demographics: {
    age_group: string;
    predicted_ctr: number;
    predicted_engagement: 'low' | 'medium' | 'high';
  }[];
}

export async function predictHeadlineEngagement(
  headline: string,
  context: {
    platform?: 'magazine' | 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
    target_audience?: string;
    tone?: 'editorial' | 'casual' | 'luxury' | 'playful';
  } = {}
): Promise<AnywordPrediction> {
  const apiKey = process.env.ANYWORD_API_KEY;
  if (!apiKey) {
    throw new Error('ANYWORD_API_KEY not configured in environment variables');
  }

  const { platform = 'magazine', target_audience = 'asian_gen_z', tone = 'editorial' } = context;

  const response = await fetch('https://api.anyword.com/v1/predict', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: headline,
      context: {
        platform,
        target_audience,
        tone,
        language: 'en',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anyword API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function generateOptimizedHeadlines(
  topic: string,
  count: number = 5
): Promise<AnywordPrediction[]> {
  const apiKey = process.env.ANYWORD_API_KEY;
  if (!apiKey) {
    throw new Error('ANYWORD_API_KEY not configured in environment variables');
  }

  const response = await fetch('https://api.anyword.com/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate ${count} magazine headlines about ${topic} for Asian Gen Z beauty audience. Editorial tone, culturally aware.`,
      count,
      context: {
        platform: 'magazine',
        target_audience: 'asian_gen_z',
        tone: 'editorial',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anyword API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.predictions || [];
}
