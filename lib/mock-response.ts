import { CATEGORY_ORDER } from "@/lib/constants";
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
    },
    furtherImprovements: {
      detailedItems: [
        {
          original: "the story happened while they practiced the play",
          revised: "The story happened while they were practicing for the play.",
          rationale: "The rewritten version sounds more natural because the progressive form and preposition choice better fit standard English narration."
        },
        {
          original: "So his teacher heard that barking and she took out all fishes in the tank and changed tank",
          revised: "Then his teacher heard the barking and took all the fish out of the tank and replaced it.",
          rationale: "The rewritten version improves flow and style by removing awkward phrasing, using natural collocations, and tightening the sentence."
        }
      ].slice(0, config.maxFurtherImprovementItems)
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

  if (config.evaluation.enabled || config.feedback.enabled) {
    result.review = {};

    if (config.evaluation.includeOverall || config.feedback.includeOverall) {
      result.review.overallComment =
        "The writing stays on topic and communicates the student's experience clearly, but it still needs smoother sentence control.";
    }

    if (config.evaluation.includeOverall) {
      result.review.overallGrade = "B";
    }

    if (config.evaluation.includeCategories || config.feedback.includeCategoryFeedback) {
      result.review.categories = CATEGORY_ORDER.map((key, index) => {
        const entry: {
          key: typeof key;
          grade?: "A" | "B" | "C" | "D" | "E";
          comment: string;
          exampleCase?: {
            before: string;
            after: string;
            why: string;
          };
        } = {
          key,
          comment:
            key === "structure"
              ? "Add a stronger ending sentence so the paragraph feels more complete."
              : "Keep the main idea, but tighten the sentence pattern so the reader processes it faster."
        };

        if (config.evaluation.includeCategories) {
          entry.grade = (["B", "B", "B", "C", "C"] as const)[index];
        }

        if (config.feedback.includeCategoryExamples) {
          entry.exampleCase =
            key === "grammarAccuracy"
              ? {
                  before: "it make me happy",
                  after: "it makes me happy",
                  why: "This supports the grammar feedback because third-person singular subjects need a verb ending in -s in the simple present."
                }
              : {
                  before: "we playing soccer and eat kimbap",
                  after: "We play soccer and eat kimbap after the game.",
                  why: "This supports the feedback by showing a clearer and more natural sentence pattern with stronger local flow."
                };
        }

        return entry;
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
