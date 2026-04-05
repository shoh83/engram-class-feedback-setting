import type { FeedbackCategory, OutputLanguage } from "@/types/app";

export const CATEGORY_LABELS: Record<OutputLanguage, Record<FeedbackCategory, string>> = {
  english: {
    taskCompletion: "Task Completion",
    meaningDelivery: "Content and Delivery",
    structure: "Organization and Structure",
    vocabularyExpression: "Vocabulary and Expression",
    grammarAccuracy: "Grammatical Accuracy"
  },
  korean: {
    taskCompletion: "과제 수행",
    meaningDelivery: "의미 전달",
    structure: "구조",
    vocabularyExpression: "어휘 및 표현",
    grammarAccuracy: "문법 정확성"
  }
};

export const UI_LABELS: Record<
  OutputLanguage,
  {
    meta: string;
    language: string;
    assignmentType: string;
    level: string;
    scoring: string;
    correctAnswers: string;
    questionNumber: string;
    score: string;
    rationale: string;
    evaluation: string;
    overallGrade: string;
    overallEvaluation: string;
    categoryGrade: string;
    categorySummary: string;
    feedback: string;
    overallFeedback: string;
    categoryFeedback: string;
    categoryExample: string;
    strengths: string;
    areasToImprove: string;
    detailedImprovements: string;
    summary: string;
    originalTextSpan: string;
    revisedTextSpan: string;
    rawResponseJson: string;
    displayedOutputJson: string;
    noRawResponse: string;
    noDisplayedOutput: string;
    jsonPanelHint: string;
  }
> = {
  english: {
    meta: "Meta",
    language: "Language",
    assignmentType: "Assignment Type",
    level: "Level",
    scoring: "Scoring",
    correctAnswers: "Score",
    questionNumber: "Question Number",
    score: "Score",
    rationale: "Rationale",
    evaluation: "Evaluation",
    overallGrade: "Overall Grade",
    overallEvaluation: "Overall Evaluation",
    categoryGrade: "Grade",
    categorySummary: "Summary",
    feedback: "Feedback",
    overallFeedback: "Overall Feedback",
    categoryFeedback: "Category Feedback",
    categoryExample: "Improvement Example",
    strengths: "Strengths",
    areasToImprove: "Areas To Improve",
    detailedImprovements: "Detailed Improvements",
    summary: "Summary",
    originalTextSpan: "Original Text Span",
    revisedTextSpan: "Revised Text Span",
    rawResponseJson: "Raw Response JSON",
    displayedOutputJson: "Displayed Output JSON",
    noRawResponse: "No raw response yet.",
    noDisplayedOutput: "No displayed output yet.",
    jsonPanelHint:
      "`Raw Response JSON` is the structured model result returned by the API route. `Displayed Output JSON` reflects the current card state, including any inline edits made in the browser."
  },
  korean: {
    meta: "메타",
    language: "언어",
    assignmentType: "과제 유형",
    level: "수준",
    scoring: "채점 결과",
    correctAnswers: "정수",
    questionNumber: "문항",
    score: "점수",
    rationale: "근거",
    evaluation: "평가 결과",
    overallGrade: "종합 등급",
    overallEvaluation: "종합 평가 요약",
    categoryGrade: "등급",
    categorySummary: "평가 요약",
    feedback: "피드백",
    overallFeedback: "종합 피드백",
    categoryFeedback: "피드백",
    categoryExample: "개선 예시",
    strengths: "잘한 점",
    areasToImprove: "보완할 점",
    detailedImprovements: "세부 개선 사항",
    summary: "요약",
    originalTextSpan: "원문 표현",
    revisedTextSpan: "수정 표현",
    rawResponseJson: "원본 응답 JSON",
    displayedOutputJson: "현재 표시 JSON",
    noRawResponse: "아직 원본 응답이 없습니다.",
    noDisplayedOutput: "아직 표시 중인 출력이 없습니다.",
    jsonPanelHint:
      "`원본 응답 JSON`은 API route가 반환한 구조화된 모델 결과이고, `현재 표시 JSON`은 브라우저에서 인라인 수정이 반영된 현재 카드 상태입니다."
  }
};

export const CATEGORY_ORDER: FeedbackCategory[] = [
  "taskCompletion",
  "meaningDelivery",
  "structure",
  "vocabularyExpression",
  "grammarAccuracy"
];
