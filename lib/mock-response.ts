import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/constants";
import type { FeedbackConfigState, FeedbackResponse, WritingInputs } from "@/types/app";

export function buildMockFeedback(config: FeedbackConfigState, inputs: WritingInputs, promptFiles: string[]): FeedbackResponse {
  const generatedAt = new Date().toISOString();

  const result: FeedbackResponse = {
    meta: {
      outputLanguage: config.outputLanguage,
      assignmentType: config.assignmentType,
      studentLevel: config.studentLevel,
      generatedAt,
      promptFiles
    },
    improvements: {
      summary: `Detailed improvements are based on the differences between the original and revised versions of the student's writing about "${inputs.assignmentDescription || "the assignment"}".`,
      detailedItems: [
        {
          original: "it make me happy",
          revised: "it makes me happy",
          rationale: "In the simple present, a third-person singular subject takes a verb ending in -s."
        },
        {
          original: "it is very fun time",
          revised: "it is a very fun time",
          rationale: "A singular countable noun like time usually needs an article."
        }
      ].slice(0, config.maxDetailedImprovementItems)
    }
  };

  if (config.assignmentType === "descriptive-answer" && config.scoring.enabled) {
    result.scoring = {
      correctAnswers: 7,
      totalQuestions: 10,
      partialCreditAllowed: config.scoring.allowPartialCredit,
      scoreBreakdown: [
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
    };
  }

  if (config.evaluation.enabled) {
    result.evaluation = {};

    if (config.evaluation.includeOverall) {
      result.evaluation.overallGrade = "B";
      result.evaluation.overallEvaluation =
        "The writing stays on topic and communicates the student's experience clearly, but it still needs smoother sentence control.";
    }

    if (config.evaluation.includeCategories) {
      result.evaluation.categories = CATEGORY_ORDER.map((key, index) => ({
        key,
        label: CATEGORY_LABELS[key],
        grade: (["B", "B", "B", "C", "C"] as const)[index],
        summary:
          key === "grammarAccuracy"
            ? "Verb agreement and article use still interrupt fluency."
            : "The response is understandable and shows a useful base for revision."
      }));
    }
  }

  if (config.feedback.enabled) {
    result.feedback = {};

    if (config.feedback.includeOverall) {
      result.feedback.overallFeedback =
        "The student shares a clear and relatable weekend routine, and the revised versions show how stronger sentence patterns can improve clarity.";
    }

    if (config.feedback.includeCategoryFeedback) {
      result.feedback.categories = CATEGORY_ORDER.map((key) => {
        const base = {
          key,
          label: CATEGORY_LABELS[key],
          feedback:
            key === "structure"
              ? "Add a stronger ending sentence so the paragraph feels more complete."
              : "Keep the main idea, but tighten the sentence pattern so the reader processes it faster."
        };

        if (!config.feedback.includeCategoryExamples) {
          return base;
        }

        return {
          ...base,
          example:
            key === "grammarAccuracy"
              ? `"it make me happy" -> "it makes me happy" because third-person singular verbs need -s in the simple present.`
              : "For example, combine the activity and reason in one sentence to sound more connected."
        };
      });
    }
  }

  if (config.includeStrengths) {
    result.strengths = {
      items: ["The topic is clear from the first sentence.", "The student includes a personal reason for the activity."]
    };
  }

  if (config.includeAreasToImprove) {
    result.areasToImprove = {
      items: ["Watch verb forms in simple present sentences.", "Use small linking words to improve paragraph flow."]
    };
  }

  return result;
}
