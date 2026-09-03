import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  solid:
    "rounded-[3px] border-2 border-[#0e0e0e] bg-cream text-[#0e0e0e] shadow-[5px_5px_0_0_#c82323] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#c82323]",
  outline: "rounded-[3px] border-2 border-cream/25 text-cream hover:border-crimson hover:text-crimson",
  ghost: "text-cream/70 hover:text-cream",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  style?: CSSProperties;
  external?: boolean;
};

type ButtonAsButton = CommonProps & {
  as?: "button";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  href?: never;
};

type ButtonAsLink = CommonProps & {
  as?: "a";
  href: string;
  onClick?: never;
  disabled?: never;
  type?: never;
};

type ButtonAsNextLink = CommonProps & {
  as?: "next";
  href: string;
  onClick?: never;
  disabled?: never;
  type?: never;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsNextLink;

export default function Button({
  children,
  className,
  variant = "solid",
  size = "md",
  style,
  external,
  ...props
}: ButtonProps) {
  const classes = cn(
    "btn-base font-medium transition-colors duration-300 select-none cursor-pointer",
    styles[variant],
    sizes[size],
    className
  );

  if (props.as === "a") {
    return (
      <a
        href={props.href}
        style={style}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        {children}
      </a>
    );
  }

  if (props.as === "next") {
    return (
      <Link href={props.href} style={style} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      style={style}
      className={classes}
    >
      {children}
    </button>
  );
}
