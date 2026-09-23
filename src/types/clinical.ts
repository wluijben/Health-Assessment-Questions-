export interface ScaleOption {
  value: number;
  label: string;
  subtext?: string;
}

export interface ScaleItem {
  id: string;
  itemNumber: number;
  question: string;
  subtext?: string;
  domainCategory: string; // e.g. "Emotional Exhaustion", "Somatic Strain", "Cognitive Agency"
  options: ScaleOption[];
}

export interface ScoreBracket {
  minScore: number;
  maxScore: number;
  level: 'minimal' | 'mild' | 'moderate' | 'severe';
  title: string;
  summary: string;
  clinicalSignificance: string;
  literatureNextSteps: string[];
  recommendedClinicalAction: string;
  urgencyLevel: 'routine' | 'monitor' | 'evaluation_recommended' | 'immediate_clinical_attention';
}

export interface Citation {
  authors: string;
  year: number;
  title: string;
  journal: string;
  volumeAndPages?: string;
  doiOrPmid?: string;
  validationStats?: string;
}

export interface ClinicalScale {
  id: string;
  name: string;
  shortCode: string;
  targetDomain: string;
  adaptationDescription: string;
  recallWindow: string; // e.g., "Over the past 2 weeks"
  items: ScaleItem[];
  scoringType: 'sum' | 'weighted';
  maxPossibleScore: number;
  minPossibleScore: number;
  brackets: ScoreBracket[];
  citations: Citation[];
  psychometricSpecs: {
    cronbachAlpha: string;
    testRetestReliability: string;
    sensitivity?: string;
    specificity?: string;
    clinicalCutoffNote: string;
  };
}

export interface UserResponses {
  [itemId: string]: number;
}

export interface AssessmentResult {
  scaleId: string;
  scaleName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  bracket: ScoreBracket;
  responses: UserResponses;
  completedAt: string;
  categoryBreakdown: {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
}
