import { redirect } from "next/navigation";

export const metadata = {
  title: "Homepage Design | Shortkey",
  description: "Homepage redesign — now live on the main site.",
};

/** Redesign merged to `/` — keep this route as a convenience redirect */
export default function DesignPreviewPage() {
  redirect("/");
}
