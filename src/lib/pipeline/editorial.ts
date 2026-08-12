// ============================================================
// n8n Editorial Pipeline — Webhook Configuration
// Automates: research intake → editorial review → layout → publish
// ============================================================

export interface PipelineConfig {
  n8n_base_url: string;
  webhooks: {
    research_intake: string;
    editorial_review: string;
    layout_generation: string;
    publish: string;
  };
}

export const PIPELINE_CONFIG: PipelineConfig = {
  n8n_base_url: process.env.N8N_SELF_HOSTED_URL || 'http://localhost:5678',
  webhooks: {
    research_intake: '/webhook/research-intake',
    editorial_review: '/webhook/editorial-review',
    layout_generation: '/webhook/layout-generation',
    publish: '/webhook/publish',
  },
};

// ============================================================
// Trigger research intake
// ============================================================

export async function triggerResearchIntake(topic: string, sources: string[]) {
  const url = `${PIPELINE_CONFIG.n8n_base_url}${PIPELINE_CONFIG.webhooks.research_intake}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      sources,
      timestamp: new Date().toISOString(),
      project: 'shortkey-runway',
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n research intake failed: ${response.status}`);
  }

  return response.json();
}

// ============================================================
// Trigger full magazine pipeline
// ============================================================

export async function triggerFullPipeline(
  magazine_issue: {
    topic: string;
    source_research: unknown;
    editorial_brief: string;
    target_pages: number;
  }
) {
  const url = `${PIPELINE_CONFIG.n8n_base_url}${PIPELINE_CONFIG.webhooks.publish}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...magazine_issue,
      project: 'shortkey-runway',
      timestamp: new Date().toISOString(),
      brand: {
        primary_color: '#9B6BB5',
        background: '#FAFAFD',
        text: '#1C1F26',
        fonts: ['tsukiji-mincho', 'tokuto-gothic'],
      },
      dna_standard: {
        occupancy: 90,
        overlap: 35,
        headline_vw: 35,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n publish pipeline failed: ${response.status}`);
  }

  return response.json();
}
