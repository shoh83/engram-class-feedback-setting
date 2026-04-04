# EFL Writing Feedback Demo

Local-only Next.js demo for configuring Korean EFL writing feedback options, composing a modular prompt from prompt-fragment files, calling `gpt-5.4` with `reasoning.effort = "medium"`, and rendering editable structured-output cards.

## Features

- App Router + TypeScript
- Local-only API route for model calls
- Prompt fragments stored as separate editable `.txt` files under `prompts/`
- Deterministic prompt assembly based on selected feedback options
- Inputs for original, minimally corrected, and rewritten text
- Structured diff payload included in the composed prompt
- Structured JSON output validated with `zod`
- Editable output cards after generation
- Prompt preview and prompt fragment editor in the UI
- Processing time and token usage display
- Mock fallback when `OPENAI_API_KEY` is not present

## Folder Structure

```text
app/
  api/
    generate/route.ts
    prompts/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ConfigForm.tsx
  DemoApp.tsx
  MetricsDisplay.tsx
  OutputCards.tsx
  PromptPanel.tsx
  TextInputs.tsx
lib/
  constants.ts
  default-config.ts
  diff.ts
  mock-response.ts
  openai.ts
  prompt-composer.ts
  prompt-files.ts
  schema.ts
prompts/
  assignment-types/
  evaluation/
  feedback/
  language/
  levels/
  output/
  scoring/
  sources/
  common-instructions.txt
  role.txt
types/
  app.ts
```

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. Add your API key to `.env.local`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.4
```

4. Start the demo:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Notes

- The app stays local to your machine. There is no database and no deployment setup.
- Prompt files can be edited from the prompt panel and are written back to the local `prompts/` directory.
- If no API key is configured, the `/api/generate` route returns a typed mock response so the UI can still be tested.
- Token counters are taken from `response.usage` when available. If the SDK or model path omits them, the UI shows `n/a`.

## Prompt Design

- The original two reference prompts are preserved under `prompts/sources/`.
- The active prompt system breaks those prompts into reusable fragments for:
  - role and common instructions
  - output language
  - stage and proficiency
  - assignment-type rubric behavior
  - evaluation
  - feedback
  - descriptive-answer scoring
  - strengths / improvement sections
  - structured output instructions

## Test Path

- Launch without an API key to verify the UI using the built-in mock response.
- Then add `OPENAI_API_KEY` and regenerate to exercise the live API route.
