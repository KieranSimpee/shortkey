import { AppendForm } from "../_components/AppendForm";
import { DataTable } from "../_components/DataTable";
import { DB_COLUMNS, readDb } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const rows = await readDb("brands");
  const columns = DB_COLUMNS.brands;

  return (
    <>
      <h1 className="sao-h1">Brands</h1>
      <p className="sao-lead">
        Batch 001 · {rows.length} records · No public pricing in Potential Collaboration notes.
      </p>
      <AppendForm
        endpoint="/api/sky-asia/db/brands"
        fields={columns}
        defaults={{
          "Potential Collaboration": "CURSOR_RESEARCH · pending KURA_QC",
        }}
      />
      <DataTable columns={columns} rows={rows} />
    </>
  );
}
