import { z } from "zod";

import type { FeedbackConfigState } from "@/types/app";

const studentLevelSchema = z.object({
  schoolStage: z.enum(["elementary", "middle", "high"]),
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

function scoringSchema() {
  return z.object({
    correctAnswers: z.number().nullable(),
    totalQuestions: z.number().nullable(),
    partialCreditAllowed: z.boolean(),
    scoreBreakdown: z.array(
      z.object({
        questionNumber: z.number(),
        score: z.number(),
        rationale: z.string()
      })
    )
  });
}

function reviewSchema(config: FeedbackConfigState) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const includeOverall = config.evaluation.includeOverall || config.feedback.includeOverall;
  const includeCategories = config.evaluation.includeCategories || config.feedback.includeCategoryFeedback;

  if (includeOverall) {
    shape.overallComment = z.string();
  }

  if (config.evaluation.includeOverall) {
    shape.overallGrade = gradeEnum.nullable();
  }

  if (includeCategories) {
    const categoryShape: Record<string, z.ZodTypeAny> = {
      key: categoryEnum,
      comment: z.string()
    };

    if (config.evaluation.includeCategories) {
      categoryShape.grade = gradeEnum;
    }

    if (config.feedback.includeCategoryFeedback && config.feedback.includeCategoryExamples) {
      categoryShape.exampleCase = z
        .object({
          original: z.string(),
          revised: z.string(),
          why: z.string()
        })
        .optional();
    }

    shape.categories = z.array(z.object(categoryShape));
  }

  return z.object(shape);
}

export function buildFeedbackResponseSchema(config: FeedbackConfigState) {
  const shape: Record<string, z.ZodTypeAny> = {
    meta: z.object({
      outputLanguage: z.enum(["korean", "english"]),
      assignmentType: z.enum(["essay", "descriptive-answer"]),
      studentLevel: studentLevelSchema,
      generatedAt: z.string(),
      promptFiles: z.array(z.string())
    }),
    improvements: z.object({
      detailedItems: z.array(
        z.object({
          original: z.string(),
          revised: z.string(),
          rationale: z.string()
        })
      )
    }),
    furtherImprovements: z.object({
      detailedItems: z.array(
        z.object({
          original: z.string(),
          revised: z.string(),
          rationale: z.string()
        })
      )
    })
  };

  if (config.assignmentType === "descriptive-answer" && config.scoring.enabled) {
    shape.scoring = scoringSchema();
  }

  if (config.evaluation.enabled || config.feedback.enabled) {
    shape.review = reviewSchema(config);
  }

  if (config.includeStrengths) {
    shape.strengths = z.object({
      items: z.array(z.string())
    });
  }

  if (config.includeAreasToImprove) {
    shape.areasToImprove = z.object({
      items: z.array(z.string())
    });
  }

  return z.object(shape);
}

function unwrapSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return {
      type: "object",
      additionalProperties: false,
      properties: Object.fromEntries(
        Object.entries(shape).map(([key, value]) => [key, unwrapSchema(value as z.ZodTypeAny)])
      ),
      required: Object.keys(shape)
    };
  }

  if (schema instanceof z.ZodArray) {
    return {
      type: "array",
      items: unwrapSchema(schema.element)
    };
  }

  if (schema instanceof z.ZodNullable) {
    const inner = unwrapSchema(schema.unwrap());
    if (typeof inner === "object" && inner && "type" in inner) {
      const innerType = (inner as { type: string | string[] }).type;
      return {
        ...(inner as Record<string, unknown>),
        type: Array.isArray(innerType) ? [...innerType, "null"] : [innerType, "null"]
      };
    }
  }

  if (schema instanceof z.ZodOptional) {
    return unwrapSchema(schema.unwrap());
  }

  if (schema instanceof z.ZodEnum) {
    return {
      type: "string",
      enum: schema.options
    };
  }

  if (schema instanceof z.ZodString) {
    return { type: "string" };
  }

  if (schema instanceof z.ZodNumber) {
    return { type: "number" };
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: "boolean" };
  }

  throw new Error("Unsupported schema node while building JSON schema.");
}

export function buildFeedbackResponseJsonSchema(config: FeedbackConfigState) {
  const schema = buildFeedbackResponseSchema(config);

  return {
    name: "writing_feedback_response",
    schema: unwrapSchema(schema),
    strict: true
  } as const;
}

export type FeedbackResponseSchema = z.infer<ReturnType<typeof buildFeedbackResponseSchema>>;
