"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      router.replace(`/product/${hash}`);
    } else {
      router.replace("/product/pro-edition");
    }
  }, [router]);

  return (
    <div className="frame py-24 text-center">
      <p className="font-display text-2xl uppercase tracking-wider text-ink-muted">
        Loading product...
      </p>
    </div>
  );
}

