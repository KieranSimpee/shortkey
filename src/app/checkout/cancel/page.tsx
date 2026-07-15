import { MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = {
  title: "Checkout cancelled | Shortkey",
};

export default function CheckoutCancelPage() {
  return (
    <MockPageShell
      shortcut="CTRL + $"
      badge="CANCELLED"
      title="Checkout cancelled"
      description="No charge was made. Your bag is still available."
      ctas={[
        { label: "Return to checkout →", href: "/checkout" },
        { label: "Shop →", href: "/shop", variant: "outline" },
      ]}
    />
  );
}
