import { diffWords } from "diff";

import type { DiffChange, DiffPayload } from "@/types/app";

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function summarizeChanges(original: string, revised: string): DiffChange[] {
  const parts = diffWords(original, revised);
  const changes: DiffChange[] = [];

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];

    if (part.removed) {
      const next = parts[index + 1];
      if (next?.added) {
        changes.push({
          kind: "replace",
          from: normalizeWhitespace(part.value),
          to: normalizeWhitespace(next.value),
          note: "Replacement based on corrected wording."
        });
        index += 1;
      } else {
        changes.push({
          kind: "delete",
          from: normalizeWhitespace(part.value),
          to: "",
          note: "Removed from the original text."
        });
      }
    } else if (part.added) {
      changes.push({
        kind: "insert",
        from: "",
        to: normalizeWhitespace(part.value),
        note: "Added in the revised version."
      });
    }
  }

  return changes.filter((item) => item.from || item.to);
}

function toStructuredDiff(label: string, original: string, revised: string) {
  const changes = summarizeChanges(original, revised);

  const lines = [
    `[${label}]`,
    `ORIGINAL: ${normalizeWhitespace(original)}`,
    `REVISED: ${normalizeWhitespace(revised)}`,
    "CHANGES:"
  ];

  if (changes.length === 0) {
    lines.push("- No word-level changes detected.");
  } else {
    changes.forEach((change, index) => {
      lines.push(
        `${index + 1}. type=${change.kind}; from="${change.from || "(none)"}"; to="${change.to || "(none)"}"; note="${change.note}"`
      );
    });
  }

  return {
    text: lines.join("\n"),
    changes
  };
}

export function buildDiffPayload(original: string, minimallyCorrected: string, rewritten: string): DiffPayload {
  const corrected = toStructuredDiff("ORIGINAL_TO_MINIMALLY_CORRECTED", original, minimallyCorrected);
  const fluent = toStructuredDiff("ORIGINAL_TO_REWRITTEN", original, rewritten);

  return {
    originalToCorrected: corrected.text,
    originalToRewritten: fluent.text,
    changes: [...corrected.changes, ...fluent.changes]
  };
}
