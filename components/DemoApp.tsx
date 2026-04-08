"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { ConfigForm } from "@/components/ConfigForm";
import { ConfirmReport } from "@/components/ConfirmReport";
import { DiffVisual } from "@/components/DiffVisual";
import { JsonResponsePanel } from "@/components/JsonResponsePanel";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { OutputCards } from "@/components/OutputCards";
import { PromptPanel } from "@/components/PromptPanel";
import { TextInputs } from "@/components/TextInputs";
import { defaultConfig, sampleInputs } from "@/lib/default-config";
import type {
  FeedbackConfigState,
  FeedbackResponse,
  GenerateResponse,
  PromptFileRecord,
  ResponseMetrics,
  WritingInputs
} from "@/types/app";

export function DemoApp() {
  const [config, setConfig] = useState<FeedbackConfigState>(defaultConfig);
  const [inputs, setInputs] = useState<WritingInputs>(sampleInputs);
  const [promptText, setPromptText] = useState("");
  const [usedFiles, setUsedFiles] = useState<string[]>([]);
  const [promptFiles, setPromptFiles] = useState<PromptFileRecord[]>([]);
  const [result, setResult] = useState<FeedbackResponse | null>(null);
  const [metrics, setMetrics] = useState<ResponseMetrics | null>(null);
  const [rawResponseJson, setRawResponseJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);
  async function loadPromptFiles() {
    const response = await fetch("/api/prompts");
    const data = (await response.json()) as { files: PromptFileRecord[] };
    setPromptFiles(data.files);
  }

  useEffect(() => {
    document.title = "엔그램 클래스";
  }, []);

  useEffect(() => {
    void loadPromptFiles();
  }, []);

  useEffect(() => {
    if (!confirmedAt || !reportRef.current) {
      return;
    }

    reportRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [confirmedAt]);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ config, inputs })
        });

        const data = (await response.json()) as GenerateResponse & { error?: string };
        if (!response.ok) {
          throw new Error(data.error || "Generation failed.");
        }

        setPromptText(data.promptPreview.prompt);
        setUsedFiles(data.promptPreview.usedFiles);
        setResult(data.result);
        setMetrics(data.metrics);
        setRawResponseJson(data.rawResponseJson);
        await loadPromptFiles();
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Generation failed.");
      }
    });
  }

  async function handleSavePromptFile(path: string, content: string) {
    setIsSavingPrompt(true);
    setError(null);

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ path, content })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to save prompt file.");
      }

      await loadPromptFiles();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save prompt file.");
    } finally {
      setIsSavingPrompt(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="page-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-title">Configuration</p>
              <h1 className="headline">엔그램 클래스</h1>
            </div>
            <div className="chip-list">
              <span className="chip active">Local Only</span>
              <span className="chip">GPT-5.4</span>
              <span className="chip">Structured JSON</span>
            </div>
          </div>
          <div className="panel-body stack">
            <p className="subtle">
              Configure Korean EFL feedback options, inspect the composed prompt, and edit generated cards inline.
            </p>
            <ConfigForm config={config} onChange={setConfig} />
            <TextInputs inputs={inputs} onChange={setInputs} />
            <div className="stack">
              <p className="section-title">Original vs Minimally Corrected Diff</p>
              <DiffVisual before={inputs.originalText} after={inputs.minimallyCorrectedText} />
            </div>
            <div className="button-row">
              <button className="button-primary" type="button" onClick={handleGenerate} disabled={isPending || isSavingPrompt}>
                {isPending ? "Generating..." : "Generate Feedback"}
              </button>
              <button
                className="button-secondary"
                type="button"
                onClick={() => {
                  setConfig(defaultConfig);
                  setInputs(sampleInputs);
                  setRawResponseJson("");
                  setResult(null);
                  setMetrics(null);
                  setPromptText("");
                  setUsedFiles([]);
                  setConfirmedAt(null);
                  setError(null);
                }}
                disabled={isPending || isSavingPrompt}
              >
                Reset Sample Data
              </button>
            </div>
            {error ? <div className="error-banner">{error}</div> : null}
          </div>
        </section>

        <section className="stack">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="section-title">Prompt System</p>
                <h2 className="headline">Composable Prompt Preview</h2>
              </div>
            </div>
            <div className="panel-body stack">
              <PromptPanel
                promptText={promptText}
                usedFiles={usedFiles}
                promptFiles={promptFiles}
                onSaveFile={handleSavePromptFile}
                isSaving={isSavingPrompt}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="section-title">Output</p>
                <h2 className="headline">Editable Feedback Cards</h2>
              </div>
            </div>
            <div className="panel-body stack">
              <MetricsDisplay metrics={metrics} />
              <OutputCards result={result} onChange={setResult} />
              <JsonResponsePanel rawResponseJson={rawResponseJson} result={result} />
              <div className="button-row">
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => setConfirmedAt(new Date().toISOString())}
                  disabled={!result || isPending || isSavingPrompt}
                >
                  {confirmedAt ? "Refresh Confirmed Report" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {confirmedAt ? (
        <div ref={reportRef}>
          <ConfirmReport
            result={result}
            confirmedAt={confirmedAt}
            inputs={inputs}
          />
        </div>
      ) : null}
    </main>
  );
}
