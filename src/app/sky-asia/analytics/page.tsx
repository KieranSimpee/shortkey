import Link from "next/link";
import { getCounts, readTasks } from "@/lib/sky-asia/data";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [counts, tasks] = await Promise.all([getCounts(), readTasks()]);
  const byOwner: Record<string, number> = {};
  for (const t of tasks) {
    const owner = String(t.owner ?? "unknown");
    byOwner[owner] = (byOwner[owner] ?? 0) + 1;
  }
  const todo = tasks.filter((t) => t.status === "todo").length;

  return (
    <>
      <h1 className="sao-h1">Analytics</h1>
      <p className="sao-lead">MVP counts only — no Phase 7 automation.</p>

      <div className="sao-grid">
        {Object.entries(counts).map(([key, n]) => (
          <div className="sao-stat" key={key}>
            <strong>{n}</strong>
            <span>{key.toUpperCase()}</span>
          </div>
        ))}
        <div className="sao-stat">
          <strong>{todo}</strong>
          <span>TASKS TODO</span>
        </div>
      </div>

      <div className="sao-card">
        <h2>Tasks by owner</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.9rem" }}>
          {Object.entries(byOwner).map(([owner, n]) => (
            <li key={owner}>
              {owner}: {n}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/sky-asia/tasks">Task Center →</Link>
        </p>
      </div>
    </>
  );
}
