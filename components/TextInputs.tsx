"use client";

import type { WritingInputs } from "@/types/app";

interface TextInputsProps {
  inputs: WritingInputs;
  onChange: (next: WritingInputs) => void;
}

export function TextInputs({ inputs, onChange }: TextInputsProps) {
  const update = <K extends keyof WritingInputs>(key: K, value: WritingInputs[K]) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="stack">
      <p className="section-title">Writing Inputs</p>
      <div className="field">
        <label htmlFor="assignmentTitle">Assignment title</label>
        <input
          id="assignmentTitle"
          className="control"
          value={inputs.assignmentTitle ?? ""}
          onChange={(event) => update("assignmentTitle", event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="assignmentDescription">Assignment / topic description (optional)</label>
        <textarea
          id="assignmentDescription"
          className="textarea"
          value={inputs.assignmentDescription}
          onChange={(event) => update("assignmentDescription", event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="originalText">Original text</label>
        <textarea
          id="originalText"
          className="textarea"
          value={inputs.originalText}
          onChange={(event) => update("originalText", event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="minimallyCorrectedText">Minimally corrected version</label>
        <textarea
          id="minimallyCorrectedText"
          className="textarea"
          value={inputs.minimallyCorrectedText}
          onChange={(event) => update("minimallyCorrectedText", event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="rewrittenText">Native-sounding rewritten version</label>
        <textarea
          id="rewrittenText"
          className="textarea"
          value={inputs.rewrittenText}
          onChange={(event) => update("rewrittenText", event.target.value)}
        />
      </div>
    </div>
  );
}
