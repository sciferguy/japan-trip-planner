import { handlers } from "@/lib/auth";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;