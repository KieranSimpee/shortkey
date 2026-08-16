import { AppendForm } from "../_components/AppendForm";
import { DataTable } from "../_components/DataTable";
import { DB_COLUMNS, readDb } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const rows = await readDb("creators");
  const columns = DB_COLUMNS.creators;

  return (
    <>
      <h1 className="sao-h1">Creators</h1>
      <p className="sao-lead">
        Batch 001 · {rows.length} records · Followers null unless verified.
      </p>
      <AppendForm
        endpoint="/api/sky-asia/db/creators"
        fields={columns}
        defaults={{ Contact: "unknown" }}
      />
      <DataTable columns={columns} rows={rows} />
    </>
  );
}
