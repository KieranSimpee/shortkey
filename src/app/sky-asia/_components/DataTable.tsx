import { JsonRecord } from "@/lib/sky-asia/data";

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: JsonRecord[];
}) {
  return (
    <div className="sao-table-wrap">
      <table className="sao-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No rows yet.</td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>
                    {row[col] === null || row[col] === undefined
                      ? "—"
                      : String(row[col])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
