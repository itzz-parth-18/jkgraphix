"use client";

import Link from "next/link";

export default function HomeLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}