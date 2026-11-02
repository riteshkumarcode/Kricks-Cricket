"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_RATES, formatMoney } from "@/lib/tokens";
import { useToast } from "@/components/ui/Toast";

export interface CartLineItem {
  id: string;
  name: string;
  opts?: string;
  price: number; // in INR minor units (paise)
  qty: number;
  bat?: {
    blade: string;
    grip: string;
    sticker: string;
    grains: number;
    name?: string;
    num?: string;
  };
  drawingType?: string;
  color1?: string;
  color2?: string;
}

interface StoreContextType {
  currency: string;
  setCurrency: (c: string) => void;
  cart: CartLineItem[];
  addToCart: (item: CartLineItem) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  isBadgeBumping: boolean;
  formatPrice: (inrMinor: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>("INR");
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isBadgeBumping, setIsBadgeBumping] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { showToast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCur = localStorage.getItem("kricks-cur");
      if (savedCur && DEFAULT_RATES[savedCur]) {
        setCurrencyState(savedCur);
      }

      const savedCart = localStorage.getItem("kricks-cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Seed default cart items from static design if empty
        const defaultSeeded = [
          {
            id: "pro-edition",
            name: "Pro Edition",
            opts: "Short Handle · 2lb 9oz · Knocked in",
            price: 2579900,
            qty: 1,
            bat: {
              blade: "#E8CE95",
              grip: "#C3262C",
              sticker: "#0A0A0A",
              grains: 11,
            },
          },
          {
            id: "gloves",
            name: "Batting Gloves",
            opts: "Men's · Right-handed",
            price: 229900,
            qty: 1,
            drawingType: "gloves",
            color1: "#F3EEE3",
            color2: "#C3262C",
          },
        ];
        setCart(defaultSeeded);
        localStorage.setItem("kricks-cart", JSON.stringify(defaultSeeded));
      }
    } catch (e) {
      console.error("Storage error:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  const setCurrency = (c: string) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("kricks-cur", c);
    } catch (e) {}
  };

  const saveCart = (newCart: CartLineItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("kricks-cart", JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (line: CartLineItem) => {
    const key = `${line.id}|${line.opts || ""}|${JSON.stringify(line.bat || {})}`;
    const index = cart.findIndex(
      (l) => `${l.id}|${l.opts || ""}|${JSON.stringify(l.bat || {})}` === key
    );

    let nextCart = [...cart];
    if (index >= 0) {
      nextCart[index].qty += line.qty || 1;
    } else {
      nextCart.push({ ...line, qty: line.qty || 1 });
    }

    saveCart(nextCart);

    // Trigger cart badge bump animation
    setIsBadgeBumping(true);
    setTimeout(() => setIsBadgeBumping(false), 500);

    showToast(`${line.name} is in your cart.`, "View cart", "/cart");
  };

  const updateQuantity = (index: number, delta: number) => {
    if (index < 0 || index >= cart.length) return;
    const nextCart = [...cart];
    const newQty = nextCart[index].qty + delta;
    if (newQty > 0 && newQty <= 20) {
      nextCart[index].qty = newQty;
      saveCart(nextCart);
    }
  };

  const removeFromCart = (index: number) => {
    if (index < 0 || index >= cart.length) return;
    const nextCart = cart.filter((_, i) => i !== index);
    saveCart(nextCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  const formatPrice = (inrMinor: number) => {
    return formatMoney(inrMinor, currency, DEFAULT_RATES);
  };

  return (
    <StoreContext.Provider
      value={{
        currency,
        setCurrency,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        isBadgeBumping,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

