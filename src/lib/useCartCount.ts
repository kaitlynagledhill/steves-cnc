"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/src/lib/cart";

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setCount(getCart().length);
    };

    update();

    // listen for manual updates
    window.addEventListener("storage", update);

    // custom event for same-tab updates
    window.addEventListener("cart-updated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update);
    };
  }, []);

  return count;
}