import Link from "next/link";
import { type MouseEventHandler, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface SharedProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

interface ButtonAsButton extends SharedProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsLink extends SharedProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-accent)] text-white border-[var(--color-accent)]",
  secondary: "bg-transparent text-[var(--color-text)] border-[var(--color-border)]",
  ghost: "bg-transparent text-[var(--color-muted)] border-transparent",
};

const baseClasses =
  "inline-flex h-10 items-center justify-center border px-4 text-sm uppercase tracking-wide transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

export function Button(props: ButtonProps) {
  const { children, className = "", variant = "secondary" } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
