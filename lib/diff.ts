import * as Diff from "diff";

import type { DiffPayload, DiffRange, DiffSnippetSet, EditSnippet } from "@/types/app";

const CONTEXT_WORDS = 2;
const MIN_SNIPPET_GAP_WORDS = 2;

interface EditSpan {
  originalStart: number;
  originalEnd: number;
  revisedStart: number;
  revisedEnd: number;
}

interface WordToken extends DiffRange {}

function getDiffParts(original: string, revised: string) {
  const diffWordsWithSpace = (Diff as typeof Diff & {
    diffWordsWithSpace?: (oldText: string, newText: string) => ReturnType<typeof Diff.diffWords>;
  }).diffWordsWithSpace;

  return (diffWordsWithSpace ?? Diff.diffWords)(original, revised);
}

function getWordTokens(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const pattern = /[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu;

  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const start = match.index ?? 0;
    tokens.push({
      start,
      end: start + value.length
    });
  }

  return tokens;
}

function countWordsInRange(tokens: WordToken[], start: number, end: number) {
  if (end <= start) {
    return 0;
  }

  return tokens.filter((token) => token.start >= start && token.end <= end).length;
}

function hasLineBreakBetween(text: string, start: number, end: number) {
  if (end <= start) {
    return false;
  }

  return text.slice(start, end).includes("\n");
}

function buildEditSpans(original: string, revised: string): EditSpan[] {
  const parts = getDiffParts(original, revised);
  const edits: EditSpan[] = [];
  let originalPos = 0;
  let revisedPos = 0;
  let currentEdit: EditSpan | null = null;

  for (const part of parts) {
    const length = part.value.length;

    if (part.added || part.removed) {
      if (!currentEdit) {
        currentEdit = {
          originalStart: originalPos,
          originalEnd: originalPos,
          revisedStart: revisedPos,
          revisedEnd: revisedPos
        };
      }

      if (part.removed) {
        originalPos += length;
        currentEdit.originalEnd = originalPos;
      }

      if (part.added) {
        revisedPos += length;
        currentEdit.revisedEnd = revisedPos;
      }

      continue;
    }

    if (currentEdit) {
      edits.push(currentEdit);
      currentEdit = null;
    }

    originalPos += length;
    revisedPos += length;
  }

  if (currentEdit) {
    edits.push(currentEdit);
  }

  return edits;
}

function mergeAdjacentSpans(spans: EditSpan[], original: string, revised: string): EditSpan[] {
  if (spans.length <= 1) {
    return spans;
  }

  const originalTokens = getWordTokens(original);
  const revisedTokens = getWordTokens(revised);
  const merged: EditSpan[] = [spans[0]];

  for (let index = 1; index < spans.length; index += 1) {
    const current = merged[merged.length - 1];
    const next = spans[index];

    const originalGapWordCount = countWordsInRange(
      originalTokens,
      current.originalEnd,
      next.originalStart
    );
    const revisedGapWordCount = countWordsInRange(revisedTokens, current.revisedEnd, next.revisedStart);
    const originalHasLineBreak = hasLineBreakBetween(original, current.originalEnd, next.originalStart);
    const revisedHasLineBreak = hasLineBreakBetween(revised, current.revisedEnd, next.revisedStart);

    if (
      !originalHasLineBreak &&
      !revisedHasLineBreak &&
      originalGapWordCount <= MIN_SNIPPET_GAP_WORDS &&
      revisedGapWordCount <= MIN_SNIPPET_GAP_WORDS
    ) {
      current.originalEnd = next.originalEnd;
      current.revisedEnd = next.revisedEnd;
      continue;
    }

    merged.push(next);
  }

  return merged;
}

function findNearestTokenBefore(tokens: WordToken[], position: number) {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (tokens[index].end <= position) {
      return index;
    }
  }

  return -1;
}

function findNearestTokenAfter(tokens: WordToken[], position: number) {
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].start >= position) {
      return index;
    }
  }

  return -1;
}

function isBoundaryPunctuation(char: string) {
  return /[^\p{L}\p{N}\s]/u.test(char);
}

function clampRangeToLine(text: string, range: DiffRange): DiffRange {
  const lineStart = text.lastIndexOf("\n", Math.max(0, range.start - 1));
  const lineEnd = text.indexOf("\n", range.end);

  return {
    start: Math.max(range.start, lineStart === -1 ? 0 : lineStart + 1),
    end: Math.min(range.end, lineEnd === -1 ? text.length : lineEnd)
  };
}

function getLineBoundsAtPosition(text: string, position: number): DiffRange {
  const safePosition = Math.min(Math.max(position, 0), text.length);
  const lineStart = text.lastIndexOf("\n", Math.max(0, safePosition - 1));
  const lineEnd = text.indexOf("\n", safePosition);

  return {
    start: lineStart === -1 ? 0 : lineStart + 1,
    end: lineEnd === -1 ? text.length : lineEnd
  };
}

function getContextBoundsForSpan(
  text: string,
  tokens: WordToken[],
  spanStart: number,
  spanEnd: number
): DiffRange {
  if (tokens.length === 0) {
    return {
      start: 0,
      end: text.length
    };
  }

  const lineBounds = getLineBoundsAtPosition(text, spanStart);
  let firstOverlap = -1;
  let lastOverlap = -1;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const overlaps = token.start < spanEnd && token.end > spanStart;

    if (!overlaps) {
      continue;
    }

    if (firstOverlap === -1) {
      firstOverlap = index;
    }

    lastOverlap = index;
  }

  let startIndex: number;
  let endIndex: number;

  if (firstOverlap !== -1 && lastOverlap !== -1) {
    startIndex = Math.max(0, firstOverlap - CONTEXT_WORDS);
    endIndex = Math.min(tokens.length - 1, lastOverlap + CONTEXT_WORDS);
  } else {
    const nearestBefore = findNearestTokenBefore(tokens, spanStart);
    const nearestAfter = findNearestTokenAfter(tokens, spanEnd);

    if (nearestBefore === -1 && nearestAfter === -1) {
      return {
        start: 0,
        end: text.length
      };
    }

    const anchorStart = nearestBefore === -1 ? nearestAfter : nearestBefore;
    const anchorEnd = nearestAfter === -1 ? nearestBefore : nearestAfter;

    startIndex = Math.max(0, anchorStart - CONTEXT_WORDS);
    endIndex = Math.min(tokens.length - 1, anchorEnd + CONTEXT_WORDS);
  }

  while (startIndex < tokens.length && tokens[startIndex].start < lineBounds.start) {
    startIndex += 1;
  }

  while (endIndex >= 0 && tokens[endIndex].end > lineBounds.end) {
    endIndex -= 1;
  }

  if (startIndex >= tokens.length || endIndex < 0 || startIndex > endIndex) {
    return lineBounds;
  }

  let start = tokens[startIndex].start;
  let end = tokens[endIndex].end;

  while (start > lineBounds.start && isBoundaryPunctuation(text[start - 1])) {
    start -= 1;
  }

  while (end < lineBounds.end && isBoundaryPunctuation(text[end])) {
    end += 1;
  }

  return clampRangeToLine(text, {
    start: Math.max(start, lineBounds.start),
    end: Math.min(end, lineBounds.end)
  });
}

function normalizeSnippet(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildEditContexts(original: string, revised: string): EditSnippet[] {
  const mergedSpans = mergeAdjacentSpans(buildEditSpans(original, revised), original, revised);
  const originalTokens = getWordTokens(original);

  return mergedSpans.map((span, index) => {
    const contextBounds = getContextBoundsForSpan(
      original,
      originalTokens,
      span.originalStart,
      span.originalEnd
    );

    const revisedSlice = revised.slice(span.revisedStart, span.revisedEnd);
    const prefix = original.slice(contextBounds.start, span.originalStart);
    const suffix = original.slice(span.originalEnd, contextBounds.end);
    const before = original.slice(contextBounds.start, contextBounds.end);
    const after = prefix + revisedSlice + suffix;

    return {
      id: index + 1,
      before: normalizeSnippet(before),
      after: normalizeSnippet(after),
      originalRange: {
        start: span.originalStart,
        end: span.originalEnd
      },
      revisedRange: {
        start: span.revisedStart,
        end: span.revisedEnd
      },
      contextStart: contextBounds.start,
      revisedContextStart: Math.max(0, span.revisedStart - prefix.length)
    };
  });
}

function toSnippetText(label: string, snippets: EditSnippet[]): string {
  const lines = [`[${label}]`, "EDIT_SNIPPETS:"];

  if (snippets.length === 0) {
    lines.push("- No word-level changes detected.");
  } else {
    snippets.forEach((snippet) => {
      lines.push(`${snippet.id}. "${snippet.before}" -> "${snippet.after}"`);
    });
  }

  return lines.join("\n");
}

function buildSnippetSet(label: string, original: string, revised: string): DiffSnippetSet {
  const snippets = buildEditContexts(original, revised);

  return {
    text: toSnippetText(label, snippets),
    snippets
  };
}

export function buildDiffPayload(
  original: string,
  minimallyCorrected: string,
  rewritten: string
): DiffPayload {
  return {
    originalToCorrected: buildSnippetSet(
      "ORIGINAL_TO_MINIMALLY_CORRECTED",
      original,
      minimallyCorrected
    ),
    originalToRewritten: buildSnippetSet("ORIGINAL_TO_REWRITTEN", original, rewritten)
  };
}
