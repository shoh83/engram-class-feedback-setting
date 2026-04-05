"use client";

import type { FeedbackResponse } from "@/types/app";

interface JsonResponsePanelProps {
  rawResponseJson: string;
  result: FeedbackResponse | null;
}

export function JsonResponsePanel({ rawResponseJson, result }: JsonResponsePanelProps) {
  const displayedJson = result ? JSON.stringify(result, null, 2) : "";

  if (!rawResponseJson && !displayedJson) {
    return <div className="muted-banner">Generate feedback to inspect the raw JSON response and the currently displayed output JSON.</div>;
  }

  return (
    <div className="stack">
      <div className="field-grid">
        <div className="dense-stack">
          <div className="section-title">Raw Response JSON</div>
          <div className="scroll-box code-block">{rawResponseJson || "No raw response yet."}</div>
        </div>
        <div className="dense-stack">
          <div className="section-title">Displayed Output JSON</div>
          <div className="scroll-box code-block">{displayedJson || "No displayed output yet."}</div>
        </div>
      </div>
      <div className="inline-note">
        `Raw Response JSON` is the structured model result returned by the API route. `Displayed Output JSON` reflects the current card state,
        including any inline edits made in the browser.
      </div>
    </div>
  );
}
