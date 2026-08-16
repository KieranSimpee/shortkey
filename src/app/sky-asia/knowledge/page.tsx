import { listKnowledgeNotes, readDb, readKnowledgeIndex } from "@/lib/sky-asia/data";
import { DataTable } from "../_components/DataTable";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const [notes, culture, indexMd] = await Promise.all([
    listKnowledgeNotes(),
    readDb("culture"),
    readKnowledgeIndex(),
  ]);

  return (
    <>
      <h1 className="sao-h1">Knowledge Hub</h1>
      <p className="sao-lead">
        Rule: new research goes here (`00_Headquarters/knowledge/`). Batch 001 notes
        linked. Pending KURA_QC.
      </p>

      <div className="sao-card">
        <h2>Notes ({notes.length})</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
          {notes.map((n) => (
            <li key={n.filename}>
              <strong>{n.title}</strong>
              <span className="sao-muted"> — {n.filename}</span>
              <br />
              <span className="sao-tag">{n.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 style={{ fontSize: "1rem" }}>Culture DB (structured)</h2>
      <DataTable
        columns={["Topic", "Country", "Category", "Reference"]}
        rows={culture}
      />

      <div className="sao-card" style={{ marginTop: "1rem" }}>
        <h2>INDEX.md (excerpt)</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "0.7rem",
            margin: 0,
            maxHeight: 240,
            overflow: "auto",
          }}
        >
          {indexMd.slice(0, 2500)}
        </pre>
      </div>
    </>
  );
}
