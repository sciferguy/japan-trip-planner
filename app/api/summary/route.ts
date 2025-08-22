import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { auth } from '@/lib/auth'
import { run, ok, fail } from '@/lib/api/response'

export const POST = () =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) {
      return fail(401, 'UNAUTH', 'Unauthorized')
    }

    try {
      const filePath = join(process.cwd(), "docs/project-summary_MVP.md");
      const data = await readFile(filePath, "utf8");
      return ok({ summary: data });
    } catch {
      return fail(500, 'INTERNAL_ERROR', 'Failed to read summary file');
    }
  })