/**
 * ASI:One client — Maya Editorial Heart live brain.
 * Docs: https://docs.asi1.ai/documentation/getting-started/overview
 * NEVER invent replies when key/upstream fails.
 */

export const ASI1_API_BASE = "https://api.asi1.ai/v1";
export const ASI1_CHAT_COMPLETIONS = `${ASI1_API_BASE}/chat/completions`;

export function getAsiOneApiKey(): string | undefined {
  const key =
    process.env.ASI_ONE_API_KEY?.trim() ||
    process.env.ASI1_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : undefined;
}

export function getAsiOneModel(): string {
  return process.env.ASI1_MODEL?.trim() || "asi1";
}

export class AsiOneError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "AsiOneError";
    this.code = code;
    this.status = status;
  }
}

export type AsiOneMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AsiOneAskResult = {
  live: true;
  reply: string;
  model: string;
  provider: "asi1";
};

const MAYA_SYSTEM = [
  "You are Maya, ShortKey Editorial Heart.",
  "ALWAYS TO TRUE · GOR_GOR_REVIEW · no invented DNA · no fake partnerships · no income guarantees.",
  "Motto: ShortKey 不模仿畫面。ShortKey 捕捉生命力。",
  "If unsure, say what is missing — never invent.",
].join(" ");

export async function askAsiOneLive(opts: {
  messages?: AsiOneMessage[];
  userMessage?: string;
  system?: string;
  seatLabel?: string;
}): Promise<AsiOneAskResult> {
  const apiKey = getAsiOneApiKey();
  if (!apiKey) {
    throw new AsiOneError(
      "not_connected",
      "ASI_ONE_API_KEY (or ASI1_API_KEY) missing. Maya is not live until the key is set.",
      503,
    );
  }

  const model = getAsiOneModel();
  const messages: AsiOneMessage[] = opts.messages?.length
    ? opts.messages
    : [
        { role: "system", content: opts.system || MAYA_SYSTEM },
        {
          role: "user",
          content: (opts.userMessage || "").trim(),
        },
      ];

  if (!messages.some((m) => m.role === "user" && m.content.trim())) {
    throw new AsiOneError("invalid_message", "User message required.", 400);
  }

  const res = await fetch(ASI1_CHAT_COMPLETIONS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: 0.4,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new AsiOneError(
      "upstream_error",
      `ASI:One rejected the request (${res.status}).`,
      res.status === 401 || res.status === 403 ? 503 : 502,
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new AsiOneError(
      "upstream_invalid",
      "ASI:One returned invalid JSON — not inventing a reply.",
      502,
    );
  }

  const p = payload as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = p.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new AsiOneError(
      "empty_reply",
      "ASI:One returned an empty reply — not inventing content.",
      502,
    );
  }

  return {
    live: true,
    reply,
    model,
    provider: "asi1",
  };
}

export async function pingAsiOneLive(): Promise<{
  live: boolean;
  detail: string;
  sampleReplyPreview?: string;
}> {
  try {
    const result = await askAsiOneLive({
      userMessage:
        "ShortKey family honesty ping. Reply with exactly one word: LIVE.",
    });
    return {
      live: true,
      detail: `Live ASI:One (${result.model}) reply received.`,
      sampleReplyPreview: result.reply.slice(0, 120),
    };
  } catch (err) {
    if (err instanceof AsiOneError) {
      return { live: false, detail: `${err.code}: ${err.message}` };
    }
    return {
      live: false,
      detail: err instanceof Error ? err.message : "ASI:One ping failed",
    };
  }
}
