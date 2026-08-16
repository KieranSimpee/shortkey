type CoverStoryCardProps = {
  title: string;
  status: string;
  relativePath: string;
  body: string;
  gates: {
    gorGorReview: string;
    kieranApproval: string;
  };
  /** When true, show full body; otherwise lede + link. */
  full?: boolean;
};

function ledeFromBody(body: string): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.replace(/^#+\s+/gm, "").replace(/\*\*/g, "").trim())
    .filter(Boolean);
  return paragraphs[0]?.slice(0, 280) ?? "";
}

export function CoverStoryCard({
  title,
  status,
  relativePath,
  body,
  gates,
  full = false,
}: CoverStoryCardProps) {
  const lede = ledeFromBody(body);

  return (
    <article className="sao-card sao-cover">
      <p className="sao-muted" style={{ marginBottom: "0.35rem" }}>
        <span className="sao-tag">COVER STORY</span>
        <span className="sao-tag">{status}</span>
      </p>
      <h2 style={{ fontSize: full ? "1.35rem" : "1.1rem" }}>{title}</h2>
      <p className="sao-muted">
        Gor Gor: {gates.gorGorReview} · Kieran: {gates.kieranApproval}
      </p>
      <p className="sao-muted" style={{ fontSize: "0.75rem" }}>
        {relativePath}
      </p>
      {full ? (
        <div className="sao-prose">
          {body.split(/\n\n+/).map((block, i) => {
            const trimmed = block.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={i}>{trimmed.replace(/^##\s+/, "")}</h3>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={i}>{trimmed.replace(/^###\s+/, "")}</h4>
              );
            }
            if (/^\d+\.\s/m.test(trimmed)) {
              const items = trimmed.split(/\n/).filter(Boolean);
              return (
                <ol key={i}>
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^\d+\.\s*/, "")}</li>
                  ))}
                </ol>
              );
            }
            if (trimmed.startsWith("- ")) {
              const items = trimmed.split(/\n/).filter((l) => l.startsWith("- "));
              return (
                <ul key={i}>
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^-+\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{trimmed.replace(/\*\*/g, "")}</p>;
          })}
        </div>
      ) : (
        <p style={{ marginTop: "0.5rem", fontSize: "0.92rem" }}>
          {lede}
          {lede.length >= 280 ? "…" : ""}
        </p>
      )}
    </article>
  );
}
