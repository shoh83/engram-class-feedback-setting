"use client";

import { diffWords } from "diff";

interface DiffVisualProps {
  before: string;
  after: string;
}

export function DiffVisual({ before, after }: DiffVisualProps) {
  const parts = diffWords(before, after);
  const additions = parts.filter((part) => part.added).length;
  const removals = parts.filter((part) => part.removed).length;

  return (
    <div className="diff-visual">
      <div className="diff-legend">
        <span className="diff-legend-chip diff-legend-chip-add">초록 = 추가</span>
        <span className="diff-legend-chip diff-legend-chip-remove">빨강 = 삭제</span>
      </div>
      <div className="diff-counts">
        {additions} addition(s), {removals} removal(s)
      </div>
      <div className="diff-surface">
        <div className="diff-text">
          {parts.map((part, index) => {
            const className = part.added ? "diff-token diff-token-add" : part.removed ? "diff-token diff-token-remove" : "diff-token";
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
