"use client";

import type { ResponseMetrics } from "@/types/app";

export function MetricsDisplay({ metrics }: { metrics: ResponseMetrics | null }) {
  if (!metrics) {
    return <div className="muted-banner">Generate feedback to see processing time and token metrics.</div>;
  }

  const processingTimeSeconds = (metrics.processingTimeMs / 1000).toFixed(2);

  return (
    <div className="stack">
      {metrics.usedMock ? (
        <div className="muted-banner">
          No `OPENAI_API_KEY` was found, so the app rendered the included mock response instead of calling the API.
        </div>
      ) : null}
      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-label">Processing time</div>
          <div className="metric-value">{processingTimeSeconds} s</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Input tokens</div>
          <div className="metric-value">{metrics.inputTokens ?? "n/a"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Reasoning tokens</div>
          <div className="metric-value">{metrics.reasoningTokens ?? "n/a"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Output tokens</div>
          <div className="metric-value">{metrics.responseTokens ?? "n/a"}</div>
        </div>
      </div>
      <div className="inline-note">
        Model: <strong>{metrics.model}</strong>. Total output tokens: {metrics.outputTokens ?? "n/a"}. Total tokens:{" "}
        {metrics.totalTokens ?? "n/a"}.
      </div>
    </div>
  );
}
