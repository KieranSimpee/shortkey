import { AppendForm } from "../_components/AppendForm";
import { DataTable } from "../_components/DataTable";
import { readTasks } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

const COLUMNS = ["id", "owner", "title", "status", "phase", "blockedBy", "detail"];

export default async function TasksPage() {
  const tasks = await readTasks();

  return (
    <>
      <h1 className="sao-h1">Tasks</h1>
      <p className="sao-lead">
        AI team task center — Kura · Maya · Senti · Simpee. Status: todo until claimed.
      </p>

      <AppendForm
        endpoint="/api/sky-asia/tasks"
        fields={["id", "owner", "title", "detail", "status", "phase"]}
        defaults={{ status: "todo", phase: "2" }}
      />

      <DataTable columns={COLUMNS} rows={tasks} />
    </>
  );
}
