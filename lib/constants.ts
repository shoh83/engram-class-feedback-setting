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
    review: string;
    overallGrade: string;
    overallComment: string;
    categoryGrade: string;
    categoryComment: string;
    categoryExampleSection: string;
    categoryExampleOriginal: string;
    categoryExampleRevised: string;
    categoryExampleWhy: string;
    strengths: string;
    areasToImprove: string;
    detailedImprovements: string;
    furtherImprovements: string;
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
    review: "Review",
    overallGrade: "Overall Grade",
    overallComment: "Overall Comment",
    categoryGrade: "Grade",
    categoryComment: "Comment",
    categoryExampleSection: "Example",
    categoryExampleOriginal: "Original",
    categoryExampleRevised: "Revised",
    categoryExampleWhy: "Explanation",
    strengths: "Strengths",
    areasToImprove: "Areas To Improve",
    detailedImprovements: "Detailed Improvements",
    furtherImprovements: "Further Improvements",
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
    correctAnswers: "점수",
    questionNumber: "문항",
    score: "점수",
    rationale: "근거",
    review: "평가 및 피드백",
    overallGrade: "종합 등급",
    overallComment: "종합 코멘트",
    categoryGrade: "등급",
    categoryComment: "코멘트",
    categoryExampleSection: "개선 예시",
    categoryExampleOriginal: "원문 표현",
    categoryExampleRevised: "수정 표현",
    categoryExampleWhy: "설명",
    strengths: "잘한 점",
    areasToImprove: "보완할 점",
    detailedImprovements: "세부 개선 사항",
    furtherImprovements: "추가 개선 사항",
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
