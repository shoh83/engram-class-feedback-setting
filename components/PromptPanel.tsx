"use client";

import { useEffect, useMemo, useState } from "react";

import type { PromptFileRecord } from "@/types/app";

interface PromptPanelProps {
  promptText: string;
  usedFiles: string[];
  promptFiles: PromptFileRecord[];
  onSaveFile: (path: string, content: string) => Promise<void>;
  isSaving: boolean;
}

export function PromptPanel({ promptText, usedFiles, promptFiles, onSaveFile, isSaving }: PromptPanelProps) {
  const selectedDefault = usedFiles[0] ?? promptFiles[0]?.path ?? "";
  const [selectedPath, setSelectedPath] = useState(selectedDefault);
  const [draftContent, setDraftContent] = useState("");

  const selectedFile = useMemo(() => {
    const fallback = promptFiles.find((file) => file.path === selectedDefault) ?? promptFiles[0];
    return promptFiles.find((file) => file.path === selectedPath) ?? fallback;
  }, [promptFiles, selectedDefault, selectedPath]);

  useEffect(() => {
    if (selectedFile) {
      setDraftContent(selectedFile.content);
      setSelectedPath(selectedFile.path);
    }
  }, [selectedFile]);

  return (
    <div className="stack">
      <div className="dense-stack">
        <div className="section-title">Final composed prompt</div>
        <div className="scroll-box prompt-preview">{promptText || "Generate feedback to inspect the assembled prompt."}</div>
      </div>

      <div className="dense-stack">
        <div className="section-title">Used fragment files</div>
        <div className="chip-list">
          {usedFiles.length === 0 ? <span className="chip">No generation yet</span> : null}
          {usedFiles.map((filePath) => (
            <button
              key={filePath}
              type="button"
              className={`chip ${selectedFile?.path === filePath ? "active" : ""}`}
              onClick={() => {
                setSelectedPath(filePath);
                const next = promptFiles.find((file) => file.path === filePath);
                setDraftContent(next?.content ?? "");
              }}
            >
              {filePath.replace("prompts/", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="dense-stack">
        <div className="section-title">Prompt fragment editor</div>
        <div className="field">
          <label htmlFor="promptFileSelect">Prompt file</label>
          <select
            id="promptFileSelect"
            className="control"
            value={selectedFile?.path ?? ""}
            onChange={(event) => {
              const file = promptFiles.find((item) => item.path === event.target.value);
              setSelectedPath(event.target.value);
              setDraftContent(file?.content ?? "");
            }}
          >
            {promptFiles.map((file) => (
              <option key={file.path} value={file.path}>
                {file.path}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="textarea code-block"
          value={draftContent}
          onChange={(event) => setDraftContent(event.target.value)}
          placeholder="Prompt fragment contents"
        />
        <div className="button-row">
          <button
            type="button"
            className="button-secondary"
            disabled={!selectedFile || isSaving}
            onClick={() => {
              if (selectedFile) {
                setDraftContent(selectedFile.content);
              }
            }}
          >
            Revert Editor
          </button>
          <button
            type="button"
            className="button-primary"
            disabled={!selectedFile || isSaving}
            onClick={async () => {
              if (selectedFile) {
                await onSaveFile(selectedFile.path, draftContent);
              }
            }}
          >
            {isSaving ? "Saving..." : "Save Prompt File"}
          </button>
        </div>
      </div>
    </div>
  );
}
