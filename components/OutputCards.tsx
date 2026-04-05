"use client";

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

export function OutputCards({ result, onChange }: OutputCardsProps) {
  if (!result) {
    return <div className="muted-banner">Structured feedback cards will appear here after generation.</div>;
  }

  const scoring = result.scoring;
  const evaluation = result.evaluation;
  const feedback = result.feedback;
  const strengths = result.strengths;
  const areasToImprove = result.areasToImprove;

  return (
    <div className="result-grid">
      <div className="result-card">
        <h3>Meta</h3>
        <div className="card-list">
          <div className="inline-note">
            Language: <strong>{result.meta.outputLanguage}</strong> | Assignment type:{" "}
            <strong>{result.meta.assignmentType}</strong> | Level:{" "}
            <strong>
              {result.meta.studentLevel.schoolStage}/{result.meta.studentLevel.proficiency}
            </strong>
          </div>
          <EditableText
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
          <h3>Scoring</h3>
          <div className="card-list">
            <EditableText
              value={`Correct Answers: ${scoring.correctAnswers ?? ""} / ${scoring.totalQuestions ?? ""}`}
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
                <h4>{item.questionNumber}번</h4>
                <EditableText
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
                <EditableText
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
                <EditableText
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
          <h3>Evaluation</h3>
          <div className="card-list">
            {evaluation.overallGrade ? (
              <EditableText
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
              <EditableText
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
                <h4>{category.label}</h4>
                <EditableText
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
                <EditableText
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
          <h3>Feedback</h3>
          <div className="card-list">
            {typeof feedback.overallFeedback === "string" ? (
              <EditableText
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
                  <h4>{category.label}</h4>
                  <EditableText
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
                    <EditableText
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
          <h3>Strengths</h3>
          <div className="card-list">
            {strengths.items.map((item, index) => (
              <EditableText
                key={`strength-${index}`}
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
          <h3>Areas To Improve</h3>
          <div className="card-list">
            {areasToImprove.items.map((item, index) => (
              <EditableText
                key={`improve-${index}`}
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
        <h3>Detailed Improvements</h3>
        <EditableText
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
              <EditableText
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
              <EditableText
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
              <EditableText
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
