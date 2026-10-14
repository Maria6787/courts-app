"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EQUIPMENT } from "@/lib/data";
import { formatIDR } from "@/lib/format";

export function EquipmentStore() {
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(EQUIPMENT.map((e) => e.category)))],
    [],
  );

  const equipment = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EQUIPMENT.filter((e) => {
      const matchesCat = category === "All" || e.category === category;
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <section id="store" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-3xl font-black sm:text-4xl">
          <Store className="h-8 w-8 text-accent-500" />
          Sport Store
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Grab rackets, shuttlecocks, and gear before your session.
        </p>
      </div>

      {/* Search + category filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gear…"
            className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                category === c
                  ? "bg-accent-500 text-slate-900 shadow"
                  : "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {equipment.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400">
          No items match your search.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="glass group flex flex-col overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item.imageUrl ??
                    "https://placehold.co/600x450/06b6d4/fff?text=Courts"
                  }
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black">
                    {formatIDR(item.price)}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="brand-gradient flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
