import Link from "next/link";
import { CoverStoryCard } from "../_components/CoverStoryCard";
import { readCoverStory, readSeason01 } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [season, cover] = await Promise.all([
    readSeason01(),
    readCoverStory(),
  ]);

  return (
    <>
      <h1 className="sao-h1">Content</h1>
      <p className="sao-lead">
        Season 01 publishable drafts — Cover Story first. Gates: GOR_GOR_REVIEW →
        Kieran approval. No auto-social.
      </p>

      {cover ? <CoverStoryCard {...cover} full /> : (
        <div className="sao-card">
          <p className="sao-muted">Cover Story draft not found yet.</p>
        </div>
      )}

      <h2 style={{ fontSize: "1rem", marginTop: "1.25rem" }}>All slots</h2>
      {season.framework.map((f) => (
        <div className="sao-card" key={f.slot}>
          <h2>
            <span className="sao-tag">{f.status}</span>
            <span className="sao-tag">{f.slot}</span>
            {f.title}
          </h2>
          <p className="sao-muted">{f.angle}</p>
          {f.path ? (
            <p className="sao-muted" style={{ fontSize: "0.75rem" }}>
              {f.path}
            </p>
          ) : null}
        </div>
      ))}

      <div className="sao-card">
        <h2>Open stubs</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.9rem" }}>
          {season.slots
            .filter((s) => s.status === "stub")
            .map((s) => (
              <li key={s.id}>
                {s.id} — {s.file}
              </li>
            ))}
        </ul>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/sky-asia/seasons">Seasons detail →</Link>
          {" · "}
          <Link href="/sky-asia">Home →</Link>
        </p>
      </div>
    </>
  );
}
