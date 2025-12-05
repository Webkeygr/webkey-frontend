"use client";

import { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "./PageTransition";

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  label?: string; // τι θα γράφει στο loader (αν δεν δώσεις, θα το βγάλει από το href)
};

function getLabelFromHref(href: string): string {
  if (href === "/" || href === "/en" || href === "/en/") return "Home";
  if (href === "/contact" || href === "/en/contact") return "Contact";

  const parts = href.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function TransitionLink({
  href,
  children,
  className,
  ariaLabel,
  label,
}: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const finalLabel = label ?? getLabelFromHref(href);

    startTransition(finalLabel, () => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
