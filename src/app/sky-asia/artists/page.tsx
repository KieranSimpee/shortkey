import { AppendForm } from "../_components/AppendForm";
import { DataTable } from "../_components/DataTable";
import { DB_COLUMNS, readDb } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  const rows = await readDb("artists");
  const columns = DB_COLUMNS.artists;

  return (
    <>
      <h1 className="sao-h1">Artists</h1>
      <p className="sao-lead">
        Batch 001 · {rows.length} records · Instagram unknown = unverified (never invent).
      </p>
      <AppendForm
        endpoint="/api/sky-asia/db/artists"
        fields={columns}
        defaults={{ Status: "CURSOR_RESEARCH · pending KURA_QC", Instagram: "unknown", Website: "unknown" }}
      />
      <DataTable columns={columns} rows={rows} />
    </>
  );
}
