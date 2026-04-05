"use client";

import { CATEGORY_LABELS, UI_LABELS } from "@/lib/constants";
import type { FeedbackResponse, ReviewCategoryEntry } from "@/types/app";

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
  const review = result.review;
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

      {review ? (
        <div className="result-card">
          <h3>{ui.review}</h3>
          <div className="card-list">
            {review.overallGrade ? (
              <LabeledEditor
                label={ui.overallGrade}
                value={review.overallGrade}
                onChange={(value) =>
                  onChange({
                    ...result,
                    review: {
                      ...review,
                      overallGrade: value.toUpperCase().slice(0, 1) as NonNullable<typeof review>["overallGrade"]
                    }
                  })
                }
                minHeight={56}
              />
            ) : null}
            {typeof review.overallComment === "string" ? (
              <LabeledEditor
                label={ui.overallComment}
                value={review.overallComment}
                onChange={(value) =>
                  onChange({
                    ...result,
                    review: {
                      ...review,
                      overallComment: value
                    }
                  })
                }
              />
            ) : null}
            {(review.categories ?? []).map((category, index) => (
              <div key={category.key} className="result-card">
                <h4>{categoryLabels[category.key]}</h4>
                {category.grade ? (
                  <LabeledEditor
                    label={ui.categoryGrade}
                    value={category.grade}
                    onChange={(value) => {
                      const next = [...(review.categories ?? [])];
                      next[index] = {
                        ...category,
                        grade: value.toUpperCase().slice(0, 1) as typeof category.grade
                      };
                      onChange({
                        ...result,
                        review: {
                          ...review,
                          categories: next
                        }
                      });
                    }}
                    minHeight={56}
                  />
                ) : null}
                <LabeledEditor
                  label={ui.categoryComment}
                  value={category.comment}
                  onChange={(value) => {
                    const next = [...(review.categories ?? [])] as ReviewCategoryEntry[];
                    next[index] = { ...category, comment: value };
                    onChange({
                      ...result,
                      review: {
                        ...review,
                        categories: next
                      }
                    });
                  }}
                />
                {category.exampleCase ? (
                  <div className="result-card">
                    <h4>{ui.categoryExampleSection}</h4>
                    <LabeledEditor
                      label={ui.categoryExampleBefore}
                      value={category.exampleCase.before}
                      onChange={(value) => {
                        const next = [...(review.categories ?? [])] as ReviewCategoryEntry[];
                        next[index] = {
                          ...category,
                          exampleCase: {
                            ...category.exampleCase!,
                            before: value
                          }
                        };
                        onChange({
                          ...result,
                          review: {
                            ...review,
                            categories: next
                          }
                        });
                      }}
                    />
                    <LabeledEditor
                      label={ui.categoryExampleAfter}
                      value={category.exampleCase.after}
                      onChange={(value) => {
                        const next = [...(review.categories ?? [])] as ReviewCategoryEntry[];
                        next[index] = {
                          ...category,
                          exampleCase: {
                            ...category.exampleCase!,
                            after: value
                          }
                        };
                        onChange({
                          ...result,
                          review: {
                            ...review,
                            categories: next
                          }
                        });
                      }}
                    />
                    <LabeledEditor
                      label={ui.categoryExampleWhy}
                      value={category.exampleCase.why}
                      onChange={(value) => {
                        const next = [...(review.categories ?? [])] as ReviewCategoryEntry[];
                        next[index] = {
                          ...category,
                          exampleCase: {
                            ...category.exampleCase!,
                            why: value
                          }
                        };
                        onChange({
                          ...result,
                          review: {
                            ...review,
                            categories: next
                          }
                        });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
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

      <div className="result-card">
        <h3>{ui.furtherImprovements}</h3>
        <div className="card-list">
          {result.furtherImprovements.detailedItems.map((item, index) => (
            <div key={`${item.original}-${item.revised}-${index}`} className="result-card">
              <LabeledEditor
                label={ui.originalTextSpan}
                value={item.original}
                onChange={(value) => {
                  const next = [...result.furtherImprovements.detailedItems];
                  next[index] = { ...item, original: value };
                  onChange({
                    ...result,
                    furtherImprovements: {
                      ...result.furtherImprovements,
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
                  const next = [...result.furtherImprovements.detailedItems];
                  next[index] = { ...item, revised: value };
                  onChange({
                    ...result,
                    furtherImprovements: {
                      ...result.furtherImprovements,
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
                  const next = [...result.furtherImprovements.detailedItems];
                  next[index] = { ...item, rationale: value };
                  onChange({
                    ...result,
                    furtherImprovements: {
                      ...result.furtherImprovements,
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
