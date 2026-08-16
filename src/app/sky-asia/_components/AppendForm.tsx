"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Props = {
  endpoint: string;
  fields: string[];
  defaults?: Record<string, string>;
};

export function AppendForm({ endpoint, fields, defaults = {} }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | number | null> = {};
    for (const key of fields) {
      const raw = String(fd.get(key) ?? "").trim();
      if (key === "Followers") {
        body[key] = raw === "" ? null : Number(raw);
      } else {
        body[key] = raw;
      }
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      setOk(true);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="sao-form" onSubmit={onSubmit}>
      <strong style={{ fontSize: "0.85rem" }}>Append record</strong>
      {fields.map((field) => {
        const isLong =
          field === "Story Potential" ||
          field === "Niche" ||
          field === "Potential Collaboration" ||
          field === "Story Angle";
        const optional = field === "Followers" || field === "Contact";
        return (
          <label key={field}>
            {field}
            {isLong ? (
              <textarea
                name={field}
                rows={2}
                defaultValue={defaults[field] ?? ""}
                required={!optional}
              />
            ) : (
              <input
                name={field}
                defaultValue={defaults[field] ?? ""}
                required={!optional}
              />
            )}
          </label>
        );
      })}
      <button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </button>
      {ok ? <span className="sao-muted">Saved.</span> : null}
      {error ? (
        <span className="sao-muted" style={{ color: "#8b2942" }}>
          {error}
        </span>
      ) : null}
    </form>
  );
}
