"use client";

import { useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OfflineBanner } from "@/components/shared/OfflineBanner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <OfflineBanner />
      {children}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
