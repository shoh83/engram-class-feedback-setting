"use client";

import type { FeedbackConfigState } from "@/types/app";

interface ConfigFormProps {
  config: FeedbackConfigState;
  onChange: (next: FeedbackConfigState) => void;
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="checkbox-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  const update = <K extends keyof FeedbackConfigState>(key: K, value: FeedbackConfigState[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="stack">
      <div className="field-grid">
        <div className="field">
          <label htmlFor="schoolStage">School stage</label>
          <select
            id="schoolStage"
            className="control"
            value={config.studentLevel.schoolStage}
            onChange={(event) =>
              onChange({
                ...config,
                studentLevel: {
                  ...config.studentLevel,
                  schoolStage: event.target.value as FeedbackConfigState["studentLevel"]["schoolStage"]
                }
              })
            }
          >
            <option value="elementary">Elementary</option>
            <option value="middle">Middle</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="proficiency">Proficiency</label>
          <select
            id="proficiency"
            className="control"
            value={config.studentLevel.proficiency}
            onChange={(event) =>
              onChange({
                ...config,
                studentLevel: {
                  ...config.studentLevel,
                  proficiency: event.target.value as FeedbackConfigState["studentLevel"]["proficiency"]
                }
              })
            }
          >
            <option value="low">Low</option>
            <option value="middle">Middle</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="outputLanguage">Output language</label>
          <select
            id="outputLanguage"
            className="control"
            value={config.outputLanguage}
            onChange={(event) => update("outputLanguage", event.target.value as FeedbackConfigState["outputLanguage"])}
          >
            <option value="korean">Korean</option>
            <option value="english">English</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="assignmentType">Assignment type</label>
          <select
            id="assignmentType"
            className="control"
            value={config.assignmentType}
            onChange={(event) => {
              const assignmentType = event.target.value as FeedbackConfigState["assignmentType"];
              onChange({
                ...config,
                assignmentType,
                scoring:
                  assignmentType === "descriptive-answer"
                    ? config.scoring
                    : {
                        enabled: false,
                        allowPartialCredit: false
                      }
              });
            }}
          >
            <option value="essay">Essay</option>
            <option value="descriptive-answer">Descriptive answer</option>
          </select>
        </div>
      </div>

      {config.assignmentType === "descriptive-answer" ? (
        <div className="stack">
          <p className="section-title">Descriptive-answer scoring</p>
          <Toggle
            label="Enable scoring"
            checked={config.scoring.enabled}
            onChange={(checked) =>
              update("scoring", {
                ...config.scoring,
                enabled: checked,
                allowPartialCredit: checked ? config.scoring.allowPartialCredit : false
              })
            }
          />
          {config.scoring.enabled ? (
            <Toggle
              label="Allow partial credit"
              checked={config.scoring.allowPartialCredit}
              onChange={(checked) =>
                update("scoring", {
                  ...config.scoring,
                  allowPartialCredit: checked
                })
              }
            />
          ) : null}
        </div>
      ) : null}

      <div className="stack">
        <p className="section-title">Evaluation</p>
        <Toggle
          label="Enable evaluation"
          checked={config.evaluation.enabled}
          onChange={(checked) =>
            update("evaluation", {
              ...config.evaluation,
              enabled: checked
            })
          }
        />
        {config.evaluation.enabled ? (
          <div className="field-grid">
            <Toggle
              label="Include overall evaluation"
              checked={config.evaluation.includeOverall}
              onChange={(checked) =>
                update("evaluation", {
                  ...config.evaluation,
                  includeOverall: checked
                })
              }
            />
            <Toggle
              label="Include category evaluations"
              checked={config.evaluation.includeCategories}
              onChange={(checked) =>
                update("evaluation", {
                  ...config.evaluation,
                  includeCategories: checked
                })
              }
            />
          </div>
        ) : null}
      </div>

      <div className="stack">
        <p className="section-title">Feedback</p>
        <Toggle
          label="Enable feedback"
          checked={config.feedback.enabled}
          onChange={(checked) =>
            update("feedback", {
              ...config.feedback,
              enabled: checked
            })
          }
        />
        {config.feedback.enabled ? (
          <div className="dense-stack">
            <Toggle
              label="Include overall feedback"
              checked={config.feedback.includeOverall}
              onChange={(checked) =>
                update("feedback", {
                  ...config.feedback,
                  includeOverall: checked
                })
              }
            />
            <Toggle
              label="Include category feedback"
              checked={config.feedback.includeCategoryFeedback}
              onChange={(checked) =>
                update("feedback", {
                  ...config.feedback,
                  includeCategoryFeedback: checked
                })
              }
            />
            <Toggle
              label="Include category improvement examples"
              checked={config.feedback.includeCategoryExamples}
              onChange={(checked) =>
                update("feedback", {
                  ...config.feedback,
                  includeCategoryExamples: checked
                })
              }
            />
          </div>
        ) : null}
      </div>

      <div className="field-grid">
        <Toggle
          label="Include strengths"
          checked={config.includeStrengths}
          onChange={(checked) => update("includeStrengths", checked)}
        />
        <Toggle
          label="Include areas to improve"
          checked={config.includeAreasToImprove}
          onChange={(checked) => update("includeAreasToImprove", checked)}
        />
      </div>

      <div className="field">
        <label htmlFor="maxDetailedImprovementItems">Maximum detailed improvement items</label>
        <input
          id="maxDetailedImprovementItems"
          className="control"
          type="number"
          min={1}
          max={10}
          value={config.maxDetailedImprovementItems}
          onChange={(event) => update("maxDetailedImprovementItems", Number(event.target.value))}
        />
      </div>

      <div className="field">
        <label htmlFor="maxFurtherImprovementItems">Maximum further improvement items</label>
        <input
          id="maxFurtherImprovementItems"
          className="control"
          type="number"
          min={1}
          max={10}
          value={config.maxFurtherImprovementItems}
          onChange={(event) => update("maxFurtherImprovementItems", Number(event.target.value))}
        />
      </div>
    </div>
  );
}
