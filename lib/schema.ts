import { z } from "zod";

const studentLevelSchema = z.object({
  schoolStage: z.enum(["elementary", "middle"]),
  proficiency: z.enum(["low", "middle", "high"])
});

const categoryEnum = z.enum([
  "taskCompletion",
  "meaningDelivery",
  "structure",
  "vocabularyExpression",
  "grammarAccuracy"
]);

const gradeEnum = z.enum(["A", "B", "C", "D", "E"]);

export const feedbackResponseSchema = z.object({
  meta: z.object({
    outputLanguage: z.enum(["korean", "english"]),
    assignmentType: z.enum(["essay", "descriptive-answer"]),
    studentLevel: studentLevelSchema,
    generatedAt: z.string(),
    promptFiles: z.array(z.string())
  }),
  scoring: z.object({
    enabled: z.boolean(),
    totalScore: z.number().nullable(),
    maxScore: z.number().nullable(),
    partialCreditAllowed: z.boolean(),
    scoreBreakdown: z.array(
      z.object({
        label: z.string(),
        score: z.number(),
        rationale: z.string()
      })
    ),
    notes: z.array(z.string())
  }),
  evaluation: z.object({
    enabled: z.boolean(),
    overallGrade: gradeEnum.nullable(),
    overallEvaluation: z.string(),
    categories: z.array(
      z.object({
        key: categoryEnum,
        label: z.string(),
        grade: gradeEnum,
        summary: z.string()
      })
    )
  }),
  feedback: z.object({
    enabled: z.boolean(),
    overallFeedback: z.string(),
    categories: z.array(
      z.object({
        key: categoryEnum,
        label: z.string(),
        feedback: z.string(),
        example: z.string()
      })
    )
  }),
  strengths: z.object({
    enabled: z.boolean(),
    items: z.array(z.string())
  }),
  areasToImprove: z.object({
    enabled: z.boolean(),
    items: z.array(z.string())
  }),
  improvements: z.object({
    enabled: z.boolean(),
    summary: z.string(),
    detailedItems: z.array(
      z.object({
        title: z.string(),
        original: z.string(),
        revised: z.string(),
        rationale: z.string(),
        tip: z.string()
      })
    )
  })
});

export type FeedbackResponseSchema = z.infer<typeof feedbackResponseSchema>;

// The route sends this schema to the model using JSON schema mode.
export const feedbackResponseJsonSchema = {
  name: "writing_feedback_response",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      meta: {
        type: "object",
        additionalProperties: false,
        properties: {
          outputLanguage: { type: "string", enum: ["korean", "english"] },
          assignmentType: { type: "string", enum: ["essay", "descriptive-answer"] },
          studentLevel: {
            type: "object",
            additionalProperties: false,
            properties: {
              schoolStage: { type: "string", enum: ["elementary", "middle"] },
              proficiency: { type: "string", enum: ["low", "middle", "high"] }
            },
            required: ["schoolStage", "proficiency"]
          },
          generatedAt: { type: "string" },
          promptFiles: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["outputLanguage", "assignmentType", "studentLevel", "generatedAt", "promptFiles"]
      },
      scoring: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          totalScore: { type: ["number", "null"] },
          maxScore: { type: ["number", "null"] },
          partialCreditAllowed: { type: "boolean" },
          scoreBreakdown: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                label: { type: "string" },
                score: { type: "number" },
                rationale: { type: "string" }
              },
              required: ["label", "score", "rationale"]
            }
          },
          notes: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["enabled", "totalScore", "maxScore", "partialCreditAllowed", "scoreBreakdown", "notes"]
      },
      evaluation: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          overallGrade: { type: ["string", "null"], enum: ["A", "B", "C", "D", "E", null] },
          overallEvaluation: { type: "string" },
          categories: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: {
                  type: "string",
                  enum: [
                    "taskCompletion",
                    "meaningDelivery",
                    "structure",
                    "vocabularyExpression",
                    "grammarAccuracy"
                  ]
                },
                label: { type: "string" },
                grade: { type: "string", enum: ["A", "B", "C", "D", "E"] },
                summary: { type: "string" }
              },
              required: ["key", "label", "grade", "summary"]
            }
          }
        },
        required: ["enabled", "overallGrade", "overallEvaluation", "categories"]
      },
      feedback: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          overallFeedback: { type: "string" },
          categories: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: {
                  type: "string",
                  enum: [
                    "taskCompletion",
                    "meaningDelivery",
                    "structure",
                    "vocabularyExpression",
                    "grammarAccuracy"
                  ]
                },
                label: { type: "string" },
                feedback: { type: "string" },
                example: { type: "string" }
              },
              required: ["key", "label", "feedback", "example"]
            }
          }
        },
        required: ["enabled", "overallFeedback", "categories"]
      },
      strengths: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          items: { type: "array", items: { type: "string" } }
        },
        required: ["enabled", "items"]
      },
      areasToImprove: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          items: { type: "array", items: { type: "string" } }
        },
        required: ["enabled", "items"]
      },
      improvements: {
        type: "object",
        additionalProperties: false,
        properties: {
          enabled: { type: "boolean" },
          summary: { type: "string" },
          detailedItems: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                original: { type: "string" },
                revised: { type: "string" },
                rationale: { type: "string" },
                tip: { type: "string" }
              },
              required: ["title", "original", "revised", "rationale", "tip"]
            }
          }
        },
        required: ["enabled", "summary", "detailedItems"]
      }
    },
    required: ["meta", "scoring", "evaluation", "feedback", "strengths", "areasToImprove", "improvements"]
  },
  strict: true
} as const;
