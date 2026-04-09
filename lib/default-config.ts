import type { FeedbackConfigState, WritingInputs } from "@/types/app";

export const defaultConfig: FeedbackConfigState = {
  studentLevel: {
    schoolStage: "elementary",
    proficiency: "middle"
  },
  outputLanguage: "korean",
  assignmentType: "essay",
  reasoningEffort: "medium",
  scoring: {
    enabled: false,
    allowPartialCredit: false
  },
  evaluation: {
    enabled: true,
    includeOverall: true,
    includeCategories: true
  },
  feedback: {
    enabled: true,
    includeOverall: true,
    includeCategoryFeedback: true,
    includeCategoryExamples: true
  },
  includeStrengths: true,
  includeAreasToImprove: true,
  maxDetailedImprovementItems: 4,
  maxFurtherImprovementItems: 4
};

export const sampleInputs: WritingInputs = {
  assignmentTitle: "Writing your own report 7/18",
  assignmentDescription:
    "Write a short paragraph about a weekend activity you enjoy and explain why it is meaningful to you.",
  originalText:
    "On weekend I go park with my brother. We playing soccer and eat kimbap. I like this because it make me happy and healthy. Sometimes weather is bad but we still go because it is very fun time.",
  minimallyCorrectedText:
    "On weekends, I go to the park with my brother. We play soccer and eat kimbap. I like this because it makes me happy and healthy. Sometimes the weather is bad, but we still go because it is a very fun time.",
  rewrittenText:
    "On weekends, I usually go to the park with my brother. We play soccer together and eat kimbap afterward. I enjoy this activity because it makes me feel both happy and healthy. Even when the weather is not perfect, we still go because we always have a great time."
};
