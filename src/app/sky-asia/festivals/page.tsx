import { AppendForm } from "../_components/AppendForm";
import { DataTable } from "../_components/DataTable";
import { DB_COLUMNS, readDb } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function FestivalsPage() {
  const rows = await readDb("festivals");
  const columns = DB_COLUMNS.festivals;

  return (
    <>
      <h1 className="sao-h1">Festivals</h1>
      <p className="sao-lead">
        Batch 001 · {rows.length} records · Content Ready tracks slot readiness.
      </p>
      <AppendForm
        endpoint="/api/sky-asia/db/festivals"
        fields={columns}
        defaults={{ "Content Ready": "no" }}
      />
      <DataTable columns={columns} rows={rows} />
    </>
  );
}
