import { NextResponse } from "next/server";
import { getAsiOneApiKey, getAsiOneModel } from "@/lib/ai/asi1";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/maya/profile
 * Honesty: online ONLY when ASI_ONE_API_KEY is present.
 * Does not invent magazine content or live chat history.
 */
export async function GET() {
  const key = getAsiOneApiKey();
  const online = Boolean(key);

  const issueDir = join(process.cwd(), "public", "magazine-demo", "issue-01");
  let pageArtCount = 0;
  const pages: Array<{ id: string; href: string }> = [];
  if (existsSync(issueDir)) {
    const files = readdirSync(issueDir).filter((f) => /\.png$/i.test(f));
    pageArtCount = files.length;
    for (const file of files) {
      const id = file.replace(/\.png$/i, "");
      pages.push({
        id,
        href: `/magazine-demo/issue-01/${file}`,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    profile: {
      seat: "maya",
      provider: "asi1",
      status: online ? "online" : "offline",
      model: getAsiOneModel(),
      honesty: online
        ? "ASI_ONE_API_KEY present · use ask:maya / /api/ai/asi1/chat for LIVE replies"
        : "NOT_CONNECTED · Needs ASI_ONE_API_KEY — do not invent Maya answers",
    },
    work: {
      magazineDemo: {
        href: "/magazine-demo/#/cover",
        pageArtCount,
        pages,
      },
      pipelineDrafts: [],
      asi1SessionNotes: [],
      syncInbox: [],
      authorityDocs: [
        { id: "maya-skill", path: ".cursor/skills/maya/SKILL.md" },
        { id: "maya-pipeline", path: "src/brand/sky/maya/MAYA_PIPELINE_3008.md" },
      ],
    },
  });
}
