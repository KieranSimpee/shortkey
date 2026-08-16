import Link from "next/link";
import { readSeason01 } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const season = await readSeason01();

  return (
    <>
      <h1 className="sao-h1">Content</h1>
      <p className="sao-lead">
        Season 01 content slots — manage angles and readiness. Production copy later.
      </p>

      {season.framework.map((f) => (
        <div className="sao-card" key={f.slot}>
          <h2>
            <span className="sao-tag">{f.slot}</span>
            {f.title}
          </h2>
          <p className="sao-muted">{f.angle}</p>
        </div>
      ))}

      <div className="sao-card">
        <h2>Open slots (stubs)</h2>
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
        </p>
      </div>
    </>
  );
}
