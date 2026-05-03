import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/create", label: "Create" },
  { href: "/my-agents", label: "My Agents" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg tracking-wider text-[var(--color-text)]">
            the yard
          </span>
          <nav className="hidden gap-2 md:flex">
            {navItems.map((item) => (
              <Button key={item.href} href={item.href} variant="ghost" className="h-8">
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        <Button variant="primary">Connect Wallet</Button>
      </div>
    </header>
  );
}
