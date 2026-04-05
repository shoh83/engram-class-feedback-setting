"use client";

import { CATEGORY_LABELS, UI_LABELS } from "@/lib/constants";
import type { FeedbackCategoryEntry, FeedbackResponse } from "@/types/app";

interface OutputCardsProps {
  result: FeedbackResponse | null;
  onChange: (next: FeedbackResponse | null) => void;
}

function EditableText({
  value,
  onChange,
  minHeight = 80
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}) {
  return (
    <textarea
      className="editable-block"
      style={{ minHeight }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function LabeledEditor({
  label,
  value,
  onChange,
  minHeight = 80
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <EditableText value={value} onChange={onChange} minHeight={minHeight} />
    </div>
  );
}

export function OutputCards({ result, onChange }: OutputCardsProps) {
  if (!result) {
    return <div className="muted-banner">Structured feedback cards will appear here after generation.</div>;
  }

  const language = result.meta.outputLanguage;
  const ui = UI_LABELS[language];
  const categoryLabels = CATEGORY_LABELS[language];
  const scoring = result.scoring;
  const evaluation = result.evaluation;
  const feedback = result.feedback;
  const strengths = result.strengths;
  const areasToImprove = result.areasToImprove;

  return (
    <div className="result-grid">
      <div className="result-card">
        <h3>{ui.meta}</h3>
        <div className="card-list">
          <div className="inline-note">
            {ui.language}: <strong>{result.meta.outputLanguage}</strong> | {ui.assignmentType}:{" "}
            <strong>{result.meta.assignmentType}</strong> | {ui.level}:{" "}
            <strong>
              {result.meta.studentLevel.schoolStage}/{result.meta.studentLevel.proficiency}
            </strong>
          </div>
          <LabeledEditor
            label="generatedAt"
            value={result.meta.generatedAt}
            onChange={(value) =>
              onChange({
                ...result,
                meta: {
                  ...result.meta,
                  generatedAt: value
                }
              })
            }
            minHeight={56}
          />
        </div>
      </div>

      {scoring ? (
        <div className="result-card">
          <h3>{ui.scoring}</h3>
          <div className="card-list">
            <LabeledEditor
              label={ui.correctAnswers}
              value={`${scoring.correctAnswers ?? ""} / ${scoring.totalQuestions ?? ""}`}
              onChange={(value) => {
                const match = value.match(/(\d+)\s*\/\s*(\d+)/);
                onChange({
                  ...result,
                  scoring: {
                    ...scoring,
                    correctAnswers: match ? Number(match[1]) : scoring.correctAnswers,
                    totalQuestions: match ? Number(match[2]) : scoring.totalQuestions
                  }
                });
              }}
              minHeight={56}
            />
            {scoring.scoreBreakdown.map((item, index) => (
              <div key={`${item.questionNumber}-${index}`} className="result-card">
                <h4>{language === "korean" ? `${item.questionNumber}번` : `Question ${item.questionNumber}`}</h4>
                <LabeledEditor
                  label={ui.questionNumber}
                  value={String(item.questionNumber)}
                  onChange={(value) => {
                    const next = [...scoring.scoreBreakdown];
                    next[index] = { ...item, questionNumber: Number(value) || item.questionNumber };
                    onChange({
                      ...result,
                      scoring: {
                        ...scoring,
                        scoreBreakdown: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <LabeledEditor
                  label={ui.score}
                  value={String(item.score)}
                  onChange={(value) => {
                    const next = [...scoring.scoreBreakdown];
                    next[index] = { ...item, score: Number(value) || 0 };
                    onChange({
                      ...result,
                      scoring: {
                        ...scoring,
                        scoreBreakdown: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <LabeledEditor
                  label={ui.rationale}
                  value={item.rationale}
                  onChange={(value) => {
                    const next = [...scoring.scoreBreakdown];
                    next[index] = { ...item, rationale: value };
                    onChange({
                      ...result,
                      scoring: {
                        ...scoring,
                        scoreBreakdown: next
                      }
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {evaluation ? (
        <div className="result-card">
          <h3>{ui.evaluation}</h3>
          <div className="card-list">
            {evaluation.overallGrade ? (
              <LabeledEditor
                label={ui.overallGrade}
                value={evaluation.overallGrade}
                onChange={(value) =>
                  onChange({
                    ...result,
                    evaluation: {
                      ...evaluation,
                      overallGrade: value.toUpperCase().slice(0, 1) as NonNullable<typeof evaluation>["overallGrade"]
                    }
                  })
                }
                minHeight={56}
              />
            ) : null}
            {typeof evaluation.overallEvaluation === "string" ? (
              <LabeledEditor
                label={ui.overallEvaluation}
                value={evaluation.overallEvaluation}
                onChange={(value) =>
                  onChange({
                    ...result,
                    evaluation: {
                      ...evaluation,
                      overallEvaluation: value
                    }
                  })
                }
              />
            ) : null}
            {(evaluation.categories ?? []).map((category, index) => (
              <div key={category.key} className="result-card">
                <h4>{categoryLabels[category.key]}</h4>
                <LabeledEditor
                  label={ui.categoryGrade}
                  value={category.grade}
                  onChange={(value) => {
                    const next = [...(evaluation.categories ?? [])];
                    next[index] = {
                      ...category,
                      grade: value.toUpperCase().slice(0, 1) as typeof category.grade
                    };
                    onChange({
                      ...result,
                      evaluation: {
                        ...evaluation,
                        categories: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <LabeledEditor
                  label={ui.categorySummary}
                  value={category.summary}
                  onChange={(value) => {
                    const next = [...(evaluation.categories ?? [])];
                    next[index] = { ...category, summary: value };
                    onChange({
                      ...result,
                      evaluation: {
                        ...evaluation,
                        categories: next
                      }
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div className="result-card">
          <h3>{ui.feedback}</h3>
          <div className="card-list">
            {typeof feedback.overallFeedback === "string" ? (
              <LabeledEditor
                label={ui.overallFeedback}
                value={feedback.overallFeedback}
                onChange={(value) =>
                  onChange({
                    ...result,
                    feedback: {
                      ...feedback,
                      overallFeedback: value
                    }
                  })
                }
              />
            ) : null}
            {(feedback.categories ?? []).map((category, index) => {
              const nextCategories = [...(feedback.categories ?? [])] as FeedbackCategoryEntry[];

              return (
                <div key={category.key} className="result-card">
                  <h4>{categoryLabels[category.key]}</h4>
                  <LabeledEditor
                    label={ui.categoryFeedback}
                    value={category.feedback}
                    onChange={(value) => {
                      nextCategories[index] = { ...category, feedback: value };
                      onChange({
                        ...result,
                        feedback: {
                          ...feedback,
                          categories: nextCategories
                        }
                      });
                    }}
                  />
                  {typeof category.example === "string" ? (
                    <LabeledEditor
                      label={ui.categoryExample}
                      value={category.example}
                      onChange={(value) => {
                        nextCategories[index] = { ...category, example: value };
                        onChange({
                          ...result,
                          feedback: {
                            ...feedback,
                            categories: nextCategories
                          }
                        });
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {strengths ? (
        <div className="result-card">
          <h3>{ui.strengths}</h3>
          <div className="card-list">
            {strengths.items.map((item, index) => (
              <LabeledEditor
                key={`strength-${index}`}
                label={`${ui.strengths} ${index + 1}`}
                value={item}
                onChange={(value) => {
                  const next = [...strengths.items];
                  next[index] = value;
                  onChange({
                    ...result,
                    strengths: {
                      items: next
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {areasToImprove ? (
        <div className="result-card">
          <h3>{ui.areasToImprove}</h3>
          <div className="card-list">
            {areasToImprove.items.map((item, index) => (
              <LabeledEditor
                key={`improve-${index}`}
                label={`${ui.areasToImprove} ${index + 1}`}
                value={item}
                onChange={(value) => {
                  const next = [...areasToImprove.items];
                  next[index] = value;
                  onChange({
                    ...result,
                    areasToImprove: {
                      items: next
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="result-card">
        <h3>{ui.detailedImprovements}</h3>
        <LabeledEditor
          label={ui.summary}
          value={result.improvements.summary}
          onChange={(value) =>
            onChange({
              ...result,
              improvements: {
                ...result.improvements,
                summary: value
              }
            })
          }
        />
        <div className="card-list">
          {result.improvements.detailedItems.map((item, index) => (
            <div key={`${item.original}-${item.revised}-${index}`} className="result-card">
              <LabeledEditor
                label={ui.originalTextSpan}
                value={item.original}
                onChange={(value) => {
                  const next = [...result.improvements.detailedItems];
                  next[index] = { ...item, original: value };
                  onChange({
                    ...result,
                    improvements: {
                      ...result.improvements,
                      detailedItems: next
                    }
                  });
                }}
                minHeight={56}
              />
              <LabeledEditor
                label={ui.revisedTextSpan}
                value={item.revised}
                onChange={(value) => {
                  const next = [...result.improvements.detailedItems];
                  next[index] = { ...item, revised: value };
                  onChange({
                    ...result,
                    improvements: {
                      ...result.improvements,
                      detailedItems: next
                    }
                  });
                }}
                minHeight={56}
              />
              <LabeledEditor
                label={ui.rationale}
                value={item.rationale}
                onChange={(value) => {
                  const next = [...result.improvements.detailedItems];
                  next[index] = { ...item, rationale: value };
                  onChange({
                    ...result,
                    improvements: {
                      ...result.improvements,
                      detailedItems: next
                    }
                    });
                  }}
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
