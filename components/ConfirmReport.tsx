"use client";

import { CATEGORY_LABELS } from "@/lib/constants";
import type { FeedbackConfigState, FeedbackResponse, ResponseMetrics, WritingInputs } from "@/types/app";

interface ConfirmReportProps {
  config: FeedbackConfigState;
  inputs: WritingInputs;
  promptText: string;
  usedFiles: string[];
  metrics: ResponseMetrics | null;
  result: FeedbackResponse | null;
  rawResponseJson: string;
  confirmedAt: string;
}

function formatBoolean(value: boolean) {
  return value ? "Enabled" : "Disabled";
}

function formatAssignmentType(value: FeedbackConfigState["assignmentType"]) {
  return value === "descriptive-answer" ? "Descriptive answer" : "Essay";
}

function formatOutputLanguage(value: FeedbackConfigState["outputLanguage"]) {
  return value === "korean" ? "Korean" : "English";
}

function formatSchoolStage(value: FeedbackConfigState["studentLevel"]["schoolStage"]) {
  return value === "elementary" ? "Elementary" : "Middle";
}

function formatProficiency(value: FeedbackConfigState["studentLevel"]["proficiency"]) {
  if (value === "low") return "Low";
  if (value === "high") return "High";
  return "Middle";
}

export function ConfirmReport({
  config,
  inputs,
  promptText,
  usedFiles,
  metrics,
  result,
  rawResponseJson,
  confirmedAt
}: ConfirmReportProps) {
  const categoryLabels = CATEGORY_LABELS[config.outputLanguage];

  return (
    <section className="panel report-panel">
      <div className="panel-header">
        <div>
          <p className="section-title">Confirmed Report</p>
          <h2 className="headline">Submission-ready Snapshot</h2>
        </div>
        <div className="chip-list">
          <span className="chip active">{formatAssignmentType(config.assignmentType)}</span>
          <span className="chip">{formatOutputLanguage(config.outputLanguage)}</span>
          <span className="chip">{new Date(confirmedAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="panel-body report-layout">
        <div className="report-summary">
          <div className="report-summary-card report-summary-card-accent">
            <div className="report-kicker">Student Profile</div>
            <div className="report-strong">
              {formatSchoolStage(config.studentLevel.schoolStage)} / {formatProficiency(config.studentLevel.proficiency)}
            </div>
            <div className="inline-note">Output language: {formatOutputLanguage(config.outputLanguage)}</div>
          </div>
          <div className="report-summary-card">
            <div className="report-kicker">Evaluation + Feedback</div>
            <div className="report-strong">
              {formatBoolean(config.evaluation.enabled)} / {formatBoolean(config.feedback.enabled)}
            </div>
            <div className="inline-note">
              Strengths: {formatBoolean(config.includeStrengths)} | Areas to improve: {formatBoolean(config.includeAreasToImprove)}
            </div>
          </div>
          <div className="report-summary-card">
            <div className="report-kicker">Generation Status</div>
            <div className="report-strong">{result ? "Feedback generated" : "Configuration only"}</div>
            <div className="inline-note">Prompt files used: {usedFiles.length}</div>
          </div>
        </div>

        <div className="report-grid">
          <section className="report-section">
            <h3 className="report-heading">Configuration</h3>
            <div className="report-field-grid">
              <div className="report-field">
                <span className="report-label">Assignment Type</span>
                <strong>{formatAssignmentType(config.assignmentType)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Output Language</span>
                <strong>{formatOutputLanguage(config.outputLanguage)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">School Stage</span>
                <strong>{formatSchoolStage(config.studentLevel.schoolStage)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Proficiency</span>
                <strong>{formatProficiency(config.studentLevel.proficiency)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Evaluation</span>
                <strong>{formatBoolean(config.evaluation.enabled)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Feedback</span>
                <strong>{formatBoolean(config.feedback.enabled)}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Detailed Improvement Limit</span>
                <strong>{config.maxDetailedImprovementItems}</strong>
              </div>
              <div className="report-field">
                <span className="report-label">Further Improvement Limit</span>
                <strong>{config.maxFurtherImprovementItems}</strong>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h3 className="report-heading">Writing Inputs</h3>
            <div className="report-stack">
              <div className="report-block">
                <div className="report-label">Assignment / Topic</div>
                <div>{inputs.assignmentDescription || "No assignment description provided."}</div>
              </div>
              <div className="report-block">
                <div className="report-label">Original Text</div>
                <div>{inputs.originalText}</div>
              </div>
              <div className="report-field-grid">
                <div className="report-block">
                  <div className="report-label">Minimally Corrected</div>
                  <div>{inputs.minimallyCorrectedText}</div>
                </div>
                <div className="report-block">
                  <div className="report-label">Rewritten Version</div>
                  <div>{inputs.rewrittenText}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h3 className="report-heading">Prompt and Runtime</h3>
            <div className="report-field-grid">
              <div className="report-block">
                <div className="report-label">Used Prompt Files</div>
                <div className="report-chip-list">
                  {usedFiles.length > 0 ? usedFiles.map((file) => <span key={file} className="report-pill">{file}</span>) : "No prompt files used yet."}
                </div>
              </div>
              <div className="report-block">
                <div className="report-label">Metrics</div>
                {metrics ? (
                  <div className="report-metric-list">
                    <div className="report-metric">
                      <span>Processing Time</span>
                      <strong>{(metrics.processingTimeMs / 1000).toFixed(2)} s</strong>
                    </div>
                    <div className="report-metric">
                      <span>Model</span>
                      <strong>{metrics.model}</strong>
                    </div>
                    <div className="report-metric">
                      <span>Total Tokens</span>
                      <strong>{metrics.totalTokens ?? "n/a"}</strong>
                    </div>
                  </div>
                ) : (
                  <div>No generation metrics yet.</div>
                )}
              </div>
            </div>
            <div className="report-code-block">
              <div className="report-label">Composed Prompt</div>
              <div className="scroll-box code-block">{promptText || "Generate feedback to include the final composed prompt."}</div>
            </div>
          </section>

          <section className="report-section">
            <h3 className="report-heading">Feedback Result</h3>
            {result ? (
              <div className="report-stack">
                <div className="report-highlight-grid">
                  <div className="report-highlight">
                    <span className="report-label">Generated At</span>
                    <strong>{result.meta.generatedAt}</strong>
                  </div>
                  <div className="report-highlight">
                    <span className="report-label">Prompt File Count</span>
                    <strong>{result.meta.promptFiles.length}</strong>
                  </div>
                  {result.review?.overallGrade ? (
                    <div className="report-highlight report-highlight-accent">
                      <span className="report-label">Overall Grade</span>
                      <strong>{result.review.overallGrade}</strong>
                    </div>
                  ) : null}
                </div>

                {result.review?.overallComment ? (
                  <div className="report-block">
                    <div className="report-label">Overall Comment</div>
                    <div>{result.review.overallComment}</div>
                  </div>
                ) : null}

                {result.review?.categories?.length ? (
                  <div className="report-stack">
                    <div className="report-label">Category Review</div>
                    <div className="report-category-grid">
                      {result.review.categories.map((category) => (
                        <div key={category.key} className="report-category-card">
                          <div className="report-category-header">
                            <strong>{categoryLabels[category.key]}</strong>
                            {category.grade ? <span className="report-grade-badge">{category.grade}</span> : null}
                          </div>
                          <p>{category.comment}</p>
                          {category.exampleCase ? (
                            <div className="report-example-box">
                              <div><span className="report-label">Before</span> {category.exampleCase.before}</div>
                              <div><span className="report-label">After</span> {category.exampleCase.after}</div>
                              <div><span className="report-label">Why</span> {category.exampleCase.why}</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {result.strengths?.items?.length ? (
                  <div className="report-stack">
                    <div className="report-label">Strengths</div>
                    <div className="report-list-grid">
                      {result.strengths.items.map((item, index) => (
                        <div key={`strength-${index}`} className="report-list-item">{item}</div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {result.areasToImprove?.items?.length ? (
                  <div className="report-stack">
                    <div className="report-label">Areas To Improve</div>
                    <div className="report-list-grid">
                      {result.areasToImprove.items.map((item, index) => (
                        <div key={`improve-${index}`} className="report-list-item report-list-item-warn">{item}</div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="report-two-column">
                  <div className="report-stack">
                    <div className="report-label">Detailed Improvements</div>
                    {result.improvements.detailedItems.map((item, index) => (
                      <div key={`detail-${index}`} className="report-improvement-card">
                        <div><span className="report-label">Original</span> {item.original}</div>
                        <div><span className="report-label">Revised</span> <strong>{item.revised}</strong></div>
                        <div><span className="report-label">Rationale</span> {item.rationale}</div>
                      </div>
                    ))}
                  </div>
                  <div className="report-stack">
                    <div className="report-label">Further Improvements</div>
                    {result.furtherImprovements.detailedItems.map((item, index) => (
                      <div key={`further-${index}`} className="report-improvement-card">
                        <div><span className="report-label">Original</span> {item.original}</div>
                        <div><span className="report-label">Revised</span> <strong>{item.revised}</strong></div>
                        <div><span className="report-label">Rationale</span> {item.rationale}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="muted-banner">No generated feedback yet. This report currently includes configuration and writing inputs only.</div>
            )}
          </section>

          <section className="report-section">
            <h3 className="report-heading">Raw JSON</h3>
            <div className="report-field-grid">
              <div className="report-code-block">
                <div className="report-label">API Response JSON</div>
                <div className="scroll-box code-block">{rawResponseJson || "No raw response yet."}</div>
              </div>
              <div className="report-code-block">
                <div className="report-label">Displayed Output JSON</div>
                <div className="scroll-box code-block">{result ? JSON.stringify(result, null, 2) : "No displayed output yet."}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
