import { DataTable } from "../_components/DataTable";
import { readIntake } from "@/lib/sky-asia/intake";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "id",
  "subject",
  "category",
  "status",
  "assignedTo",
  "submittedBy",
  "submittedAt",
  "agentNotify",
];

export default async function IntakePage() {
  const rows = await readIntake();

  return (
    <>
      <h1 className="sao-h1">Intake</h1>
      <p className="sao-lead">
        Research + outreach + asset submissions. Status stays{" "}
        <code>pending_kieran_review</code> until you approve. No auto-social.
      </p>
      <p className="sao-lead">
        Zapier SOP:{" "}
        <code>SKY_ASIA_OS/03_Workflow/SKY_ASIA_INTAKE_ZAPIER_SOP.md</code>
      </p>
      <DataTable columns={COLUMNS} rows={rows} />
    </>
  );
}
