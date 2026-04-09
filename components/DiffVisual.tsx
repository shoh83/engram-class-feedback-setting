"use client";

import { diffWords } from "diff";

interface DiffVisualProps {
  before: string;
  after: string;
  variant?: "default" | "further";
}

export function DiffVisual({ before, after, variant = "default" }: DiffVisualProps) {
  const parts = diffWords(before, after);
  const additions = parts.filter((part) => part.added).length;
  const removals = parts.filter((part) => part.removed).length;
  const isFurther = variant === "further";
  const addLabel = isFurther ? "보라색 = 추가" : "초록 = 추가";
  const removeLabel = isFurther ? "연회색 = 삭제" : "빨강 = 삭제";

  return (
    <div className={`diff-visual ${isFurther ? "diff-visual-further" : ""}`}>
      <div className="diff-legend">
        <span
          className={`diff-legend-chip ${isFurther ? "diff-legend-chip-further-add" : "diff-legend-chip-add"}`}
        >
          {addLabel}
        </span>
        <span
          className={`diff-legend-chip ${isFurther ? "diff-legend-chip-further-remove" : "diff-legend-chip-remove"}`}
        >
          {removeLabel}
        </span>
      </div>
      <div className="diff-counts">
        {additions} addition(s), {removals} removal(s)
      </div>
      <div className="diff-surface">
        <div className="diff-text">
          {parts.map((part, index) => {
            const className = part.added
              ? `diff-token ${isFurther ? "diff-token-further-add" : "diff-token-add"}`
              : part.removed
                ? `diff-token ${isFurther ? "diff-token-further-remove" : "diff-token-remove"}`
                : "diff-token";
            return (
              <span key={`${index}-${part.value}`} className={className}>
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
