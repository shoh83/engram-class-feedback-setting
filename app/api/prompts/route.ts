import { NextResponse } from "next/server";

import { listPromptFiles, writePromptFile } from "@/lib/prompt-files";

export async function GET() {
  const files = await listPromptFiles();
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { path?: string; content?: string };

  if (!body.path || typeof body.content !== "string") {
    return NextResponse.json({ error: "Missing path or content." }, { status: 400 });
  }

  if (!body.path.startsWith("prompts/") || !body.path.endsWith(".txt")) {
    return NextResponse.json({ error: "Only prompt .txt files can be updated." }, { status: 400 });
  }

  await writePromptFile(body.path, body.content);
  return NextResponse.json({ ok: true });
}
