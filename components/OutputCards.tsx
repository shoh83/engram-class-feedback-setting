"use client";

import type { FeedbackResponse } from "@/types/app";

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

      {result.scoring.enabled ? (
        <div className="result-card">
          <h3>Scoring</h3>
          <div className="card-list">
            <EditableText
              value={`Correct Answers: ${result.scoring.correctAnswers ?? ""} / ${result.scoring.totalQuestions ?? ""}`}
              onChange={(value) => {
                const match = value.match(/(\d+)\s*\/\s*(\d+)/);
                onChange({
                  ...result,
                  scoring: {
                    ...result.scoring,
                    correctAnswers: match ? Number(match[1]) : result.scoring.correctAnswers,
                    totalQuestions: match ? Number(match[2]) : result.scoring.totalQuestions
                  }
                });
              }}
              minHeight={56}
            />
            {result.scoring.scoreBreakdown.map((item, index) => (
              <div key={`${item.questionNumber}-${index}`} className="result-card">
                <h4>{item.questionNumber}번</h4>
                <EditableText
                  value={String(item.questionNumber)}
                  onChange={(value) => {
                    const next = [...result.scoring.scoreBreakdown];
                    next[index] = { ...item, questionNumber: Number(value) || item.questionNumber };
                    onChange({
                      ...result,
                      scoring: {
                        ...result.scoring,
                        scoreBreakdown: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <EditableText
                  value={String(item.score)}
                  onChange={(value) => {
                    const next = [...result.scoring.scoreBreakdown];
                    next[index] = { ...item, score: Number(value) || 0 };
                    onChange({
                      ...result,
                      scoring: {
                        ...result.scoring,
                        scoreBreakdown: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <EditableText
                  value={item.rationale}
                  onChange={(value) => {
                    const next = [...result.scoring.scoreBreakdown];
                    next[index] = { ...item, rationale: value };
                    onChange({
                      ...result,
                      scoring: {
                        ...result.scoring,
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

      {result.evaluation.enabled ? (
        <div className="result-card">
          <h3>Evaluation</h3>
          <div className="card-list">
            {result.evaluation.overallGrade ? (
              <EditableText
                value={result.evaluation.overallGrade}
                onChange={(value) =>
                  onChange({
                    ...result,
                    evaluation: {
                      ...result.evaluation,
                      overallGrade: (value.toUpperCase().slice(0, 1) || null) as FeedbackResponse["evaluation"]["overallGrade"]
                    }
                  })
                }
                minHeight={56}
              />
            ) : null}
            <EditableText
              value={result.evaluation.overallEvaluation}
              onChange={(value) =>
                onChange({
                  ...result,
                  evaluation: {
                    ...result.evaluation,
                    overallEvaluation: value
                  }
                })
              }
            />
            {result.evaluation.categories.map((category, index) => (
              <div key={category.key} className="result-card">
                <h4>{category.label}</h4>
                <EditableText
                  value={category.grade}
                  onChange={(value) => {
                    const next = [...result.evaluation.categories];
                    next[index] = {
                      ...category,
                      grade: value.toUpperCase().slice(0, 1) as typeof category.grade
                    };
                    onChange({
                      ...result,
                      evaluation: {
                        ...result.evaluation,
                        categories: next
                      }
                    });
                  }}
                  minHeight={56}
                />
                <EditableText
                  value={category.summary}
                  onChange={(value) => {
                    const next = [...result.evaluation.categories];
                    next[index] = { ...category, summary: value };
                    onChange({
                      ...result,
                      evaluation: {
                        ...result.evaluation,
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

      {result.feedback.enabled ? (
        <div className="result-card">
          <h3>Feedback</h3>
          <div className="card-list">
            <EditableText
              value={result.feedback.overallFeedback}
              onChange={(value) =>
                onChange({
                  ...result,
                  feedback: {
                    ...result.feedback,
                    overallFeedback: value
                  }
                })
              }
            />
            {result.feedback.categories.map((category, index) => (
              <div key={category.key} className="result-card">
                <h4>{category.label}</h4>
                <EditableText
                  value={category.feedback}
                  onChange={(value) => {
                    const next = [...result.feedback.categories];
                    next[index] = { ...category, feedback: value };
                    onChange({
                      ...result,
                      feedback: {
                        ...result.feedback,
                        categories: next
                      }
                    });
                  }}
                />
                <EditableText
                  value={category.example}
                  onChange={(value) => {
                    const next = [...result.feedback.categories];
                    next[index] = { ...category, example: value };
                    onChange({
                      ...result,
                      feedback: {
                        ...result.feedback,
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

      {result.strengths.enabled ? (
        <div className="result-card">
          <h3>Strengths</h3>
          <div className="card-list">
            {result.strengths.items.map((item, index) => (
              <EditableText
                key={`strength-${index}`}
                value={item}
                onChange={(value) => {
                  const next = [...result.strengths.items];
                  next[index] = value;
                  onChange({
                    ...result,
                    strengths: {
                      ...result.strengths,
                      items: next
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {result.areasToImprove.enabled ? (
        <div className="result-card">
          <h3>Areas To Improve</h3>
          <div className="card-list">
            {result.areasToImprove.items.map((item, index) => (
              <EditableText
                key={`improve-${index}`}
                value={item}
                onChange={(value) => {
                  const next = [...result.areasToImprove.items];
                  next[index] = value;
                  onChange({
                    ...result,
                    areasToImprove: {
                      ...result.areasToImprove,
                      items: next
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {result.improvements.enabled ? (
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
              <div key={`${item.title}-${index}`} className="result-card">
                <EditableText
                  value={item.title}
                  onChange={(value) => {
                    const next = [...result.improvements.detailedItems];
                    next[index] = { ...item, title: value };
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
                <EditableText
                  value={item.tip}
                  onChange={(value) => {
                    const next = [...result.improvements.detailedItems];
                    next[index] = { ...item, tip: value };
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
      ) : null}
    </div>
  );
}
