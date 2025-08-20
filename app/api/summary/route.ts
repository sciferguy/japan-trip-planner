import { join } from "node:path";
import { readFile } from "node:fs/promises";

export async function POST() {
  try {
    const filePath = join(process.cwd(), "project-summary_MVP.md");
    const data = await readFile(filePath, "utf8");
    return new Response(JSON.stringify({ summary: data }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}