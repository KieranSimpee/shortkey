// ============================================================
// Perplexity Research Client
// Role: Real-time beauty trend research and market intelligence
// ============================================================

interface PerplexityResponse {
  answer: string;
  citations: Array<{
    title: string;
    url: string;
  }>;
}

export async function researchBeautyTrend(
  topic: string,
  options: {
    region?: 'asia' | 'global';
    timeframe?: 'recent' | 'month' | 'quarter';
    depth?: 'summary' | 'detailed';
  } = {}
): Promise<PerplexityResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured in environment variables');
  }

  const { region = 'asia', timeframe = 'recent', depth = 'detailed' } = options;

  const prompt = `Research the beauty trend "${topic}" focusing on ${region} markets.
Timeframe: ${timeframe}.
${depth === 'detailed' ? 'Provide detailed analysis with market data, consumer demographics, cultural context, and product examples.' : 'Provide a concise summary.'}
Include sources and citations.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a beauty industry research analyst specializing in Asian beauty trends, consumer behavior, and cultural traditions. Always cite sources.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: depth === 'detailed' ? 4000 : 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    answer: data.choices[0]?.message?.content || '',
    citations: data.citations || [],
  };
}

// ============================================================
// Predefined research queries for ShortKey Runway
// ============================================================

export const RESEARCH_QUERIES = {
  glassSkin: () => researchBeautyTrend('glass skin trend Korea 2026', {
    region: 'asia',
    timeframe: 'month',
    depth: 'detailed',
  }),

  ancientBeauty: () => researchBeautyTrend('ancient beauty traditions gua sha hair oiling rice water TikTok', {
    region: 'asia',
    timeframe: 'month',
    depth: 'detailed',
  }),

  genderNeutral: () => researchBeautyTrend('gender-neutral beauty products Asia Gen Z', {
    region: 'asia',
    timeframe: 'quarter',
    depth: 'detailed',
  }),

  barrierRepair: () => researchBeautyTrend('skin barrier repair products Asian market growth', {
    region: 'asia',
    timeframe: 'quarter',
    depth: 'detailed',
  }),

  tokyoBeauty: () => researchBeautyTrend('Japanese beauty trends Tokyo 2026 minimal skincare', {
    region: 'asia',
    timeframe: 'month',
    depth: 'detailed',
  }),

  seoulSkin: () => researchBeautyTrend('Korean skincare diary trends Seoul Gen Z 2026', {
    region: 'asia',
    timeframe: 'month',
    depth: 'detailed',
  }),

  shanghaiCulture: () => researchBeautyTrend('Chinese beauty culture Shanghai youth trends 2026', {
    region: 'asia',
    timeframe: 'month',
    depth: 'detailed',
  }),
} as const;
