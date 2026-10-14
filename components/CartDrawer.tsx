"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatIDR } from "@/lib/format";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    totalPrice,
  } = useCart();

  // Dummy payment flow state.
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleCheckout = () => {
    setPaying(true);
    // Simulate a payment round-trip.
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      clear();
    }, 1200);
  };

  const handleClose = () => {
    setPaid(false);
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-sm dark:bg-slate-800">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment success state */}
        {paid ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/20">
              <div className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-3xl text-white">
                ✓
              </div>
            </div>
            <h3 className="text-2xl font-black">Payment Successful</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Thanks for your order! Your equipment is reserved and ready for
              pickup at the counter.
            </p>
            <button
              onClick={handleClose}
              className="brand-gradient mt-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-slate-500 dark:text-slate-400">
            <ShoppingBag className="h-12 w-12 opacity-40" />
            <p className="font-medium">Your cart is empty.</p>
            <p className="text-sm">Add some gear from the sport store below.</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      item.imageUrl ??
                      "https://placehold.co/80x80/06b6d4/fff?text=Courts"
                    }
                    alt={item.name}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-slate-400 transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatIDR(item.price)}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / checkout */}
            <div className="border-t border-slate-200 p-5 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Total
                </span>
                <span className="text-xl font-black">
                  {formatIDR(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={paying}
                className="brand-gradient w-full rounded-xl py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? "Processing payment…" : "Pay Now"}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
