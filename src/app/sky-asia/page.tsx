import Link from "next/link";
import { CoverStoryCard } from "./_components/CoverStoryCard";
import { getCounts, readCoverStory, readSeason01 } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function SkyAsiaHomePage() {
  const [counts, season, cover] = await Promise.all([
    getCounts(),
    readSeason01(),
    readCoverStory(),
  ]);

  return (
    <>
      <h1 className="sao-h1">SKY ASIA OS</h1>
      <p className="sao-lead">
        Publisher Mode · Season 01 Launch — structure, research, and first publishable
        drafts. Discover Asia. Support Creators. Celebrate Culture.
      </p>

      {cover ? (
        <>
          <CoverStoryCard {...cover} />
          <p style={{ margin: "-0.25rem 0 1rem" }}>
            <Link href="/sky-asia/content">Read full Cover Story on Content →</Link>
          </p>
        </>
      ) : null}

      <div className="sao-grid">
        {(
          [
            ["artists", "Artists", "/sky-asia/artists"],
            ["creators", "Creators", "/sky-asia/creators"],
            ["brands", "Brands", "/sky-asia/brands"],
            ["festivals", "Festivals", "/sky-asia/festivals"],
            ["culture", "Culture", "/sky-asia/knowledge"],
            ["tasks", "Tasks", "/sky-asia/tasks"],
            ["knowledge", "Knowledge", "/sky-asia/knowledge"],
          ] as const
        ).map(([key, label, href]) => (
          <Link key={key} href={href} className="sao-stat" style={{ textDecoration: "none" }}>
            <strong>{counts[key]}</strong>
            <span>{label.toUpperCase()}</span>
          </Link>
        ))}
      </div>

      <div className="sao-card">
        <h2>{season.title}</h2>
        <p className="sao-muted">
          Theme: {season.theme} · {season.status} · Deadline: {season.deadline}
          {season.mode ? ` · ${season.mode}` : ""}
        </p>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem", fontSize: "0.9rem" }}>
          {season.framework.map((f) => (
            <li key={f.slot}>
              <span className="sao-tag">{f.slot}</span>
              {f.title}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/sky-asia/seasons">Open Seasons →</Link>
          {" · "}
          <Link href="/sky-asia/content">Content →</Link>
        </p>
      </div>

      <div className="sao-card">
        <h2>Next</h2>
        <ol style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.9rem" }}>
          <li>Gor Gor review Cover Story → Kieran approval</li>
          <li>Paste KURA_API_KEY → QC Batch 001 + 002</li>
          <li>Maya templates · Senti identity · Simpee 10 partners (stubs)</li>
        </ol>
      </div>
    </>
  );
}
