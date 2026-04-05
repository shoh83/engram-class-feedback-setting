import { readPromptFile } from "@/lib/prompt-files";
import { buildDiffPayload } from "@/lib/diff";
import type { FeedbackConfigState, PromptPreviewData, WritingInputs } from "@/types/app";

interface TemplateValues {
  assignment_description: string;
  original_content: string;
  proofread_content: string;
  rewritten_content: string;
  differences: string;
  original_to_corrected_diff: string;
  original_to_rewritten_diff: string;
  target_language: string;
  target_level: string;
  target_proficiency: string;
  assignment_type: string;
  scoring_enabled: string;
  partial_credit_enabled: string;
  active_sections_summary: string;
  max_detailed_improvement_items: string;
  max_further_improvement_items: string;
}

function renderTemplate(content: string, values: TemplateValues) {
  return content.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key.trim() as keyof TemplateValues] ?? "");
}

function buildActiveSectionsSummary(config: FeedbackConfigState) {
  const lines = ["Active response sections:"];

  if (config.assignmentType === "descriptive-answer" && config.scoring.enabled) {
    lines.push(`- scoring`);
    lines.push(`- scoring.partialCreditAllowed: ${config.scoring.allowPartialCredit ? "yes" : "no"}`);
  }

  if (config.evaluation.enabled) {
    lines.push(`- evaluation`);
    if (config.evaluation.includeOverall) {
      lines.push(`- evaluation.overall`);
    }
    if (config.evaluation.includeCategories) {
      lines.push(`- evaluation.categories`);
    }
  }

  if (config.feedback.enabled) {
    lines.push(`- feedback`);
    if (config.feedback.includeOverall) {
      lines.push(`- feedback.overall`);
    }
    if (config.feedback.includeCategoryFeedback) {
      lines.push(`- feedback.categories`);
    }
    if (config.feedback.includeCategoryFeedback && config.feedback.includeCategoryExamples) {
      lines.push(`- feedback.categoryExamples`);
    }
  }

  if (config.includeStrengths) {
    lines.push(`- strengths`);
  }

  if (config.includeAreasToImprove) {
    lines.push(`- areasToImprove`);
  }

  lines.push(`- improvements`);
  lines.push(`- furtherImprovements`);

  return lines.join("\n");
}

function getPromptSequence(config: FeedbackConfigState) {
  const files = [
    "prompts/role.txt",
    "prompts/common-instructions.txt",
    `prompts/language/${config.outputLanguage}.txt`,
    `prompts/levels/${config.studentLevel.schoolStage}.txt`,
    `prompts/levels/proficiency-${config.studentLevel.proficiency}.txt`,
    `prompts/assignment-types/${config.assignmentType}.txt`
  ];

  if (config.assignmentType === "descriptive-answer" && config.scoring.enabled) {
    files.push("prompts/scoring/descriptive-answer-scoring.txt");
    if (config.scoring.allowPartialCredit) {
      files.push("prompts/scoring/partial-credit.txt");
    }
  }

  if (config.evaluation.enabled) {
    files.push("prompts/evaluation/base.txt");
    if (config.evaluation.includeOverall) {
      files.push("prompts/evaluation/overall.txt");
    }
    if (config.evaluation.includeCategories) {
      files.push("prompts/evaluation/categories.txt");
    }
  }

  if (config.feedback.enabled) {
    files.push("prompts/feedback/base.txt");
    if (config.feedback.includeOverall) {
      files.push("prompts/feedback/overall.txt");
    }
    if (config.feedback.includeCategoryFeedback) {
      files.push("prompts/feedback/categories.txt");
    }
    if (config.feedback.includeCategoryExamples) {
      files.push("prompts/feedback/examples.txt");
    }
  }

  if (config.includeStrengths) {
    files.push("prompts/feedback/strengths.txt");
  }

  if (config.includeAreasToImprove) {
    files.push("prompts/feedback/areas-to-improve.txt");
  }

  files.push("prompts/output/detailed-improvements.txt");
  files.push("prompts/output/further-improvements.txt");
  files.push("prompts/output/structured-output.txt");

  return files;
}

export async function composePrompt(config: FeedbackConfigState, inputs: WritingInputs): Promise<PromptPreviewData> {
  const diffPayload = buildDiffPayload(inputs.originalText, inputs.minimallyCorrectedText, inputs.rewrittenText);
  const usedFiles = getPromptSequence(config);

  const values: TemplateValues = {
    assignment_description: inputs.assignmentDescription || "(none provided)",
    original_content: inputs.originalText,
    proofread_content: inputs.minimallyCorrectedText,
    rewritten_content: inputs.rewrittenText,
    differences: `${diffPayload.originalToCorrected}\n\n${diffPayload.originalToRewritten}`,
    original_to_corrected_diff: diffPayload.originalToCorrected,
    original_to_rewritten_diff: diffPayload.originalToRewritten,
    target_language: config.outputLanguage,
    target_level: config.studentLevel.schoolStage,
    target_proficiency: config.studentLevel.proficiency,
    assignment_type: config.assignmentType,
    scoring_enabled: config.scoring.enabled ? "yes" : "no",
    partial_credit_enabled: config.scoring.allowPartialCredit ? "yes" : "no",
    active_sections_summary: buildActiveSectionsSummary(config),
    max_detailed_improvement_items: String(config.maxDetailedImprovementItems),
    max_further_improvement_items: String(config.maxFurtherImprovementItems)
  };

  const renderedFragments = await Promise.all(
    usedFiles.map(async (filePath) => {
      const content = await readPromptFile(filePath);
      return {
        path: filePath,
        content: renderTemplate(content, values)
      };
    })
  );

  const prompt = renderedFragments.map((fragment) => fragment.content).join("\n\n");

  return {
    prompt,
    usedFiles,
    renderedFragments,
    diffPayload
  };
}
