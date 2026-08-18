import Link from "next/link";
import { readSeason01 } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function SeasonsPage() {
  const season = await readSeason01();

  return (
    <>
      <h1 className="sao-h1">Seasons</h1>
      <p className="sao-lead">Magazine season structure + content slot status.</p>

      <div className="sao-card">
        <h2>{season.title}</h2>
        <p className="sao-muted">
          {season.theme} · Countries: {season.countries.join(", ")} · {season.status}
        </p>
      </div>

      <h2 style={{ fontSize: "1rem" }}>Content framework</h2>
      {season.framework.map((f) => (
        <div className="sao-card" key={f.slot}>
          <h3>
            <span className="sao-tag">{f.status}</span>
            {f.slot}
          </h3>
          <p style={{ margin: "0.25rem 0", fontWeight: 600 }}>{f.title}</p>
          <p className="sao-muted">{f.angle}</p>
        </div>
      ))}

      <h2 style={{ fontSize: "1rem", marginTop: "1.25rem" }}>All slots</h2>
      <div className="sao-table-wrap">
        <table className="sao-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>File</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {season.slots.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.file}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/sky-asia/content">Content module →</Link>
      </p>
    </>
  );
}
