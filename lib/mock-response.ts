import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/constants";
import type { FeedbackConfigState, FeedbackResponse, WritingInputs } from "@/types/app";

export function buildMockFeedback(config: FeedbackConfigState, inputs: WritingInputs, promptFiles: string[]): FeedbackResponse {
  const generatedAt = new Date().toISOString();

  return {
    meta: {
      outputLanguage: config.outputLanguage,
      assignmentType: config.assignmentType,
      studentLevel: config.studentLevel,
      generatedAt,
      promptFiles
    },
    scoring: {
      enabled: config.assignmentType === "descriptive-answer" && config.scoring.enabled,
      correctAnswers: config.assignmentType === "descriptive-answer" && config.scoring.enabled ? 7 : null,
      totalQuestions: config.assignmentType === "descriptive-answer" && config.scoring.enabled ? 10 : null,
      partialCreditAllowed: config.scoring.allowPartialCredit,
      scoreBreakdown:
        config.assignmentType === "descriptive-answer" && config.scoring.enabled
          ? [
            {
              questionNumber: 1,
              score: 1,
              rationale: "The answer is fully correct and directly addresses the required content."
            },
            {
              questionNumber: 2,
              score: config.scoring.allowPartialCredit ? 0.5 : 0,
              rationale: config.scoring.allowPartialCredit
                ? "The answer captures part of the required idea, so partial credit is justified."
                  : "The answer misses a required detail, so it does not count as correct."
              }
            ]
          : []
    },
    evaluation: {
      enabled: config.evaluation.enabled,
      overallGrade: config.evaluation.enabled && config.evaluation.includeOverall ? "B" : null,
      overallEvaluation: config.evaluation.enabled
        ? `The writing stays on topic and communicates the student's experience clearly, but it still needs smoother sentence control.`
        : "",
      categories:
        config.evaluation.enabled && config.evaluation.includeCategories
          ? CATEGORY_ORDER.map((key, index) => ({
              key,
              label: CATEGORY_LABELS[key],
              grade: (["B", "B", "B", "C", "C"] as const)[index],
              summary:
                key === "grammarAccuracy"
                  ? "Verb agreement and article use still interrupt fluency."
                  : "The response is understandable and shows a useful base for revision."
            }))
          : []
    },
    feedback: {
      enabled: config.feedback.enabled,
      overallFeedback: config.feedback.enabled
        ? "The student shares a clear and relatable weekend routine, and the revised versions show how stronger sentence patterns can improve clarity."
        : "",
      categories:
        config.feedback.enabled && config.feedback.includeCategoryFeedback
          ? CATEGORY_ORDER.map((key) => ({
              key,
              label: CATEGORY_LABELS[key],
              feedback:
                key === "structure"
                  ? "Add a stronger ending sentence so the paragraph feels more complete."
                  : "Keep the main idea, but tighten the sentence pattern so the reader processes it faster.",
              example:
                config.feedback.includeCategoryExamples
                  ? key === "grammarAccuracy"
                    ? `"it make me happy" -> "it makes me happy" because third-person singular verbs need -s in the simple present.`
                    : `For example, combine the activity and reason in one sentence to sound more connected.`
                  : ""
            }))
          : []
    },
    strengths: {
      enabled: config.includeStrengths,
      items: config.includeStrengths ? ["The topic is clear from the first sentence.", "The student includes a personal reason for the activity."] : []
    },
    areasToImprove: {
      enabled: config.includeAreasToImprove,
      items: config.includeAreasToImprove ? ["Watch verb forms in simple present sentences.", "Use small linking words to improve paragraph flow."] : []
    },
    improvements: {
      enabled: true,
      summary: `Detailed improvements are based on the differences between the original and revised versions of the student's writing about "${inputs.assignmentDescription || "the assignment"}".`,
      detailedItems: [
        {
          title: "Fix verb agreement",
          original: "it make me happy",
          revised: "it makes me happy",
          rationale: "In the simple present, a third-person singular subject takes a verb ending in -s.",
          tip: "When the subject is it/he/she, quickly check whether the main verb needs -s."
        },
        {
          title: "Add the missing article",
          original: "it is very fun time",
          revised: "it is a very fun time",
          rationale: "A singular countable noun like time usually needs an article.",
          tip: "Check whether singular nouns need a, an, or the."
        }
      ].slice(0, config.maxDetailedImprovementItems)
    }
  };
}
