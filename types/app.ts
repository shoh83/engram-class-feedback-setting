export type SchoolStage = "elementary" | "middle";
export type Proficiency = "low" | "middle" | "high";
export type OutputLanguage = "korean" | "english";
export type AssignmentType = "essay" | "descriptive-answer";
export type GradeLetter = "A" | "B" | "C" | "D" | "E";
export type FeedbackCategory =
  | "taskCompletion"
  | "meaningDelivery"
  | "structure"
  | "vocabularyExpression"
  | "grammarAccuracy";

export interface StudentLevel {
  schoolStage: SchoolStage;
  proficiency: Proficiency;
}

export interface EvaluationConfig {
  enabled: boolean;
  includeOverall: boolean;
  includeCategories: boolean;
}

export interface FeedbackConfig {
  enabled: boolean;
  includeOverall: boolean;
  includeCategoryFeedback: boolean;
  includeCategoryExamples: boolean;
}

export interface ScoringConfig {
  enabled: boolean;
  allowPartialCredit: boolean;
}

export interface FeedbackConfigState {
  studentLevel: StudentLevel;
  outputLanguage: OutputLanguage;
  assignmentType: AssignmentType;
  scoring: ScoringConfig;
  evaluation: EvaluationConfig;
  feedback: FeedbackConfig;
  includeStrengths: boolean;
  includeAreasToImprove: boolean;
  maxDetailedImprovementItems: number;
}

export interface WritingInputs {
  assignmentDescription: string;
  originalText: string;
  minimallyCorrectedText: string;
  rewrittenText: string;
}

export interface PromptPreviewData {
  prompt: string;
  usedFiles: string[];
  renderedFragments: Array<{
    path: string;
    content: string;
  }>;
  diffPayload: DiffPayload;
}

export interface DiffChange {
  kind: "replace" | "insert" | "delete";
  from: string;
  to: string;
  note: string;
}

export interface DiffPayload {
  originalToCorrected: string;
  originalToRewritten: string;
  changes: DiffChange[];
}

export interface OutputMeta {
  outputLanguage: OutputLanguage;
  assignmentType: AssignmentType;
  studentLevel: StudentLevel;
  generatedAt: string;
  promptFiles: string[];
}

export interface ScoreBreakdownItem {
  questionNumber: number;
  score: number;
  rationale: string;
}

export interface ScoringResult {
  correctAnswers: number | null;
  totalQuestions: number | null;
  partialCreditAllowed: boolean;
  scoreBreakdown: ScoreBreakdownItem[];
}

export interface EvaluationCategory {
  key: FeedbackCategory;
  label: string;
  grade: GradeLetter;
  summary: string;
}

export interface EvaluationResult {
  overallGrade?: GradeLetter | null;
  overallEvaluation?: string;
  categories?: EvaluationCategory[];
}

export interface FeedbackCategoryEntry {
  key: FeedbackCategory;
  label: string;
  feedback: string;
  example?: string;
}

export interface FeedbackResult {
  overallFeedback?: string;
  categories?: FeedbackCategoryEntry[];
}

export interface ImprovementItem {
  original: string;
  revised: string;
  rationale: string;
}

export interface ImprovementsResult {
  summary: string;
  detailedItems: ImprovementItem[];
}

export interface StrengthsResult {
  items: string[];
}

export interface AreasToImproveResult {
  items: string[];
}

export interface FeedbackResponse {
  meta: OutputMeta;
  scoring?: ScoringResult;
  evaluation?: EvaluationResult;
  feedback?: FeedbackResult;
  strengths?: StrengthsResult;
  areasToImprove?: AreasToImproveResult;
  improvements: ImprovementsResult;
}

export interface ResponseMetrics {
  processingTimeMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  usedMock: boolean;
  model: string;
}

export interface GenerateRequest {
  config: FeedbackConfigState;
  inputs: WritingInputs;
}

export interface GenerateResponse {
  promptPreview: PromptPreviewData;
  result: FeedbackResponse;
  metrics: ResponseMetrics;
  rawResponseJson: string;
}

export interface PromptFileRecord {
  path: string;
  content: string;
}
