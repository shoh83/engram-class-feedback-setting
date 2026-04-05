"use client";

import { UI_LABELS } from "@/lib/constants";
import type { FeedbackResponse } from "@/types/app";

interface JsonResponsePanelProps {
  rawResponseJson: string;
  result: FeedbackResponse | null;
}

export function JsonResponsePanel({ rawResponseJson, result }: JsonResponsePanelProps) {
  const displayedJson = result ? JSON.stringify(result, null, 2) : "";
  const language = result?.meta.outputLanguage ?? "english";
  const labels = UI_LABELS[language];

  if (!rawResponseJson && !displayedJson) {
    return <div className="muted-banner">{labels.jsonPanelHint}</div>;
  }

  return (
    <div className="stack">
      <div className="field-grid">
        <div className="dense-stack">
          <div className="section-title">{labels.rawResponseJson}</div>
          <div className="scroll-box code-block">{rawResponseJson || labels.noRawResponse}</div>
        </div>
        <div className="dense-stack">
          <div className="section-title">{labels.displayedOutputJson}</div>
          <div className="scroll-box code-block">{displayedJson || labels.noDisplayedOutput}</div>
        </div>
      </div>
      <div className="inline-note">{labels.jsonPanelHint}</div>
    </div>
  );
}
