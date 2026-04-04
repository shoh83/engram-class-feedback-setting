import { promises as fs } from "fs";
import path from "path";

import type { PromptFileRecord } from "@/types/app";

const PROMPTS_ROOT = path.join(process.cwd(), "prompts");

function toPromptAbsolutePath(relativePath: string) {
  const normalized = relativePath.replace(/^prompts\//, "");
  return path.join(PROMPTS_ROOT, normalized);
}

async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkDir(fullPath);
      }
      return [fullPath];
    })
  );

  return nested.flat();
}

export async function listPromptFiles(): Promise<PromptFileRecord[]> {
  const files = await walkDir(PROMPTS_ROOT);
  const promptFiles = files
    .filter((filePath) => filePath.endsWith(".txt"))
    .sort();

  return Promise.all(
    promptFiles.map(async (filePath) => ({
      path: path.relative(process.cwd(), filePath).replaceAll(path.sep, "/"),
      content: await fs.readFile(filePath, "utf8")
    }))
  );
}

export async function readPromptFile(relativePath: string) {
  const absolutePath = toPromptAbsolutePath(relativePath);
  return fs.readFile(absolutePath, "utf8");
}

export async function writePromptFile(relativePath: string, content: string) {
  const absolutePath = toPromptAbsolutePath(relativePath);
  await fs.writeFile(absolutePath, content, "utf8");
}
