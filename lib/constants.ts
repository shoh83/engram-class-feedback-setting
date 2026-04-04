import type { FeedbackCategory } from "@/types/app";

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  taskCompletion: "Task Completion",
  meaningDelivery: "Meaning Delivery",
  structure: "Structure",
  vocabularyExpression: "Vocabulary and Expression",
  grammarAccuracy: "Grammar Accuracy"
};

export const CATEGORY_ORDER: FeedbackCategory[] = [
  "taskCompletion",
  "meaningDelivery",
  "structure",
  "vocabularyExpression",
  "grammarAccuracy"
];
