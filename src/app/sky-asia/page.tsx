import Link from "next/link";
import { getCounts, readSeason01 } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function SkyAsiaHomePage() {
  const [counts, season] = await Promise.all([getCounts(), readSeason01()]);

  return (
    <>
      <h1 className="sao-h1">SKY ASIA OS</h1>
      <p className="sao-lead">
        Internal ops MVP — structure Season 01, manage slots, store research, track AI
        team tasks. Discover Asia. Support Creators. Celebrate Culture.
      </p>

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
        </p>
      </div>

      <div className="sao-card">
        <h2>Next</h2>
        <ol style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.9rem" }}>
          <li>Paste KURA_API_KEY → run Batch 001 QC</li>
          <li>Maya templates · Senti visual · Simpee revenue lists</li>
          <li>Keep filing research into Knowledge Hub</li>
        </ol>
      </div>
    </>
  );
}
