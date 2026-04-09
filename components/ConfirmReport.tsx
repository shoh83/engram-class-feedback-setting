"use client";

import * as Diff from "diff";

import { DiffVisual } from "@/components/DiffVisual";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { FeedbackResponse, WritingInputs } from "@/types/app";

interface ConfirmReportProps {
  result: FeedbackResponse | null;
  confirmedAt: string;
  inputs: WritingInputs;
}

function ImprovementPair({
  before,
  after,
  description,
  variant = "default"
}: {
  before: string;
  after: string;
  description: string;
  variant?: "default" | "further";
}) {
  const diffWordsWithSpace = (Diff as typeof Diff & {
    diffWordsWithSpace?: (
      oldText: string,
      newText: string
    ) => ReturnType<typeof Diff.diffWords>;
  }).diffWordsWithSpace;

  const parts = (diffWordsWithSpace ?? Diff.diffWords)(before, after);
  const isFurther = variant === "further";

  return (
    <div className={`report-improvement-card ${isFurther ? "report-improvement-card-further" : ""}`}>
      <div className="report-improvement-line">
        <span className="report-before-text">
          {parts.map((part, index) => {
            if (part.added) {
              return null;
            }

            const className = part.removed
              ? `diff-token ${isFurther ? "diff-token-further-remove" : "diff-token-remove"}`
              : "diff-token";

            return (
              <span key={`before-${index}-${part.value}`} className={className}>
                {part.value}
              </span>
            );
          })}
        </span>
        <span className="report-arrow">-&gt;</span>
        <span className="report-after-text">
          {parts.map((part, index) => {
            if (part.removed) {
              return null;
            }

            const className = part.added
              ? `diff-token ${isFurther ? "diff-token-further-add" : "diff-token-add"}`
              : "diff-token";

            return (
              <span key={`after-${index}-${part.value}`} className={className}>
                {part.value}
              </span>
            );
          })}
        </span>
      </div>
      <div className="report-description">• {description}</div>
    </div>
  );
}

export function ConfirmReport({ result, confirmedAt, inputs }: ConfirmReportProps) {
  if (!result) {
    return (
      <section className="panel report-panel report-shell">
        <div className="panel-header">
          <div>
            <p className="section-title">확정 리포트</p>
            <h2 className="headline">피드백 결과</h2>
          </div>
        </div>
        <div className="panel-body">
          <div className="muted-banner">생성된 피드백이 없어 확정 리포트를 표시할 수 없습니다.</div>
        </div>
      </section>
    );
  }

  const categoryLabels = CATEGORY_LABELS.korean;

  return (
    <section className="panel report-panel report-shell">
      <div className="panel-header">
        <div className="report-header-meta">
          <div className="report-meta-left">
          <div className="report-meta-row">
            <span className="report-meta-label">클래스</span>
              <strong>
                {result.meta.studentLevel.schoolStage === "elementary"
                  ? "초등"
                  : result.meta.studentLevel.schoolStage === "middle"
                    ? "중등"
                    : "고등"}
              </strong>
            </div>
            <div className="report-meta-row">
              <span className="report-meta-label">학생명</span>
              <strong>김유정</strong>
            </div>
            <div className="report-meta-row">
              <span className="report-meta-label">작성일</span>
              <strong>{new Date(confirmedAt).toLocaleDateString("ko-KR")}</strong>
            </div>
          </div>
          <div className="report-header-actions">
            <div className="report-meta-right">엔그램 영어학원</div>
            <button type="button" className="button-secondary no-print" onClick={() => window.print()}>
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="panel-body report-layout">
        <section className="report-section report-title-section">
          <h2 className="headline report-title">과제 리포트</h2>
          <div className="report-assignment-name">
            <span className="report-meta-label">과제명</span>
            <strong>{inputs.assignmentTitle || "-"}</strong>
          </div>
        </section>

        {result.scoring ? (
          <section className="report-section">
            <h3 className="report-heading">채점 결과</h3>
            <div className="report-stack">
              <div className="report-score-summary">
                <div className="report-label">총점</div>
                <div className="report-score-display-text">
                  {result.scoring.correctAnswers ?? "-"} / {result.scoring.totalQuestions ?? "-"}
                </div>
              </div>
              <div className="report-overall-comment">
                <div className="report-label">문항별 채점</div>
                <div className="report-score-list">
                  {result.scoring.scoreBreakdown.map((item) => (
                    <div key={`score-${item.questionNumber}`} className="report-score-item">
                      <div className="report-score-header">
                        <strong>{item.questionNumber}번</strong>
                        <span className="report-score-badge">{item.score}점</span>
                      </div>
                      <div className="report-description">• {item.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {result.review?.overallComment || result.review?.overallGrade ? (
          <section className="report-section">
            <h3 className="report-heading">종합 평가</h3>
            <div className="report-hero-card">
              {result.review?.overallGrade ? (
                <div className="report-score-summary">
                  <div className="report-label">종합 등급</div>
                  <div className="report-grade-display-text">{result.review.overallGrade}</div>
                </div>
              ) : null}
              {result.review?.overallComment ? (
                <div className="report-overall-comment">
                  <div className="report-label">종합 코멘트</div>
                  <p>{result.review.overallComment}</p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {result.review?.categories?.length ? (
          <section className="report-section">
            <h3 className="report-heading">영역별 리뷰</h3>
            <div className="report-category-grid">
              {result.review.categories.map((category) => (
                <article key={category.key} className="report-category-card">
                  <div className="report-category-header">
                    <h4 className="report-category-title">{categoryLabels[category.key]}</h4>
                    {category.grade ? <span className="report-grade-badge">{category.grade}</span> : null}
                  </div>
                  <p className="report-category-comment">{category.comment}</p>
                  {category.exampleCase ? (
                    <div className="report-example-box">
                      <div className="report-label">개선 예시</div>
                      <ImprovementPair
                        before={category.exampleCase.original}
                        after={category.exampleCase.revised}
                        description={category.exampleCase.why}
                      />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {result.strengths?.items?.length ? (
          <section className="report-section">
            <h3 className="report-heading">잘한 점</h3>
            <div className="report-collection-card">
              {result.strengths.items.map((item, index) => (
                <div key={`strength-${index}`} className="report-collection-item">
                  {item}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {result.areasToImprove?.items?.length ? (
          <section className="report-section">
            <h3 className="report-heading">보완할 점</h3>
            <div className="report-collection-card report-collection-card-warn">
              {result.areasToImprove.items.map((item, index) => (
                <div key={`improve-${index}`} className="report-collection-item">
                  {item}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {result.improvements.detailedItems.length ? (
          <section className="report-section">
            <h3 className="report-heading">기본 개선 사항</h3>
            <div className="report-stack">
              <div className="report-subsection">
                <h4 className="report-subheading">기본 첨삭</h4>
                <DiffVisual before={inputs.originalText} after={inputs.minimallyCorrectedText} />
              </div>
              {result.improvements.detailedItems.map((item, index) => (
                <ImprovementPair
                  key={`detail-${index}`}
                  before={item.original}
                  after={item.revised}
                  description={item.rationale}
                />
              ))}
            </div>
          </section>
        ) : null}

        {result.furtherImprovements.detailedItems.length ? (
          <section className="report-section report-section-further">
            <h3 className="report-heading">추가 개선 사항</h3>
            <div className="report-stack">
              <div className="report-subsection">
                <h4 className="report-subheading report-subheading-further">추가 개선</h4>
                <DiffVisual before={inputs.originalText} after={inputs.rewrittenText} variant="further" />
              </div>
              {result.furtherImprovements.detailedItems.map((item, index) => (
                <ImprovementPair
                  key={`further-${index}`}
                  before={item.original}
                  after={item.revised}
                  description={item.rationale}
                  variant="further"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
