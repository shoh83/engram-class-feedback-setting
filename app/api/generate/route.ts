import { NextResponse } from "next/server";

import { composePrompt } from "@/lib/prompt-composer";
import { feedbackResponseJsonSchema, feedbackResponseSchema } from "@/lib/schema";
import { getModelName, getOpenAIClient } from "@/lib/openai";
import { buildMockFeedback } from "@/lib/mock-response";
import type { GenerateRequest, GenerateResponse } from "@/types/app";

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = (await request.json()) as GenerateRequest;
    const promptPreview = await composePrompt(body.config, body.inputs);
    const model = getModelName();

    if (!process.env.OPENAI_API_KEY) {
      const mockResult = buildMockFeedback(body.config, body.inputs, promptPreview.usedFiles);
      const mockResponse: GenerateResponse = {
        promptPreview,
        result: mockResult,
        metrics: {
          processingTimeMs: Date.now() - startedAt,
          inputTokens: null,
          outputTokens: null,
          totalTokens: null,
          usedMock: true,
          model
        }
      };

      return NextResponse.json(mockResponse);
    }

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model,
      reasoning: {
        effort: "medium"
      },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: promptPreview.prompt
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: feedbackResponseJsonSchema.name,
          schema: feedbackResponseJsonSchema.schema,
          strict: feedbackResponseJsonSchema.strict
        }
      }
    });

    // The Responses API may expose token usage in multiple shapes across SDK versions.
    // This fallback keeps the demo usable even if exact counters are absent.
    const usage = response.usage as
      | {
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
        }
      | undefined;

    const outputText =
      typeof response.output_text === "string"
        ? response.output_text
        : JSON.stringify(response.output ?? []);

    const parsed = feedbackResponseSchema.parse(JSON.parse(outputText));

    const result: GenerateResponse = {
      promptPreview,
      result: parsed,
      metrics: {
        processingTimeMs: Date.now() - startedAt,
        inputTokens: usage?.input_tokens ?? null,
        outputTokens: usage?.output_tokens ?? null,
        totalTokens: usage?.total_tokens ?? null,
        usedMock: false,
        model
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
