// ============================================================
// Magazine DNA Engine
// Core layout intelligence for Japanese magazine aesthetic
// Validates every spread against the Magazine DNA standard
// ============================================================

export interface MagazineDNA {
  occupancy_pct: number;          // Target: 85-90%
  whitespace_pct: number;         // Target: 10-15%
  overlap_pct: number;            // Target: 30-50%
  headline_scale_vw: number;      // Target: 30-40vw
  clusters_per_page: number;      // Target: 3-5
  reading_flow: 'non_linear' | 'zigzag' | 'spiral';
  typography: string[];           // e.g. ['tsukiji-mincho', 'tokuto-gothic']
  color_system: {
    primary: string;              // #9B6BB5
    background: string;           // #FAFAFD
    text: string;                 // #1C1F26
  };
}

export const DEFAULT_DNA: MagazineDNA = {
  occupancy_pct: 90,
  whitespace_pct: 10,
  overlap_pct: 35,
  headline_scale_vw: 35,
  clusters_per_page: 4,
  reading_flow: 'zigzag',
  typography: ['tsukiji-mincho', 'tokuto-gothic'],
  color_system: {
    primary: '#9B6BB5',
    background: '#FAFAFD',
    text: '#1C1F26',
  },
};

export interface SpreadValidation {
  passed: boolean;
  occupancy_score: number;
  overlap_score: number;
  headline_score: number;
  filler_density_score: number;
  avatar_score: number;
  composite_score: number;
  gate_1_occupancy: boolean;     // > 85%
  gate_2_overlap: boolean;       // >= 30%
  gate_3_aesthetic: boolean;     // >= 95%
  errors: string[];
}

// ============================================================
// Three-Gate Validation System
// ============================================================

export function validateSpread(
  hero_weight: number,        // 0-30 (max 30)
  overlap_weight: number,     // 0-15 (max 15)
  headline_vw: number,        // actual vw of headline
  filler_count: number,       // number of filler elements
  overlap_rate: number,       // 0-100 overlap percentage
  has_avatar: boolean
): SpreadValidation {
  const errors: string[] = [];

  // Gate 1: Viewport Occupancy > 85%
  const headline_weight = Math.min((headline_vw / 14) * 12, 15);
  const filler_density = Math.min(filler_count * 8, 32);
  const overlap_bonus = Math.min((overlap_rate / 42) * 8, 8);
  const occupancy_score = hero_weight + overlap_weight + headline_weight + filler_density + overlap_bonus;

  const gate_1 = occupancy_score > 85;
  if (!gate_1) {
    errors.push(`Gate 1 FAILED: Occupancy ${occupancy_score.toFixed(1)}% (need >85%)`);
  }

  // Gate 2: Image Overlap >= 30%
  const gate_2 = overlap_rate >= 30;
  if (!gate_2) {
    errors.push(`Gate 2 FAILED: Overlap ${overlap_rate}% (need >=30%)`);
  }

  // Gate 3: Aesthetic Accuracy >= 95%
  // Composite: occupancy 35% + overlap 25% + headline 15% + fillers 15% + avatar 10%
  const aesthetic_score = Math.min(
    (occupancy_score / 100 * 35) +
    (overlap_rate / 100 * 25) +
    (headline_vw / 40 * 15) +
    (filler_count / 4 * 15) +
    (has_avatar ? 10 : 0),
    100
  );

  const gate_3 = aesthetic_score >= 95;
  if (!gate_3) {
    errors.push(`Gate 3 FAILED: Aesthetic ${aesthetic_score.toFixed(1)}% (need >=95%)`);
  }

  return {
    passed: gate_1 && gate_2 && gate_3,
    occupancy_score,
    overlap_score: overlap_rate,
    headline_score: headline_vw,
    filler_density_score: filler_count,
    avatar_score: has_avatar ? 10 : 0,
    composite_score: aesthetic_score,
    gate_1_occupancy: gate_1,
    gate_2_overlap: gate_2,
    gate_3_aesthetic: gate_3,
    errors,
  };
}

// ============================================================
// Layout DNA Scanner
// Input: screenshot dimensions and element analysis
// Output: DNA metrics for reference learning
// ============================================================

export interface LayoutDNA {
  style: string;
  occupancy: number;
  whitespace: number;
  clusters: number;
  overlap: number;
  headlineScale: number;
  readingFlow: 'linear' | 'zigzag' | 'spiral' | 'grid';
}

export function scanLayoutDNA(elements: {
  total_area: number;
  filled_area: number;
  cluster_count: number;
  overlap_area: number;
  headline_font_size: number;
  viewport_width: number;
}): LayoutDNA {
  const occupancy = (elements.filled_area / elements.total_area) * 100;
  const whitespace = 100 - occupancy;
  const overlap = (elements.overlap_area / elements.filled_area) * 100;
  const headlineScale = (elements.headline_font_size / elements.viewport_width) * 100;

  return {
    style: 'japanese_magazine',
    occupancy: Math.round(occupancy),
    whitespace: Math.round(whitespace),
    clusters: elements.cluster_count,
    overlap: Math.round(overlap),
    headlineScale: Math.round(headlineScale),
    readingFlow: 'zigzag',
  };
}
